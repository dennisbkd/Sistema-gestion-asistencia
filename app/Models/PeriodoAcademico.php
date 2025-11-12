<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodoAcademico extends Model
{
    use HasFactory;

    protected $table = 'periodo_academicos';
    protected $primaryKey = 'idPeriodo';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nroSemestre',
        'año',
        'tipoPeriodo',
        'fechaInicio',
        'fechaFin',
        'estado',
    ];

    protected $casts = [
        'nroSemestre' => 'integer',
        'año' => 'integer',
        'fechaInicio' => 'date',
        'fechaFin' => 'date',
    ];

    // Relaciones
    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'idPeriodo', 'idPeriodo');
    }

    public function materias()
    {
        return $this->hasManyThrough(Materia::class, Asignacion::class, 'idPeriodo', 'idMateria', 'idPeriodo', 'idMateria');
    }

    public function docentes()
    {
        return $this->hasManyThrough(Docente::class, Asignacion::class, 'idPeriodo', 'idDocente', 'idPeriodo', 'idDocente');
    }

    public function grupos()
    {
        return $this->hasManyThrough(Grupo::class, Asignacion::class, 'idPeriodo', 'idGrupo', 'idPeriodo', 'idGrupo');
    }
}
