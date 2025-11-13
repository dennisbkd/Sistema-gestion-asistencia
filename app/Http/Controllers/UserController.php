<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserConnection;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Traits\RegistrarBitacora;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    use RegistrarBitacora;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener usuarios con relaciones de roles
        $usuarios = User::with('roles')->get();
        
        // Obtener conexiones activas desde nuestra tabla personalizada
        $conexionesActivas = UserConnection::online()
            ->with('user')
            ->get()
            ->keyBy('user_id');
            
        // Combinar datos
        $usuariosConSesiones = $usuarios->map(function($user) use ($conexionesActivas) {
            $conexion = $conexionesActivas->get($user->id);
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'estado' => $user->estado,
                'ultimoLogin' => $user->ultimoLogin,
                'en_linea' => !is_null($conexion),
                'ultima_ip' => $conexion->ip_address ?? null,
                'ultima_actividad' => $conexion ? $conexion->last_activity_at : null,
                'dispositivo' => $conexion ? 
                    "{$conexion->device_type} - {$conexion->browser} ({$conexion->platform})" : null,
                'tiempo_conectado' => $conexion ? 
                    $conexion->login_at->diffForHumans() : null,
                'roles' => $user->roles->map(function($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'guard_name' => $role->guard_name,
                    ];
                })->toArray(),
            ];
        });

        return inertia('usuarios/Index', [
            'usuarios' => $usuariosConSesiones
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $allRoles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
            ];
        });

        return inertia('usuarios/Create', [
            'usuarios' => new User(),
            'allRoles' => $allRoles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        try {
            $validated = $request->validated();
            
            // Datos antes de la creación (vacío porque es nuevo)
            $datosAntes = null;
            
            $user = User::create($validated);

            // Obtener nombres de roles para la bitácora
            $rolesNombres = [];
            if ($request->has('roles')) {
                $roles = Role::whereIn('id', $request->roles)->get();
                $rolesNombres = $roles->pluck('name')->toArray();
                $user->syncRoles($request->roles);
            }

            // Datos después de la creación
            $datosDespues = [
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $user->estado
                ],
                'roles_asignados' => $rolesNombres
            ];

            // Registrar en bitácora
            $this->registrarBitacora(
                'CREAR',
                'USUARIOS',
                'REGISTRO',
                "Nuevo usuario creado: {$user->name} ({$user->email})",
                $datosAntes,
                $datosDespues,
                $user->id
            );

            return redirect()->route('usuarios.Index')
                ->with('success', 'Usuario creado exitosamente');

        } catch (\Exception $e) {
            
            return redirect()->back()
                ->with('error', 'Error al crear el usuario: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $user->load('roles');
        
        $allRoles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
            ];
        });

        // Registrar en bitácora el acceso a edición
        $this->registrarBitacora(
            'EDITAR',
            'USUARIOS',
            'FORMULARIO',
            "Acceso a edición de usuario: {$user->name}",
            null,
            null,
            $user->id
        );

        return inertia('usuarios/Editar', [
            'usuario' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'estado' => $user->estado,
                'ultimoLogin' => $user->ultimoLogin,
                'roles' => $user->roles->pluck('id')->toArray(),
            ],
            'allRoles' => $allRoles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            // Guardar datos antes de la actualización
            $datosAntes = [
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $user->estado
                ],
                'roles_anteriores' => $user->roles->pluck('name')->toArray()
            ];

            $data = $request->validated();

            // Solo actualizar password si se proporcionó uno nuevo
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
                $passwordCambiado = true;
            } else {
                // Remover el campo password del array si está vacío
                unset($data['password']);
                $passwordCambiado = false;
            }

            // Remover password_confirmation ya que no existe en la tabla
            unset($data['password_confirmation']);

            // Actualizar usuario
            $user->update($data);

            // Obtener nombres de roles nuevos
            $rolesNuevos = [];
            if ($request->has('roles')) {
                $roles = Role::whereIn('id', $request->roles)->get();
                $rolesNuevos = $roles->pluck('name')->toArray();
                $user->syncRoles($request->roles);
            }

            // Datos después de la actualización
            $datosDespues = [
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $user->estado
                ],
                'roles_nuevos' => $rolesNuevos,
                'password_cambiado' => $passwordCambiado,
                'campos_actualizados' => array_keys($data)
            ];

            // Registrar en bitácora
            $this->registrarBitacora(
                'ACTUALIZAR',
                'USUARIOS',
                'EDICION',
                "Usuario actualizado: {$user->name} ({$user->email})",
                $datosAntes,
                $datosDespues,
                $user->id
            );

            return redirect()->route('usuarios.Index')
                ->with('success', 'Usuario actualizado exitosamente');

        } catch (\Exception $e) {
            
            return redirect()->back()
                ->with('error', 'Error al actualizar el usuario: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            // Guardar datos antes de la eliminación
            $datosAntes = [
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $user->estado
                ],
                'roles' => $user->roles->pluck('name')->toArray()
            ];

            $user->delete();

            // Registrar en bitácora
            $this->registrarBitacora(
                'ELIMINAR',
                'USUARIOS',
                'ELIMINACION',
                "Usuario eliminado: {$user->name} ({$user->email})",
                $datosAntes,
                null, // No hay datos después para eliminación
                $user->id
            );

            return redirect()->route('usuarios.Index')
                ->with('success', 'Usuario eliminado exitosamente');

        } catch (\Exception $e) {
            
            return redirect()->back()
                ->with('error', 'Error al eliminar el usuario: ' . $e->getMessage());
        }
    }

    /**
     * Activar/Desactivar usuario
     */
    public function toggleStatus(User $user)
    {
        try {
            $estadoAnterior = $user->estado;
            $nuevoEstado = $user->estado === 'activo' ? 'inactivo' : 'activo';
            
            // Guardar datos antes del cambio
            $datosAntes = [
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $estadoAnterior
                ]
            ];

            $user->update(['estado' => $nuevoEstado]);

            // Datos después del cambio
            $datosDespues = [
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'estado' => $nuevoEstado
                ]
            ];

            // Registrar en bitácora
            $this->registrarBitacora(
                'CAMBIAR_ESTADO',
                'USUARIOS',
                'ESTADO',
                "Estado de usuario cambiado: {$user->name} de {$estadoAnterior} a {$nuevoEstado}",
                $datosAntes,
                $datosDespues,
                $user->id
            );

            return redirect()->route('usuarios.Index')
                ->with('success', "Estado del usuario cambiado a {$nuevoEstado}");

        } catch (\Exception $e) {
            
            return redirect()->back()
                ->with('error', 'Error al cambiar el estado del usuario: ' . $e->getMessage());
        }
    }

    /**
     * Obtener estadísticas de conexiones
     */
    public function estadisticasConexiones()
    {
        $totalUsuarios = User::count();
        $usuariosConectados = UserConnection::online()->count();
        $usuariosInactivos = UserConnection::idle()->count();
        
        $conexionesHoy = UserConnection::whereDate('login_at', today())->count();
        $tiempoPromedio = UserConnection::whereDate('login_at', today())
            ->avg('active_minutes');

        return response()->json([
            'total_usuarios' => $totalUsuarios,
            'usuarios_conectados' => $usuariosConectados,
            'usuarios_inactivos' => $usuariosInactivos,
            'conexiones_hoy' => $conexionesHoy,
            'tiempo_promedio_minutos' => round($tiempoPromedio ?? 0, 2)
        ]);
    }
}