<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HorarioAsignacion extends Model
{
    use HasFactory;

    protected $table = 'horarioAsignacion';

    protected $fillable = [
        'idAsignacion',
        'idBloque',
        'idAula',
        'estado'
    ];

    /**
     * Relación con la asignación
     */
    public function asignacion(): BelongsTo
    {
        return $this->belongsTo(Asignacion::class, 'idAsignacion');
    }

    /**
     * Relación con el bloque horario
     */
    public function bloque(): BelongsTo
    {
        return $this->belongsTo(BloqueHorario::class, 'idBloque');
    }

    /**
     * Relación con el aula
     */
    public function aula(): BelongsTo
    {
        return $this->belongsTo(Aula::class, 'idAula');
    }
}