<?php

namespace App\Http\Controllers;

use App\Models\MovimientoInventario;
use App\Models\Aula;
use App\Models\Inventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MovimientoInventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $movimientos = MovimientoInventario::with([
            'inventario',
            'realizadoPor',
            'aulaOrigen',
            'aulaDestino'
        ])
        ->when($request->filled('search'), function ($query) use ($request) {
            $query->whereHas('inventario', function ($q) use ($request) {
                $q->where('nombre', 'like', "%{$request->search}%")
                  ->orWhere('modelo', 'like', "%{$request->search}%")
                  ->orWhere('marca', 'like', "%{$request->search}%");
            });
        })
        ->when($request->filled('tipoMovimiento'), function ($query) use ($request) {
            $query->where('tipoMovimiento', $request->tipoMovimiento);
        })
        ->when($request->filled('fechaDesde'), function ($query) use ($request) {
            $query->whereDate('fechaMovimiento', '>=', $request->fechaDesde);
        })
        ->when($request->filled('fechaHasta'), function ($query) use ($request) {
            $query->whereDate('fechaMovimiento', '<=', $request->fechaHasta);
        })
        ->orderBy('fechaMovimiento', 'desc')
        ->orderBy('created_at', 'desc')
        ->get();

        // Estadísticas
        $estadisticas = [
            'totalMovimientos' => MovimientoInventario::count(),
            'totalEntradas' => MovimientoInventario::where('tipoMovimiento', 'entrada')->count(),
            'totalSalidas' => MovimientoInventario::where('tipoMovimiento', 'salida')->count(),
            'totalTransferencias' => MovimientoInventario::where('tipoMovimiento', 'transferencia')->count(),
            'totalMantenimientos' => MovimientoInventario::where('tipoMovimiento', 'mantenimiento')->count(),
        ];

        return inertia('inventario/movimientos/Index', [
            'movimientos' => $movimientos,
            'filters' => $request->only(['search', 'tipoMovimiento', 'fechaDesde', 'fechaHasta']),
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $inventario = Inventario::where('activo', true)
            ->where('estado', '!=', 'agotado')
            ->get();
        
        $aulas = Aula::where('activo', true)->get();

        return inertia('inventario/movimientos/Create', [
            'inventario' => $inventario,
            'aulas' => $aulas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'idInventario' => 'required|exists:inventarios,id',
            'tipoMovimiento' => 'required|in:entrada,salida,mantenimiento', // Removido 'transferencia' por ahora
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'required|string|max:500', // Ahora es requerido
            'idAulaDestino' => 'nullable|required_if:tipoMovimiento,salida|exists:aulas,id', // Solo para salidas
        ]);

        // Obtener el inventario
        $inventario = Inventario::find($validated['idInventario']);

        // Validaciones específicas por tipo de movimiento
        if ($validated['tipoMovimiento'] === 'salida') {
            // Validar stock suficiente
            if ($inventario->stockTotal < $validated['cantidad']) {
                return back()->withErrors([
                    'cantidad' => 'Stock insuficiente. Stock actual: ' . $inventario->stockTotal . ' unidades'
                ]);
            }

            // Validar que el item esté disponible
            if ($inventario->estado !== 'disponible') {
                return back()->withErrors([
                    'idInventario' => 'El item no está disponible para salida. Estado actual: ' . $inventario->estado
                ]);
            }

            // Validar que se especifique aula destino para salidas
            if (!$validated['idAulaDestino']) {
                return back()->withErrors([
                    'idAulaDestino' => 'Para salidas, es necesario especificar el aula destino'
                ]);
            }
        }

        if ($validated['tipoMovimiento'] === 'entrada') {
            // Validar que no se especifique aula destino para entradas
            if ($validated['idAulaDestino']) {
                return back()->withErrors([
                    'idAulaDestino' => 'Para entradas, no se debe especificar aula destino'
                ]);
            }
        }

        if ($validated['tipoMovimiento'] === 'mantenimiento') {
            // Para mantenimiento, validar que haya stock disponible
            if ($inventario->stockTotal < $validated['cantidad']) {
                return back()->withErrors([
                    'cantidad' => 'No hay suficientes unidades para mantenimiento. Stock actual: ' . $inventario->stockTotal
                ]);
            }
        }

        // Crear el movimiento
        $movimiento = MovimientoInventario::create([
            'idInventario' => $validated['idInventario'],
            'tipoMovimiento' => $validated['tipoMovimiento'],
            'cantidad' => $validated['cantidad'],
            'fechaMovimiento' => now(), // Fecha automática
            'observacion' => $validated['observacion'],
            'realizadoPor' => auth()->id(),
            'idAulaDestino' => $validated['idAulaDestino'],
            // idAulaOrigen se deja null para movimientos manuales
        ]);

        // Actualizar stock del inventario automáticamente
        $this->actualizarStockInventario($inventario, $validated['tipoMovimiento'], $validated['cantidad']);

        return redirect()->route('inventario.movimientos.index')
            ->with('success', 'Movimiento registrado exitosamente');
    }

    /**
     * Actualizar el stock del inventario basado en el tipo de movimiento
     */
    private function actualizarStockInventario(Inventario $inventario, string $tipoMovimiento, int $cantidad)
    {
        switch ($tipoMovimiento) {
            case 'entrada':
                $inventario->increment('stockTotal', $cantidad);
                // Si estaba agotado y ahora tiene stock, cambiar a disponible
                if ($inventario->estado === 'agotado' && $inventario->stockTotal > 0) {
                    $inventario->update(['estado' => 'disponible']);
                }
                break;

            case 'salida':
                $inventario->decrement('stockTotal', $cantidad);
                // Si se agota el stock, cambiar estado a agotado
                if ($inventario->stockTotal === 0) {
                    $inventario->update(['estado' => 'agotado']);
                }
                break;

            case 'mantenimiento':
                // Para mantenimiento, no afectamos el stock total
                // pero podríamos crear un registro en detalle_inventario si lo deseas
                // Por ahora solo se registra el movimiento sin afectar stock
                break;
        }

        // Actualizar timestamp
        $inventario->touch();
    }

    /**
     * Display the specified resource.
     */
    public function show(MovimientoInventario $movimientoInventario)
    {
        $movimientoInventario->load([
            'inventario',
            'realizadoPor',
            'aulaOrigen',
            'aulaDestino'
        ]);

        return inertia('inventario/movimientos/Show', [
            'movimiento' => $movimientoInventario
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MovimientoInventario $movimientoInventario)
    {
        // Por ahora no permitimos edición de movimientos por integridad de datos
        return redirect()->route('inventario.movimientos.index')
            ->with('error', 'La edición de movimientos no está permitida');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MovimientoInventario $movimientoInventario)
    {
        // Por ahora no permitimos actualización de movimientos
        return redirect()->route('inventario.movimientos.index')
            ->with('error', 'La actualización de movimientos no está permitida');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MovimientoInventario $movimientoInventario)
    {
        // Por ahora no permitimos eliminación de movimientos
        return redirect()->route('inventario.movimientos.index')
            ->with('error', 'La eliminación de movimientos no está permitida');
    }

    /**
     * Método para crear movimiento específico para un item
     */
    public function createForItem(Inventario $inventario)
    {
        $aulas = Aula::where('activo', true)->get();

        return inertia('inventario/movimientos/CreateForItem', [
            'inventario' => $inventario,
            'aulas' => $aulas,
        ]);
    }

    /**
     * Store movimiento específico para un item
     */
    public function storeForItem(Request $request, Inventario $inventario)
    {
        $validated = $request->validate([
            'tipoMovimiento' => 'required|in:entrada,salida,mantenimiento',
            'cantidad' => 'required|integer|min:1',
            'observacion' => 'required|string|max:500',
            'idAulaDestino' => 'nullable|required_if:tipoMovimiento,salida|exists:aulas,id',
        ]);

        // Validaciones específicas
        if ($validated['tipoMovimiento'] === 'salida') {
            if ($inventario->stockTotal < $validated['cantidad']) {
                return back()->withErrors([
                    'cantidad' => 'Stock insuficiente. Stock actual: ' . $inventario->stockTotal . ' unidades'
                ]);
            }

            if ($inventario->estado !== 'disponible') {
                return back()->withErrors([
                    'tipoMovimiento' => 'El item no está disponible para salida. Estado actual: ' . $inventario->estado
                ]);
            }
        }

        // Crear movimiento
        $movimiento = MovimientoInventario::create([
            'idInventario' => $inventario->id,
            'tipoMovimiento' => $validated['tipoMovimiento'],
            'cantidad' => $validated['cantidad'],
            'fechaMovimiento' => now(),
            'observacion' => $validated['observacion'],
            'realizadoPor' => auth()->id(),
            'idAulaDestino' => $validated['idAulaDestino'],
        ]);

        // Actualizar stock
        $this->actualizarStockInventario($inventario, $validated['tipoMovimiento'], $validated['cantidad']);

        return redirect()->route('inventario.movimientos.index')
            ->with('success', 'Movimiento registrado exitosamente para ' . $inventario->nombre);
    }
}