<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\Asignacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HorarioDocenteController extends Controller
{
    /**
     * Display the teacher's schedule
     */
    public function index()
    {
        // Obtener el docente autenticado
        $userId = Auth::id();
        $docente = Docente::where('idUsuario', $userId)->first();

        if (!$docente) {
            return redirect()->route('dashboard')
                ->with('error', 'No se encontró información de docente para su usuario.');
        }

        // Obtener asignaciones activas con horarios
        $asignaciones = Asignacion::with([
                'materia',
                'grupo',
                'periodo',
                'horarios.bloque',
                'horarios.aula'
            ])
            ->where('idDocente', $docente->idDocente)
            ->where('estado', 'activo')
            ->whereHas('periodo', function($query) {
                $query->where('estado', 'activo');
            })
            ->get();

        return inertia('horario/Index', [
            'docente' => $docente,
            'asignaciones' => $asignaciones,
            'materias' => $asignaciones->pluck('materia')->unique()
        ]);
    }

    /**
     * Show schedule for a specific subject
     */
    public function showMateria($materiaId)
    {
        $userId = Auth::id();
        $docente = Docente::where('idUsuario', $userId)->first();

        if (!$docente) {
            return redirect()->route('horario.index')
                ->with('error', 'No se encontró información de docente.');
        }

        // Obtener horarios específicos de una materia
        $asignacion = Asignacion::with([
                'materia',
                'grupo',
                'periodo',
                'horarios.bloque',
                'horarios.aula'
            ])
            ->where('idDocente', $docente->idDocente)
            ->where('idMateria', $materiaId)
            ->where('estado', 'activo')
            ->whereHas('periodo', function($query) {
                $query->where('estado', 'activo');
            })
            ->firstOrFail();

        return inertia('horario/DetalleMateria', [
            'docente' => $docente,
            'asignacion' => $asignacion
        ]);
    }

    /**
     * Get weekly schedule view
     */
    public function horarioSemanal()
    {
        $userId = Auth::id();
        $docente = Docente::where('idUsuario', $userId)->first();

        if (!$docente) {
            return redirect()->route('dashboard')
                ->with('error', 'No se encontró información de docente.');
        }

        // Obtener todos los horarios organizados por día
        $horariosSemana = Asignacion::with([
                'materia',
                'grupo',
                'horarios.bloque',
                'horarios.aula'
            ])
            ->where('idDocente',$docente->idDocente)
            ->where('estado', 'activo')
            ->whereHas('periodo', function($query) {
                $query->where('estado', 'activo');
            })
            ->get()
            ->flatMap(function ($asignacion) {
                return $asignacion->horarios->map(function ($horario) use ($asignacion) {
                    return [
                        'asignacion' => $asignacion,
                        'horario' => $horario,
                        'materia' => $asignacion->materia,
                        'grupo' => $asignacion->grupo,
                        'bloque' => $horario->bloque,
                        'aula' => $horario->aula
                    ];
                });
            })
            ->groupBy('bloque.diaSemana')
            ->sortKeys();

        return inertia('horario/Semanal', [
            'docente' => $docente,
            'horariosSemana' => $horariosSemana
        ]);
    }
}