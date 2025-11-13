<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;
use App\Models\UserConnection;
use App\Traits\RegistrarBitacora;
use Illuminate\Support\Facades\DB;

class LogoutListener
{
    use RegistrarBitacora;

    public function handle(Logout $event): void
    {
        if ($event->user) {
            $sessionId = request()->session()->getId();
            
            // Buscar la conexión activa por usuario y session_id
            $conexion = UserConnection::where('user_id', $event->user->id)
                ->where('session_id', $sessionId)
                ->where('status', 'online')
                ->first();

            if ($conexion) {
                // Calcular minutos activos
                $minutosActivos = $conexion->login_at->diffInMinutes(now());
                
                $conexion->update([
                    'status' => 'offline',
                    'logout_at' => now(),
                    'last_activity_at' => now(), // IMPORTANTE: Actualizar última actividad
                    'active_minutes' => $minutosActivos
                ]);
            } else {
                // Si no encuentra por session_id, buscar cualquier conexión activa del usuario
                UserConnection::where('user_id', $event->user->id)
                    ->where('status', 'online')
                    ->whereNull('logout_at')
                    ->update([
                        'status' => 'offline',
                        'logout_at' => now(),
                        'last_activity_at' => now(),
                        'active_minutes' => DB::raw('TIMESTAMPDIFF(MINUTE, login_at, NOW())')
                    ]);
            }

            // Registrar en bitácora
            if (method_exists($event->user, 'registrarBitacora')) {
$this->registrarBitacora(
                    'LOGOUT',
                    'AUTENTICACION',
                    'SESION',
                    "Usuario cerró sesión: {$event->user->name}",
                    null,
                    ['logout_at' => now(), 'session_id' => $sessionId],
                    $event->user->id
                );
            }
        }
    }
}