<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleInventario extends Model
{
   use HasFactory;

    protected $table = 'detalle_inventarios';

    protected $fillable = [
        'idAula',
        'idInventario',
        'cantidad',
        'estado',
    ];

    protected $casts = [
        'cantidad' => 'integer',
    ];

    /**
     * Relación con el aula
     */
    public function aula(): BelongsTo
    {
        return $this->belongsTo(Aula::class, 'idAula');
    }

    /**
     * Relación con el inventario
     */
    public function inventario(): BelongsTo
    {
        return $this->belongsTo(Inventario::class, 'idInventario');
    }

    /**
     * Scope para items funcionales
     */
    public function scopeFuncionales($query)
    {
        return $query->where('estado', 'funcional');
    }

    /**
     * Scope por aula específica
     */
    public function scopePorAula($query, $aulaId)
    {
        return $query->where('idAula', $aulaId);
    }

    /**
     * Verificar si el detalle está funcional
     */
    public function estaFuncional(): bool
    {
        return $this->estado === 'funcional';
    }
}
