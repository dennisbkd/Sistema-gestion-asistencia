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
     * Obtener horarioIni formateado
     */
    protected function horaInicioFormateada(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->horaInicio ? $this->horaInicio->format('H:i') : null,
        );
    }

    /**
     * Accessor para horaFin formateada
     */
    protected function horaFinFormateada(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->horaFin ? $this->horaFin->format('H:i') : null,
        );
    }
}