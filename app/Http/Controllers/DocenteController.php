<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\User;
use App\Http\Requests\StoreDocenteRequest;
use App\Http\Requests\UpdateDocenteRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $docentes = Docente::with('usuario')
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado', $request->estado);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('codigoDocente', 'like', "%{$request->search}%")
                      ->orWhere('especialidad', 'like', "%{$request->search}%")
                      ->orWhereHas('usuario', function ($userQuery) use ($request) {
                          $userQuery->where('name', 'like', "%{$request->search}%")
                                   ->orWhere('email', 'like', "%{$request->search}%");
                      });
                });
            })
            ->orderBy('codigoDocente')
            ->get();

        return Inertia::render('docentes/Index', [
            'docentes' => $docentes,
            'filters' => $request->only(['search', 'estado'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
/**
 * Show the form for creating a new resource.
 */
    public function create()
    {
        $usuarios = User::whereDoesntHave('docente')
            ->role('docente') // Filtra solo usuarios con rol 'docente'
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('docentes/Create', [
            'usuarios' => $usuarios
    ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocenteRequest $request)
    {
        Docente::create($request->validated());

        return redirect()->route('docentes.index')
            ->with('success', 'Docente creado exitosamente');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Docente $docente)
    {
        $usuarios = User::whereDoesntHave('docente')
            ->orWhere('id', $docente->idUsuario)
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('docentes/Edit', [
            'docente' => $docente->load('usuario'),
            'usuarios' => $usuarios
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocenteRequest $request, Docente $docente)
    {
        $docente->update($request->validated());

        return redirect()->route('docentes.index')
            ->with('success', 'Docente actualizado exitosamente');
    }

    /**
     * Change the status of the specified resource.
     */
    public function changeStatus(Docente $docente)
    {
        $nuevoEstado = $docente->estado === 'activo' ? 'inactivo' : 'activo';
        
        $docente->update(['estado' => $nuevoEstado]);

        $mensaje = $nuevoEstado === 'activo' 
            ? 'Docente activado exitosamente' 
            : 'Docente desactivado exitosamente';

        return redirect()->route('docentes.index')
            ->with('success', $mensaje);
    }
}