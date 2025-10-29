<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Obtener usuarios con relaciones de roles
        $usuarios = User::with('roles')->get();
        
        // Obtener sesiones activas
        $sesionesActivas = DB::table('sessions')
            ->where('last_activity', '>', now()->subMinutes(30)->timestamp)
            ->whereNotNull('user_id')
            ->get()
            ->keyBy('user_id');
            
        // Combinar datos
        $usuariosConSesiones = $usuarios->map(function($user) use ($sesionesActivas) {
            $sesion = $sesionesActivas->get($user->id);
            
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'estado' => $user->estado,
                'ultimoLogin' => $user->ultimoLogin,
                'en_linea' => !is_null($sesion),
                'ultima_ip' => $sesion->ip_address ?? null,
                'ultima_actividad' => $sesion ? 
                    Carbon::createFromTimestamp($sesion->last_activity, 'America/La_Paz')->toDateTimeString() : null,
                'dispositivo' => $sesion ? 
                    substr($sesion->user_agent, 0, 50) : null,
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
     $validated = $request->validated();
        $user = User::create($validated);

    // Asignar roles si se enviaron
     if ($request->has('roles')) {
        $user->syncRoles($request->roles);
     }

        return redirect()->route('usuarios.Index');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }


// En el método edit()
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
        $data = $request->validated();

        // Solo actualizar password si se proporcionó uno nuevo
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            // Remover el campo password del array si está vacío
            unset($data['password']);
        }

        // Remover password_confirmation ya que no existe en la tabla
        unset($data['password_confirmation']);

        $user->update($data);

        // Sincronizar roles si se enviaron en el request
        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->route('usuarios.Index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('usuarios.Index');
    }
}