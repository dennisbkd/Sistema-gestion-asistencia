<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BloqueHorario extends Model
{
    use HasFactory;

    protected $table = 'bloquesHorarios';
    protected $primaryKey = 'idBloque';

    protected $fillable = [
        'diaSemana',
        'horaInicio',
        'horaFin',
        'turno'
    ];

    protected $casts = [
        'horaInicio' => 'datetime',
        'horaFin' => 'datetime',
    ];

    /**
     * Relación con horarios de asignación
     */
    public function horariosAsignacion(): HasMany
    {
        return $this->hasMany(HorarioAsignacion::class, 'idBloque');
    }

    /**
     * Obtener nombre del día
     */
    public function getNombreDiaAttribute(): string
    {
        $dias = [
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo'
        ];

        return $dias[$this->diaSemana] ?? 'Desconocido';
    }

    /**
     * Obtener horario formateado
     */
    public function getHorarioFormateadoAttribute(): string
    {
        return $this->horaInicio->format('H:i') . ' - ' . $this->horaFin->format('H:i');
    }
}