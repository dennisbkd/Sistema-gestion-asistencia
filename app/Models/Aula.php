<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Aula extends Model
{
    /** @use HasFactory<\Database\Factories\AulaFactory> */
    use HasFactory;

    protected $fillable = [
        'codigoAula',
        'capacidad',
        'tipo',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
        'capacidad' => 'integer',
    ];

     public function inventario(): HasMany
    {
        return $this->hasMany(DetalleInventario::class, 'idAula');
    }

    /**
     * Relación con movimientos de origen
     */
    public function movimientosOrigen(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'idAulaOrigen');
    }

    /**
     * Relación con movimientos de destino
     */
    public function movimientosDestino(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'idAulaDestino');
    }

    /**
     * Obtener el inventario funcional del aula
     */
    public function inventarioFuncional()
    {
        return $this->inventario()->funcionales()->with('inventarios');
    }
}
