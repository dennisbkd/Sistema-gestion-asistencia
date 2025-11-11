<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asignacion extends Model
{
    use HasFactory;

    protected $table = 'asignacions';
    protected $primaryKey = 'idAsignacion';

    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'idPeriodo',
        'idMateria',
        'idDocente',
        'idGrupo',
        'modalidad',
        'estado',
        'inscritos'
    ];

    protected $casts = [
        'inscritos' => 'integer',
    ];

    // Relaciones
    public function periodoAcademico()
    {
        return $this->belongsTo(PeriodoAcademico::class, 'idPeriodo');
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'idMateria');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'idDocente');
    }

    public function grupo()
    {
        return $this->belongsTo(Grupo::class, 'idGrupo');
    }
}