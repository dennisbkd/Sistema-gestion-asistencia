<?php

namespace App\Http\Controllers;

use App\Models\PeriodoAcademico;
use App\Http\Requests\StorePeriodoAcademicoRequest;
use App\Http\Requests\UpdatePeriodoAcademicoRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodoAcademicoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $periodos = PeriodoAcademico::with('asignaciones')
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado', $request->estado);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('nroSemestre', 'like', "%{$request->search}%")
                      ->orWhere('año', 'like', "%{$request->search}%");
                });
            })
            ->orderBy('año', 'desc')
            ->orderBy('nroSemestre', 'desc')
            ->get();

        return Inertia::render('periodos-academicos/Index', [
            'periodos' => $periodos,
            'filters' => $request->only(['search', 'estado'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('periodos-academicos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePeriodoAcademicoRequest $request)
    {
        PeriodoAcademico::create($request->validated());

        return redirect()->route('periodos-academicos.index')
            ->with('success', 'Periodo académico creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(PeriodoAcademico $periodosAcademico)
    {
        return Inertia::render('periodos-academicos/Show', [
            'periodo' => $periodosAcademico->load('asignaciones')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PeriodoAcademico $periodosAcademico)
    {
        return Inertia::render('periodos-academicos/Edit', [
            'periodo' => $periodosAcademico
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePeriodoAcademicoRequest $request, PeriodoAcademico $periodosAcademico)
    {
        $periodosAcademico->update($request->validated());

        return redirect()->route('periodos-academicos.index')
            ->with('success', 'Periodo académico actualizado exitosamente');
    }

    /**
     * Change the status of the specified resource.
     */
    public function changeStatus(PeriodoAcademico $periodosAcademico)
    {
        $nuevoEstado = $periodosAcademico->estado === 'activo' ? 'finalizado' : 'activo';
        
        $periodosAcademico->update(['estado' => $nuevoEstado]);

        $mensaje = $nuevoEstado === 'activo' 
            ? 'Periodo académico activado exitosamente' 
            : 'Periodo académico finalizado exitosamente';

        return redirect()->route('periodos-academicos.index')
            ->with('success', $mensaje);
    }

    /**
     * Planificar periodo académico
     */
    public function planificar(PeriodoAcademico $periodosAcademico)
    {
        $periodosAcademico->update(['estado' => 'planificado']);

        return redirect()->route('periodos-academicos.index')
            ->with('success', 'Periodo académico planificado exitosamente');
    }


    /**
     * Show materias del periodo académico
     */
    public function materias(PeriodoAcademico $periodosAcademico)
    {
        $materias = $periodosAcademico->materias()
            ->withCount(['asignaciones' => function($query) use ($periodosAcademico) {
                $query->where('idPeriodo', $periodosAcademico->idPeriodo);
            }])
            ->get();

        return Inertia::render('periodos-academicos/Materias', [
            'periodo' => $periodosAcademico,
            'materias' => $materias
        ]);
    }

    /**
     * Show docentes del periodo académico
     */
    public function docentes(PeriodoAcademico $periodosAcademico)
    {
        $docentes = $periodosAcademico->docentes()
            ->with('usuario')
            ->withCount(['asignaciones' => function($query) use ($periodosAcademico) {
                $query->where('idPeriodo', $periodosAcademico->idPeriodo);
            }])
            ->get();

        return Inertia::render('periodos-academicos/Docentes', [
            'periodo' => $periodosAcademico,
            'docentes' => $docentes
        ]);
    }

    /**
     * Show grupos del periodo académico
     */
    public function grupos(PeriodoAcademico $periodosAcademico)
    {
        $grupos = $periodosAcademico->grupos()
            ->withCount(['asignaciones' => function($query) use ($periodosAcademico) {
                $query->where('idPeriodo', $periodosAcademico->idPeriodo);
            }])
            ->get();

        return Inertia::render('periodos-academicos/Grupos', [
            'periodo' => $periodosAcademico,
            'grupos' => $grupos
        ]);
    }
}