<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asignacion extends Model
{
    protected $table = 'asignacion';
    protected $primaryKey = 'idAsignacion';

    protected $fillable = [
        'idPeriodo',
        'idMateria',
        'idDocente',
        'idGrupo',
        'modalidad',
        'estado',
        'inscritos'
    ];

    /**
     * Relación con el periodo académico
     */
    public function periodo(): BelongsTo
    {
       return $this->belongsTo(PeriodoAcademico::class, 'idPeriodo');
    }

    /**
     * Relación con la materia
     */
    public function materia(): BelongsTo
    {
        return $this->belongsTo(Materia::class, 'idMateria');
    }

    /**
     * Relación con el docente
     */
    public function docente(): BelongsTo
    {
        return $this->belongsTo(Docente::class, 'idDocente');
    }

    /**
     * Relación con el grupo
     */
    public function grupo(): BelongsTo
    {
        return $this->belongsTo(Grupo::class, 'idGrupo');
    }

    /**
     * Relación con los horarios
     */
    public function horarios(): HasMany
    {
        return $this->hasMany(HorarioAsignacion::class, 'idAsignacion');
    }

    public function asistencias(): HasMany
    {
        return $this->hasMany(Asistencia::class, 'idAsignacion', 'idAsignacion');
    }
}
