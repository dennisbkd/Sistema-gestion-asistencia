<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Http\Requests\StoreMateriaRequest;
use App\Http\Requests\UpdateMateriaRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $materias = Materia::query()
            ->when($request->filled('semestre'), function ($query) use ($request) {
                $query->where('semestre', $request->semestre);
            })
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado', $request->estado);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('nombre', 'like', "%{$request->search}%")
                      ->orWhere('sigla', 'like', "%{$request->search}%");
                });
            })
            ->orderBy('semestre')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('materias/Index', [
            'materias' => $materias,
            'filters' => $request->only(['search', 'semestre', 'estado'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('materias/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMateriaRequest $request)
    {
        Materia::create($request->validated());

        return redirect()->route('materias.index')
            ->with('success', 'Materia creada exitosamente');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Materia $materia)
    {
        return Inertia::render('materias/Edit', [
            'materia' => $materia
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMateriaRequest $request, Materia $materia)
    {
        $materia->update($request->validated());

        return redirect()->route('materias.index')
            ->with('success', 'Materia actualizada exitosamente');
    }

    /**
     * Change the status of the specified resource.
     */
    public function changeStatus(Materia $materia)
    {
        $nuevoEstado = $materia->estado === 'activo' ? 'inactivo' : 'activo';
        
        $materia->update(['estado' => $nuevoEstado]);

        $mensaje = $nuevoEstado === 'activo' 
            ? 'Materia activada exitosamente' 
            : 'Materia desactivada exitosamente';

        return redirect()->route('materias.index')
            ->with('success', $mensaje);
    }
}