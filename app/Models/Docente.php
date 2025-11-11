<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Docente extends Model
{
    use HasFactory;

    protected $primaryKey = 'idDocente';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario',
        'codigoDocente',
        'telefono',
        'especialidad',
        'estado',
        'maxHorasSemanales'
    ];

    protected $casts = [
        'maxHorasSemanales' => 'integer',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUsuario', 'id');
    }

      /**
     * Relación con las asignaciones
     */
    public function asignaciones(): HasMany
    {
        return $this->hasMany(Asignacion::class, 'idDocente');
    }

    /**
     * Obtener asignaciones activas del periodo actual
     */
    public function asignacionesActivas()
    {
        return $this->asignaciones()
            ->whereHas('periodo', function($query) {
                $query->where('estado', 'activo');
            })
            ->where('estado', 'activo')
            ->with(['materia', 'grupo', 'horarios.bloque', 'horarios.aula']);
    }

    /**
     * Scope para docentes activos
     */
    public function scopeActivos($query)
    {
        return $query->where('estado', 'activo');
    }
}
