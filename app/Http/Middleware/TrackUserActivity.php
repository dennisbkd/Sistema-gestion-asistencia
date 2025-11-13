<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserConnection;
use Symfony\Component\HttpFoundation\Response;

class TrackUserActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (Auth::check()) {
            $this->trackActivity($request);
        }

        return $response;
    }

    private function trackActivity(Request $request): void
    {
        $user = Auth::user();
        $sessionId = $request->session()->getId();
        
        $deviceInfo = UserConnection::parseUserAgent($request->userAgent());

        // Buscar conexión activa existente
        $connection = UserConnection::where('user_id', $user->id)
            ->where('session_id', $sessionId)
            ->where('status', 'online')
            ->first();

        if (!$connection) {
            // Si no existe, verificar si hay conexiones sin cerrar de este usuario
            $conexionSinCerrar = UserConnection::where('user_id', $user->id)
                ->where('status', 'online')
                ->whereNull('logout_at')
                ->first();

            if ($conexionSinCerrar) {
                // Cerrar la conexión anterior
                $conexionSinCerrar->update([
                    'status' => 'offline',
                    'logout_at' => now(),
                    'active_minutes' => $conexionSinCerrar->login_at->diffInMinutes(now())
                ]);
            }

            // Crear nueva conexión
            $connection = UserConnection::create([
                'user_id' => $user->id,
                'session_id' => $sessionId,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'device_type' => $deviceInfo['device_type'],
                'browser' => $deviceInfo['browser'],
                'platform' => $deviceInfo['platform'],
                'login_at' => now(),
                'last_activity_at' => now(),
                'status' => 'online'
            ]);
        } else {
            // Actualizar actividad existente
            $connection->update([
                'last_activity_at' => now(),
                'active_minutes' => $connection->login_at->diffInMinutes(now())
            ]);
        }

        // Actualizar último login del usuario solo si es nuevo login
        if (!$connection->wasRecentlyCreated && $user->ultimoLogin?->diffInMinutes(now()) > 5) {
            $user->update(['ultimoLogin' => now()]);
        } elseif ($connection->wasRecentlyCreated) {
            $user->update(['ultimoLogin' => now()]);
        }
    }
}