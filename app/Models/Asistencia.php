<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Asistencia extends Model
{
    use HasFactory;

    protected $table = 'asistencias';
    protected $primaryKey = 'idAsistencia';

    protected $fillable = [
        'idAsignacion',
        'idHorarioAsignacion',
        'fecha',
        'horaRegistro',
        'horaClaseInicio',
        'horaClaseFin',
        'estado',
        'justificacion',
        'minutosRetraso',
        'token_qr',
        'qr_generado_at',
        'qr_expiracion_at',
        'ip_registro'
    ];

    protected $casts = [
        'fecha' => 'date',
        'horaRegistro' => 'datetime',
        'horaClaseInicio' => 'datetime',
        'horaClaseFin' => 'datetime',
        'qr_generado_at' => 'datetime',
        'qr_expiracion_at' => 'datetime',
        'minutosRetraso' => 'integer',
    ];

    /**
     * Relación con la asignación
     */
    public function asignacion(): BelongsTo
    {
        return $this->belongsTo(Asignacion::class, 'idAsignacion', 'idAsignacion');
    }

    /**
     * Relación con el horario de asignación
     */
    public function horarioAsignacion(): BelongsTo
    {
        return $this->belongsTo(HorarioAsignacion::class, 'idHorarioAsignacion', 'idHorarioAsignacion');
    }

    /**
     * Scope para asistencias del día actual
     */
    public function scopeHoy($query)
    {
        return $query->where('fecha', today());
    }

    /**
     * Scope para QR válidos (no expirados)
     */
    public function scopeQrValido($query)
    {
        return $query->where('qr_expiracion_at', '>', now());
    }

    /**
     * Verificar si el QR está expirado
     */
    public function qrExpirado(): bool
    {
        return $this->qr_expiracion_at && $this->qr_expiracion_at->lt(now());
    }

    /**
     * Verificar si el registro es tardanza
     */
    public function esTardanza(): bool
    {
        return $this->minutosRetraso > 0 && $this->minutosRetraso <= 30;
    }

    /**
     * Verificar si es ausencia (más de 30 minutos de retraso)
     */
    public function esAusencia(): bool
    {
        return $this->minutosRetraso > 30;
    }

    /**
     * Calcular minutos de retraso
     */
public static function calcularMinutosRetraso($horaRegistro, $horaClaseInicio): int
{
    $registro = Carbon::parse($horaRegistro);
    $inicio = Carbon::parse($horaClaseInicio);
    
    // Solo considerar retraso si el registro es después del inicio
    if ($registro->gt($inicio)) {
        return $registro->diffInMinutes($inicio);
    }
    
    return 0; // Llegó a tiempo o antes
}
    /**
     * Determinar estado basado en retraso
     */
public static function determinarEstado($minutosRetraso): string
{
    if ($minutosRetraso <= 10) {
        return 'presente'; // Tolerancia de 10 minutos
    } elseif ($minutosRetraso <= 30) {
        return 'tardanza'; // Entre 11 y 30 minutos
    } else {
        return 'ausente'; // Más de 30 minutos
    }
}
    
}