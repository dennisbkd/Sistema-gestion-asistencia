<?php

namespace App\Http\Controllers;

use App\Models\BloqueHorario;
use App\Models\HorarioAsignacion;
use App\Models\Materia;
use App\Models\Docente;
use App\Models\Grupo;
use App\Models\Aula;
use App\Http\Requests\StoreBloqueHorarioRequest;
use App\Http\Requests\UpdateBloqueHorarioRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BloqueHorarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bloques = BloqueHorario::withCount('horariosAsignacion')->get()->map(function ($bloque) {
            return [
                'idBloque' => $bloque->idBloque,
                'diaSemana' => $bloque->diaSemana,
                'horaInicio' => $bloque->horaInicio ? \Carbon\Carbon::parse($bloque->horaInicio)->format('H:i') : null,
                'horaFin' => $bloque->horaFin ? \Carbon\Carbon::parse($bloque->horaFin)->format('H:i') : null,
                'turno' => $bloque->turno,
                'horarios_asignacion_count' => $bloque->horarios_asignacion_count,
                'created_at' => $bloque->created_at,
                'updated_at' => $bloque->updated_at,
            ];
        });

        return Inertia::render('bloques-horarios/Index', [
            'bloques' => $bloques,
            'filters' => request()->all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('bloques-horarios/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBloqueHorarioRequest $request)
    {
        // Verificar que no exista un bloque con el mismo día y horario
        $bloqueExistente = BloqueHorario::where('diaSemana', $request->diaSemana)
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('horaInicio', '<=', $request->horaInicio)
                      ->where('horaFin', '>', $request->horaInicio);
                })->orWhere(function ($q) use ($request) {
                    $q->where('horaInicio', '<', $request->horaFin)
                      ->where('horaFin', '>=', $request->horaFin);
                })->orWhere(function ($q) use ($request) {
                    $q->where('horaInicio', '>=', $request->horaInicio)
                      ->where('horaFin', '<=', $request->horaFin);
                });
            })
            ->first();

        if ($bloqueExistente) {
            return back()->withErrors('Ya existe un bloque horario que se solapa con este horario.');
        }

        BloqueHorario::create($request->validated());

        return redirect()->route('bloques-horarios.index')
            ->with('success', 'Bloque horario creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(BloqueHorario $bloquesHorario)
    {
        return Inertia::render('bloques-horarios/Show', [
            'bloque' => $bloquesHorario->load('horariosAsignacion.asignacion.materia', 'horariosAsignacion.asignacion.docente', 'horariosAsignacion.asignacion.grupo', 'horariosAsignacion.aula')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BloqueHorario $bloquesHorario)
    {
        return Inertia::render('bloques-horarios/Edit', [
            'bloque' => $bloquesHorario
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBloqueHorarioRequest $request, BloqueHorario $bloquesHorario)
    {
        // Verificar solapamiento (excluyendo el bloque actual)
        $bloqueExistente = BloqueHorario::where('idBloque', '!=', $bloquesHorario->idBloque)
            ->where('diaSemana', $request->diaSemana ?? $bloquesHorario->diaSemana)
            ->where(function ($query) use ($request, $bloquesHorario) {
                $horaInicio = $request->horaInicio ?? $bloquesHorario->horaInicio->format('H:i');
                $horaFin = $request->horaFin ?? $bloquesHorario->horaFin->format('H:i');
                
                $query->where(function ($q) use ($horaInicio, $horaFin) {
                    $q->where('horaInicio', '<=', $horaInicio)
                      ->where('horaFin', '>', $horaInicio);
                })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                    $q->where('horaInicio', '<', $horaFin)
                      ->where('horaFin', '>=', $horaFin);
                })->orWhere(function ($q) use ($horaInicio, $horaFin) {
                    $q->where('horaInicio', '>=', $horaInicio)
                      ->where('horaFin', '<=', $horaFin);
                });
            })
            ->first();

        if ($bloqueExistente) {
            return back()->withErrors('Ya existe otro bloque horario que se solapa con este horario.');
        }

        $bloquesHorario->update($request->validated());

        return redirect()->route('bloques-horarios.index')
            ->with('success', 'Bloque horario actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BloqueHorario $bloquesHorario)
    {
        $enUso = HorarioAsignacion::where('idBloque', $bloquesHorario->idBloque)->exists();

        if ($enUso) {
            return back()->withErrors('No se puede eliminar este bloque porque está ocupado por asignaciones.');
        }

        $bloquesHorario->delete();

        return redirect()->route('bloques-horarios.index')
            ->with('success', 'Bloque horario eliminado exitosamente');
    }

    /**
     * Show detalle del bloque horario con filtros
     */
    public function detalle(BloqueHorario $bloquesHorario)
    {
        // Obtener horarios con todas las relaciones
        $horarios = HorarioAsignacion::where('idBloque', $bloquesHorario->idBloque)
            ->with([
                'asignacion.materia',
                'asignacion.docente.usuario',
                'asignacion.grupo',
                'aula'
            ])
            ->get();

        // Obtener datos únicos para los filtros
        $materias = Materia::whereIn('idMateria', 
            $horarios->pluck('asignacion.idMateria')->unique()
        )->get();

        $docentes = Docente::whereIn('idDocente', 
            $horarios->pluck('asignacion.idDocente')->unique()
        )->with('usuario')->get();

        $grupos = Grupo::whereIn('idGrupo', 
            $horarios->pluck('asignacion.idGrupo')->unique()
        )->get();

        $aulas = Aula::whereIn('id', 
            $horarios->pluck('idAula')->unique()
        )->get(); // ✅ Punto y coma agregado

        // Obtener aulas libres
        $aulasOcupadasIds = $horarios->pluck('idAula')->unique()->toArray();
        $aulasLibres = Aula::whereNotIn('id', $aulasOcupadasIds)->get();

        return Inertia::render('bloques-horarios/Detalle', [
            'bloque' => [
                'idBloque' => $bloquesHorario->idBloque,
                'diaSemana' => $bloquesHorario->diaSemana,
                'horaInicio' => $bloquesHorario->horaInicio ? \Carbon\Carbon::parse($bloquesHorario->horaInicio)->format('H:i') : null,
                'horaFin' => $bloquesHorario->horaFin ? \Carbon\Carbon::parse($bloquesHorario->horaFin)->format('H:i') : null,
                'turno' => $bloquesHorario->turno,
                'created_at' => $bloquesHorario->created_at,
                'updated_at' => $bloquesHorario->updated_at,
            ],
            'horarios' => $horarios,
            'materias' => $materias,
            'docentes' => $docentes,
            'grupos' => $grupos,
            'aulas' => $aulas,
            'aulasLibres' => $aulasLibres,
        ]);
    }

    /**
     * Show grupos del bloque horario
     */
    public function grupos(BloqueHorario $bloquesHorario)
    {
        $grupos = Grupo::whereHas('asignaciones.horarios', function($q) use ($bloquesHorario) {
            $q->where('idBloque', $bloquesHorario->idBloque);
        })
        ->withCount(['asignaciones' => function($query) use ($bloquesHorario) {
            $query->whereHas('horarios', function($q) use ($bloquesHorario) {
                $q->where('idBloque', $bloquesHorario->idBloque);
            });
        }])
        ->get();

        return Inertia::render('bloques-horarios/Grupos', [
            'bloque' => $bloquesHorario,
            'grupos' => $grupos
        ]);
    }

    /**
     * Show aulas del bloque horario
     */
    public function aulas(BloqueHorario $bloquesHorario)
    {
        $aulas = Aula::whereHas('horariosAsignacion', function($q) use ($bloquesHorario) {
            $q->where('idBloque', $bloquesHorario->idBloque);
        })
        ->withCount(['horariosAsignacion' => function($query) use ($bloquesHorario) {
            $query->where('idBloque', $bloquesHorario->idBloque);
        }])
        ->get();

        return Inertia::render('bloques-horarios/Aulas', [
            'bloque' => $bloquesHorario,
            'aulas' => $aulas
        ]);
    }
}
