<?php

namespace App\Http\Controllers;

use App\Models\Inventario;
use App\Http\Requests\StoreInventarioRequest;
use App\Http\Requests\UpdateInventarioRequest;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $inventario = Inventario::with('registradoPor')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('nombre', 'like', "%{$request->search}%")
                      ->orWhere('modelo', 'like', "%{$request->search}%")
                      ->orWhere('marca', 'like', "%{$request->search}%");
                });
            })
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado', $request->estado);
            })
            ->when($request->filled('activo'), function ($query) use ($request) {
                $query->where('activo', $request->activo === 'true');
            })
            ->orderBy('nombre')
            ->get();

        return inertia('inventario/Index', [
            'inventario' => $inventario,
            'filters' => $request->only(['search', 'estado', 'activo'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('inventario/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'modelo' => 'nullable|string|max:50',
            'marca' => 'nullable|string|max:50',
            'stockTotal' => 'required|integer|min:0',
            'activo' => 'boolean',
            'estado' => 'required|in:disponible,agotado,mantenimiento',
            'registradoPor' => 'required|exists:users,id',
        ]);

        Inventario::create($validated);

        return redirect()->route('inventario.index')
            ->with('success', 'Item de inventario creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Inventario $inventario)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inventario $inventario)
    {
        $inventario->load('registradoPor');

        return inertia('inventario/Edit', [
            'inventario' => $inventario
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
public function update(Request $request, Inventario $inventario)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'modelo' => 'nullable|string|max:50',
            'marca' => 'nullable|string|max:50',
            'stockTotal' => 'required|integer|min:0',
            'activo' => 'boolean',
            'estado' => 'required|in:disponible,agotado,mantenimiento',
        ]);

        $inventario->update($validated);

        return redirect()->route('inventario.index')
            ->with('success', 'Item de inventario actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventario $inventario)
    {
        //
    }
}
