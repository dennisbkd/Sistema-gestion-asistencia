<?php

namespace App\Http\Controllers;

use App\Models\Bitacora;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BitacoraController extends Controller
{
    public function index(Request $request)
    {
        $query = Bitacora::with('usuario')
            ->orderBy('created_at', 'desc');

        // Aplicar filtros
        if ($request->filled('modulo')) {
            $query->where('modulo', $request->modulo);
        }

        if ($request->filled('accion')) {
            $query->where('accion', $request->accion);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('descripcion', 'like', "%{$request->search}%")
                  ->orWhere('referencia_id', 'like', "%{$request->search}%");
            });
        }

        $bitacoras = $query->paginate(25);

        return inertia('bitacora/Index', [
            'bitacoras' => $bitacoras,
            'filtros' => $request->all()
        ]);
    }

    public function exportar(Request $request)
    {
        // Lógica para exportar a CSV o Excel
        // Puedes usar libraries como Laravel Excel
        return response()->json(['message' => 'Función de exportación pendiente']);
    }
}