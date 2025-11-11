<?php

namespace App\Http\Controllers;

use App\Models\Inventario;
use App\Models\Aula;
use App\Models\DetalleInventario;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AsignacionInventarioController extends Controller
{
    /**
     * Show the form for creating a new assignment.
     */
    public function create($inventarioId)
    {
        $inventario = Inventario::findOrFail($inventarioId);
        $aulas = Aula::where('activo', true)->get();
        
        return inertia('inventario/Asignacion', [
            'inventario' => $inventario,
            'aulas' => $aulas
        ]);
    }

    /**
     * Store a newly created assignment.
     */
    public function store(Request $request, $inventarioId)
    {
        $request->validate([
            'idAula' => 'required|exists:aulas,id',
            'cantidad' => 'required|integer|min:1',
            'estado' => 'required|in:funcional,dañado,mantenimiento',
            'observacion' => 'nullable|string|max:500'
        ]);

        $inventario = Inventario::findOrFail($inventarioId);

        // Verificar stock disponible
        if ($inventario->stockTotal < $request->cantidad) {
            return back()->withErrors([
                'cantidad' => 'Stock insuficiente. Stock disponible: ' . $inventario->stockTotal
            ]);
        }

        DB::transaction(function () use ($request, $inventario, $inventarioId) {
            // Buscar si ya existe un registro para esta aula e inventario
            $detalleExistente = DetalleInventario::where('idAula', $request->idAula)
                ->where('idInventario', $inventarioId)
                ->where('estado', $request->estado)
                ->first();

            if ($detalleExistente) {
                // Actualizar cantidad existente
                $detalleExistente->increment('cantidad', $request->cantidad);
                $detalle = $detalleExistente;
            } else {
                // Crear nuevo detalle
                $detalle = DetalleInventario::create([
                    'idAula' => $request->idAula,
                    'idInventario' => $inventarioId,
                    'cantidad' => $request->cantidad,
                    'estado' => $request->estado,
                ]);
            }

            // Registrar movimiento
            MovimientoInventario::create([
                'idInventario' => $inventarioId,
                'tipoMovimiento' => 'salida',
                'cantidad' => $request->cantidad,
                'observacion' => $request->observacion ?? "Asignación a aula",
                'realizadoPor' => auth()->id(),
                'idAulaDestino' => $request->idAula,
            ]);

            // Actualizar stock total
            $inventario->decrement('stockTotal', $request->cantidad);
            
            // Actualizar estado si el stock llega a 0
            if ($inventario->stockTotal === 0) {
                $inventario->update(['estado' => 'agotado']);
            }
        });

        return redirect()->route('inventario.index', $inventarioId)
            ->with('success', 'Asignación realizada exitosamente');
    }

    /**
     * Transfer inventory between classrooms
     */
    public function transferir(Request $request, $inventarioId)
    {
        $request->validate([
            'idAulaOrigen' => 'required|exists:aulas,id',
            'idAulaDestino' => 'required|exists:aulas,id|different:idAulaOrigen',
            'cantidad' => 'required|integer|min:1',
            'estado' => 'required|in:funcional,dañado,mantenimiento',
            'observacion' => 'nullable|string|max:500'
        ]);

        DB::transaction(function () use ($request, $inventarioId) {
            // Verificar stock en aula origen
            $detalleOrigen = DetalleInventario::where('idAula', $request->idAulaOrigen)
                ->where('idInventario', $inventarioId)
                ->where('estado', $request->estado)
                ->firstOrFail();

            if ($detalleOrigen->cantidad < $request->cantidad) {
                throw new \Exception('Cantidad insuficiente en el aula de origen. Disponible: ' . $detalleOrigen->cantidad);
            }

            // Actualizar aula origen
            $detalleOrigen->decrement('cantidad', $request->cantidad);

            // Si la cantidad llega a 0, eliminar el registro
            if ($detalleOrigen->cantidad === 0) {
                $detalleOrigen->delete();
            }

            // Actualizar o crear en aula destino
            $detalleDestino = DetalleInventario::where('idAula', $request->idAulaDestino)
                ->where('idInventario', $inventarioId)
                ->where('estado', $request->estado)
                ->first();

            if ($detalleDestino) {
                $detalleDestino->increment('cantidad', $request->cantidad);
            } else {
                DetalleInventario::create([
                    'idAula' => $request->idAulaDestino,
                    'idInventario' => $inventarioId,
                    'cantidad' => $request->cantidad,
                    'estado' => $request->estado,
                ]);
            }

            // Registrar movimiento de transferencia
            MovimientoInventario::create([
                'idInventario' => $inventarioId,
                'tipoMovimiento' => 'transferencia',
                'cantidad' => $request->cantidad,
                'observacion' => $request->observacion ?? "Transferencia entre aulas",
                'realizadoPor' => auth()->id(),
                'idAulaOrigen' => $request->idAulaOrigen,
                'idAulaDestino' => $request->idAulaDestino,
            ]);
        });

        return redirect()->route('inventario.index', $inventarioId)
            ->with('success', 'Transferencia realizada exitosamente');
    }

    public function createTransferencia($inventarioId)
{
    $inventario = Inventario::findOrFail($inventarioId);
    $aulas = Aula::where('activo', true)->get();
    $detalles = DetalleInventario::with('aula')
        ->where('idInventario', $inventarioId)
        ->get();

    return inertia('inventario/Transferencia', [
        'inventario' => $inventario,
        'aulas' => $aulas,
        'detalles' => $detalles
    ]);
}

    /**
     * Remove assignment (return to inventory)
     */
    public function destroy($detalleId)
    {
        $detalle = DetalleInventario::findOrFail($detalleId);
        $inventarioId = $detalle->idInventario;

        DB::transaction(function () use ($detalle) {
            $cantidad = $detalle->cantidad;
            $aulaId = $detalle->idAula;

            // Registrar movimiento de retorno
            MovimientoInventario::create([
                'idInventario' => $detalle->idInventario,
                'tipoMovimiento' => 'entrada',
                'cantidad' => $cantidad,
                'observacion' => "Devolución desde aula",
                'realizadoPor' => auth()->id(),
                'idAulaOrigen' => $aulaId,
            ]);

            // Actualizar stock total
            $detalle->inventario->increment('stockTotal', $cantidad);
            
            // Actualizar estado
            if ($detalle->inventario->stockTotal > 0 && $detalle->inventario->estado === 'agotado') {
                $detalle->inventario->update(['estado' => 'disponible']);
            }

            // Eliminar el detalle
            $detalle->delete();
        });

        return redirect()->route('inventario.detalle', $inventarioId)
            ->with('success', 'Item devuelto al inventario exitosamente');
    }
}