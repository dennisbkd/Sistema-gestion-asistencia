<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoInventario extends Model
{
    /** @use HasFactory<\Database\Factories\MovimientoInventarioFactory> */
    use HasFactory;

    protected $table = 'movimientos_inventario';

    protected $fillable = [
        'idInventario',
        'tipoMovimiento',
        'cantidad',
        'fechaMovimiento',
        'observacion',
        'realizadoPor',
        'idAulaOrigen',
        'idAulaDestino',
    ];

    protected $casts = [
        'cantidad' => 'integer',
        'fechaMovimiento' => 'datetime',
    ];

    /**
     * Relación con el inventario
     */
    public function inventario(): BelongsTo
    {
        return $this->belongsTo(Inventario::class, 'idInventario');
    }

    /**
     * Relación con el usuario que realizó el movimiento
     */
    public function realizadoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'realizadoPor');
    }

    /**
     * Relación con el aula de origen
     */
    public function aulaOrigen(): BelongsTo
    {
        return $this->belongsTo(Aula::class, 'idAulaOrigen');
    }

    /**
     * Relación con el aula de destino
     */
    public function aulaDestino(): BelongsTo
    {
        return $this->belongsTo(Aula::class, 'idAulaDestino');
    }

    /**
     * Scope para movimientos de entrada
     */
    public function scopeEntradas($query)
    {
        return $query->where('tipoMovimiento', 'entrada');
    }

    /**
     * Scope para movimientos de salida
     */
    public function scopeSalidas($query)
    {
        return $query->where('tipoMovimiento', 'salida');
    }

    /**
     * Scope para movimientos de transferencia
     */
    public function scopeTransferencias($query)
    {
        return $query->where('tipoMovimiento', 'transferencia');
    }

    /**
     * Scope por rango de fechas
     */
    public function scopeEntreFechas($query, $desde, $hasta)
    {
        return $query->whereBetween('fechaMovimiento', [$desde, $hasta]);
    }

    /**
     * Obtener el nombre del tipo de movimiento
     */
    public function getTipoMovimientoTextoAttribute(): string
    {
        return match($this->tipoMovimiento) {
            'entrada' => 'Entrada',
            'salida' => 'Salida',
            'transferencia' => 'Transferencia',
            'mantenimiento' => 'Mantenimiento',
            default => 'Desconocido'
        };
    }

    /**
     * Verificar si es un movimiento de entrada
     */
    public function esEntrada(): bool
    {
        return $this->tipoMovimiento === 'entrada';
    }

    /**
     * Verificar si es un movimiento de salida
     */
    public function esSalida(): bool
    {
        return $this->tipoMovimiento === 'salida';
    }
}
