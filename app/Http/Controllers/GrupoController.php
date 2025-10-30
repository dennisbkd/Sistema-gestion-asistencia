<?php

namespace App\Http\Controllers;

use App\Models\Grupo;
use App\Http\Requests\StoreGrupoRequest;
use App\Http\Requests\UpdateGrupoRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $grupos = Grupo::query()
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado', $request->estado);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('codigoGrupo', 'like', "%{$request->search}%");
            })
            ->orderBy('codigoGrupo')
            ->get();

        return Inertia::render('grupos/Index', [
            'grupos' => $grupos,
            'filters' => $request->only(['search', 'estado'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('grupos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGrupoRequest $request)
    {
        Grupo::create($request->validated());

        return redirect()->route('grupos.index')
            ->with('success', 'Grupo creado exitosamente');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Grupo $grupo)
    {
        return Inertia::render('grupos/Edit', [
            'grupo' => $grupo
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGrupoRequest $request, Grupo $grupo)
    {
        $grupo->update($request->validated());

        return redirect()->route('grupos.index')
            ->with('success', 'Grupo actualizado exitosamente');
    }

    /**
     * Change the status of the specified resource.
     */
    public function changeStatus(Grupo $grupo)
    {
        $nuevoEstado = $grupo->estado === 'activo' ? 'inactivo' : 'activo';
        
        $grupo->update(['estado' => $nuevoEstado]);

        $mensaje = $nuevoEstado === 'activo' 
            ? 'Grupo activado exitosamente' 
            : 'Grupo desactivado exitosamente';

        return redirect()->route('grupos.index')
            ->with('success', $mensaje);
    }
}