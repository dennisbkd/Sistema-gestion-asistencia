<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bitacora extends Model
{
    use HasFactory;

    protected $table = 'bitacora';
    protected $primaryKey = 'id';

    protected $fillable = [
        'idUsuario',
        'accion',
        'modulo',
        'submodulo',
        'descripcion',
        'ip',
        'user_agent',
        'metodo_http',
        'ruta',
        'datos_antes',
        'datos_despues',
        'parametros',
        'referencia_id',
        'estado',
        'error'
    ];

    protected $casts = [
        'datos_antes' => 'array',
        'datos_despues' => 'array',
        'parametros' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con el usuario
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUsuario');
    }

    /**
     * Scope para filtrar por módulo
     */
    public function scopeModulo($query, $modulo)
    {
        return $query->where('modulo', $modulo);
    }

    /**
     * Scope para filtrar por acción
     */
    public function scopeAccion($query, $accion)
    {
        return $query->where('accion', $accion);
    }

    /**
     * Scope para registros exitosos
     */
    public function scopeExitosos($query)
    {
        return $query->where('estado', 'exitoso');
    }

    /**
     * Scope para registros fallidos
     */
    public function scopeFallidos($query)
    {
        return $query->where('estado', 'fallido');
    }

    /**
     * Scope para últimas actividades
     */
    public function scopeRecientes($query, $dias = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($dias));
    }

    /**
     * Obtener descripción formateada
     */
    public function getDescripcionCompletaAttribute(): string
    {
        $descripcion = "{$this->accion} en {$this->modulo}";
        
        if ($this->submodulo) {
            $descripcion .= " > {$this->submodulo}";
        }
        
        if ($this->referencia_id) {
            $descripcion .= " (ID: {$this->referencia_id})";
        }
        
        return $descripcion;
    }
}