<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodoAcademico extends Model
{
    use HasFactory;

    protected $primaryKey = 'idPeriodo';

    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'nroSemestre',
        'año',
        'fechaInicio',
        'fechaFin',
        'estado'
    ];

    protected $casts = [
        'nroSemestre' => 'integer',
        'año' => 'integer',
        'fechaInicio' => 'date',
        'fechaFin' => 'date',
    ];

    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'idPeriodo');
    }

    // Nueva relación para acceder a las materias a través de las asignaciones
    public function materias()
    {
        return $this->hasManyThrough(Materia::class, Asignacion::class, 'idPeriodo', 'idMateria', 'idPeriodo', 'idMateria');
    }

    // Nueva relación para acceder a los docentes a través de las asignaciones
    public function docentes()
    {
        return $this->hasManyThrough(Docente::class, Asignacion::class, 'idPeriodo', 'idDocente', 'idPeriodo', 'idDocente');
    }

    // Nueva relación para acceder a los grupos a través de las asignaciones
    public function grupos()
    {
        return $this->hasManyThrough(Grupo::class, Asignacion::class, 'idPeriodo', 'idGrupo', 'idPeriodo', 'idGrupo');
    }
}