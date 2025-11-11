<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventario extends Model
{
    /** @use HasFactory<\Database\Factories\InventarioFactory> */
   use HasFactory;

    protected $table = 'inventarios';

    protected $fillable = [
        'nombre',
        'modelo',
        'marca',
        'stockTotal',
        'activo',
        'registradoPor',
        'estado',
    ];

    protected $casts = [
        'stockTotal' => 'integer',
        'activo' => 'boolean',
    ];

    /**
     * Relación con el usuario que registró el item
     */
    public function registradoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registradoPor');
    }

    /**
     * Relación con los detalles de inventario en aulas
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleInventario::class, 'idInventario');
    }

    /**
     * Relación con los movimientos de inventario
     */
    public function movimientos(): HasMany
    {
        return $this->hasMany(MovimientoInventario::class, 'idInventario');
    }

    /**
     * Scope para items activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para items disponibles
     */
    public function scopeDisponibles($query)
    {
        return $query->where('estado', 'disponible');
    }

    /**
     * Scope para búsqueda
     */
    public function scopeBuscar($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
              ->orWhere('modelo', 'like', "%{$search}%")
              ->orWhere('marca', 'like', "%{$search}%");
        });
    }

    /**
     * Verificar si el item tiene stock disponible
     */
    public function tieneStock(): bool
    {
        return $this->stockTotal > 0 && $this->estado === 'disponible';
    }

    /**
     * Actualizar stock automáticamente
     */
    public function actualizarStock(int $cantidad, string $tipo = 'entrada'): void
    {
        if ($tipo === 'entrada') {
            $this->increment('stockTotal', $cantidad);
        } else {
            $this->decrement('stockTotal', $cantidad);
        }

        // Actualizar estado basado en stock
        if ($this->stockTotal === 0) {
            $this->update(['estado' => 'agotado']);
        } elseif ($this->stockTotal > 0 && $this->estado === 'agotado') {
            $this->update(['estado' => 'disponible']);
        }
    }
}
