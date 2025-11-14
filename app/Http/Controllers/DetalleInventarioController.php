<?php

namespace App\Http\Controllers;

use App\Models\Inventario;
use App\Models\DetalleInventario;
use App\Models\Aula;

class DetalleInventarioController extends Controller
{
    /**
     * Display the specified resource.
     */
    public function show($inventarioId)
    {
        // Obtener el item de inventario con sus detalles
        $inventario = Inventario::with(['detalles.aula'])->findOrFail($inventarioId);
        
        // Obtener todas las aulas para posibles filtros
        $aulas = Aula::all();
        
        // Obtener distribución por aulas (agrupado por aula) - CORREGIDO
        $distribucionAulas = DetalleInventario::with('aula')
            ->where('idInventario', $inventarioId)
            ->selectRaw('"idAula", SUM(cantidad) as total, estado') // ← "idAula" entre comillas
            ->groupBy('"idAula"', 'estado') // ← "idAula" entre comillas también aquí
            ->get()
            ->groupBy('idAula');
        
        // Estadísticas generales
        $estadisticas = [
            'total_funcional' => $inventario->detalles->where('estado', 'funcional')->sum('cantidad'),
            'total_danado' => $inventario->detalles->where('estado', 'dañado')->sum('cantidad'),
            'total_mantenimiento' => $inventario->detalles->where('estado', 'mantenimiento')->sum('cantidad'),
            'total_general' => $inventario->detalles->sum('cantidad'),
        ];

        return inertia('inventario/Detalle', [
            'inventario' => $inventario,
            'aulas' => $aulas,
            'distribucionAulas' => $distribucionAulas,
            'estadisticas' => $estadisticas,
            'detalles' => $inventario->detalles
        ]);
    }
}