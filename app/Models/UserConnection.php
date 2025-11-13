<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserConnection extends Model
{
    use HasFactory;

    protected $table = 'user_connections';

    protected $fillable = [
        'user_id',
        'session_id',
        'ip_address',
        'user_agent',
        'device_type',
        'browser',
        'platform',
        'login_at',
        'last_activity_at',
        'logout_at',
        'status',
        'active_minutes'
    ];

    protected $casts = [
        'login_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'logout_at' => 'datetime',
    ];

    /**
     * Relación con el usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para conexiones activas
     */
public function scopeOnline($query)
{
    return $query->where('status', 'online')
                ->where('last_activity_at', '>=', now()->subMinutes(5));
}

/**
 * Scope para conexiones inactivas (sin actividad entre 5 y 30 minutos)
 */
public function scopeIdle($query)
{
    return $query->where('status', 'online')
                ->where('last_activity_at', '<', now()->subMinutes(5))
                ->where('last_activity_at', '>=', now()->subMinutes(30));
}

/**
 * Scope para conexiones expiradas (más de 30 minutos sin actividad)
 */
public function scopeExpired($query)
{
    return $query->where('status', 'online')
                ->where('last_activity_at', '<', now()->subMinutes(30));
}

    /**
     * Scope para conexiones recientes
     */
    public function scopeRecent($query, $minutes = 30)
    {
        return $query->where('last_activity_at', '>=', now()->subMinutes($minutes));
    }

    /**
     * Marcar como desconectado
     */
    public function markAsOffline(): void
    {
        $this->update([
            'status' => 'offline',
            'logout_at' => now(),
            'active_minutes' => $this->login_at->diffInMinutes(now())
        ]);
    }

    /**
     * Actualizar última actividad
     */
    public function updateActivity(): void
    {
        $this->update([
            'last_activity_at' => now(),
            'active_minutes' => $this->login_at->diffInMinutes(now())
        ]);
    }

    /**
     * Obtener información del dispositivo
     */
    public static function parseUserAgent($userAgent): array
    {
        // Puedes usar una librería como jenssegers/agent para mejor detección
        $browser = 'Unknown';
        $platform = 'Unknown';
        $device = 'desktop';

        if (strpos($userAgent, 'Mobile') !== false) {
            $device = 'mobile';
        } elseif (strpos($userAgent, 'Tablet') !== false) {
            $device = 'tablet';
        }

        if (strpos($userAgent, 'Chrome') !== false) {
            $browser = 'Chrome';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            $browser = 'Firefox';
        } elseif (strpos($userAgent, 'Safari') !== false) {
            $browser = 'Safari';
        }

        if (strpos($userAgent, 'Windows') !== false) {
            $platform = 'Windows';
        } elseif (strpos($userAgent, 'Mac') !== false) {
            $platform = 'macOS';
        } elseif (strpos($userAgent, 'Linux') !== false) {
            $platform = 'Linux';
        } elseif (strpos($userAgent, 'Android') !== false) {
            $platform = 'Android';
        } elseif (strpos($userAgent, 'iPhone') !== false) {
            $platform = 'iOS';
        }

        return [
            'browser' => $browser,
            'platform' => $platform,
            'device_type' => $device
        ];
    }
}