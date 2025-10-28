<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
{
    
    // Obtener usuarios normalmente
    $usuarios = User::all();
    
    // Obtener sesiones activas
    $sesionesActivas = DB::table('sessions')
        ->where('last_activity', '>', now()->subMinutes(30)->timestamp)
        ->whereNotNull('user_id')
        ->get()
        ->keyBy('user_id'); // Indexar por user_id para búsqueda rápida
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
        return inertia('usuarios/Create',[
            'usuarios'=> new User()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();
        User::create($validated);

    return redirect()->route('usuarios.Index');
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
        return inertia('usuarios/Editar',[
            'usuario'=>$user
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
