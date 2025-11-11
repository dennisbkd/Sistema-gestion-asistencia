<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodoAcademico extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'periodoAcademico';

    // Nombre de la clave primaria
    protected $primaryKey = 'idPeriodo';

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'nombre',
        'gestion',
        'semestre',
        'fechaInicio',
        'fechaFin',
        'estado',
    ];

    // Tipos de datos automáticos
    protected $casts = [
        'fechaInicio' => 'date',
        'fechaFin' => 'date',
    ];

    // Relaciones ===============================

    /**
     * Un periodo académico puede tener muchas asignaciones.
     */
    public function asignaciones()
    {
        return $this->hasMany(Asignacion::class, 'idPeriodo', 'idPeriodo');
    }

    /**
     * Scope para filtrar periodos activos.
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }

    /**
     * Scope para buscar por gestión y semestre.
     */
    public function scopePorGestionSemestre($query, $gestion, $semestre)
    {
        return $query->where('gestion', $gestion)
                     ->where('semestre', $semestre);
    }

    /**
     * Scope para filtrar periodos finalizados.
     */
    public function scopeFinalizados($query)
    {
        return $query->where('estado', 'finalizado');
    }
}
