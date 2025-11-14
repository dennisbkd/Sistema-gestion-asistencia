<?php

namespace App\Http\Controllers;

use App\Models\Asignacion;
use App\Models\PeriodoAcademico;
use App\Models\Materia;
use App\Models\Docente;
use App\Models\Grupo;
use App\Models\HorarioAsignacion;
use App\Models\BloqueHorario;
use App\Models\Aula;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreAsignacionRequest;
use App\Http\Requests\UpdateAsignacionRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AsignacionController extends Controller
{
    /**
     * Verificar conflictos de horarios
     */
    private function verificarConflictos($idDocente, $idGrupo, $idAula, $idBloque, $excluirAsignacionId = null)
    {
        $conflictos = [];

        // Verificar conflicto con docente (mismo docente, mismo bloque)
        $conflictoDocente = HorarioAsignacion::whereHas('asignacion', function($query) use ($idDocente, $excluirAsignacionId) {
            $query->where('idDocente', $idDocente)
                  ->where('estado', 'activo')
                  ->when($excluirAsignacionId, function($q) use ($excluirAsignacionId) {
                      $q->where('idAsignacion', '!=', $excluirAsignacionId);
                  });
        })->where('idBloque', $idBloque)
          ->where('estado', 'activo')
          ->first();

        if ($conflictoDocente) {
            $conflictos[] = [
                'tipo' => 'docente',
                'mensaje' => 'El docente ya tiene una asignación en este horario',
                'asignacion' => $conflictoDocente->asignacion
            ];
        }

        // Verificar conflicto con grupo (mismo grupo, mismo bloque)
        $conflictoGrupo = HorarioAsignacion::whereHas('asignacion', function($query) use ($idGrupo, $excluirAsignacionId) {
            $query->where('idGrupo', $idGrupo)
                  ->where('estado', 'activo')
                  ->when($excluirAsignacionId, function($q) use ($excluirAsignacionId) {
                      $q->where('idAsignacion', '!=', $excluirAsignacionId);
                  });
        })->where('idBloque', $idBloque)
          ->where('estado', 'activo')
          ->first();

        if ($conflictoGrupo) {
            $conflictos[] = [
                'tipo' => 'grupo',
                'mensaje' => 'El grupo ya tiene una asignación en este horario',
                'asignacion' => $conflictoGrupo->asignacion
            ];
        }

        // Verificar conflicto con aula (misma aula, mismo bloque)
        $conflictoAula = HorarioAsignacion::where('idAula', $idAula)
            ->where('idBloque', $idBloque)
            ->where('estado', 'activo')
            ->when($excluirAsignacionId, function($q) use ($excluirAsignacionId) {
                $q->whereHas('asignacion', function($query) use ($excluirAsignacionId) {
                    $query->where('idAsignacion', '!=', $excluirAsignacionId);
                });
            })
            ->first();

        if ($conflictoAula) {
            $conflictos[] = [
                'tipo' => 'aula',
                'mensaje' => 'El aula ya está ocupada en este horario',
                'asignacion' => $conflictoAula->asignacion
            ];
        }

        return $conflictos;
    }

    /**
     * Verificar capacidad del aula
     */
    private function verificarCapacidadAula($idAula, $inscritos)
    {
        $aula = Aula::find($idAula);
        
        if ($aula && $aula->capacidad < $inscritos) {
            return [
                'error' => true,
                'mensaje' => "El aula {$aula->codigoAula} tiene capacidad para {$aula->capacidad} estudiantes, pero se han inscrito {$inscritos}"
            ];
        }

        return ['error' => false];
    }

    /**
     * Verificar horas del docente
     */
    private function verificarHorasDocente($idDocente, $idPeriodo, $horariosAgregar = [], $excluirAsignacionId = null)
    {
        $docente = Docente::with(['asignaciones' => function($query) use ($idPeriodo, $excluirAsignacionId) {
            $query->where('idPeriodo', $idPeriodo)
                  ->where('estado', 'activo')
                  ->when($excluirAsignacionId, function($q) use ($excluirAsignacionId) {
                      $q->where('idAsignacion', '!=', $excluirAsignacionId);
                  })
                  ->with('horarios.bloque');
        }])->find($idDocente);

        if (!$docente) {
            return ['error' => true, 'mensaje' => 'Docente no encontrado'];
        }

        // Calcular horas actuales del docente
        $horasActuales = 0;
        foreach ($docente->asignaciones as $asignacion) {
            foreach ($asignacion->horarios as $horario) {
                if ($horario->bloque) {
                    $horasActuales += $this->calcularHorasBloque($horario->bloque);
                }
            }
        }

        // Calcular horas a agregar
        $horasAgregar = 0;
        foreach ($horariosAgregar as $idBloque) {
            $bloque = BloqueHorario::find($idBloque);
            if ($bloque) {
                $horasAgregar += $this->calcularHorasBloque($bloque);
            }
        }

        $totalHoras = $horasActuales + $horasAgregar;

        if ($docente->maxHorasSemanales && $totalHoras > $docente->maxHorasSemanales) {
            return [
                'error' => true,
                'mensaje' => "El docente excede sus horas máximas semanales. Actual: {$horasActuales}h + Nuevas: {$horasAgregar}h = {$totalHoras}h. Máximo permitido: {$docente->maxHorasSemanales}h"
            ];
        }

        return ['error' => false, 'horas_actuales' => $horasActuales, 'horas_agregar' => $horasAgregar];
    }

    /**
     * Calcular horas de un bloque
     */
    private function calcularHorasBloque($bloque)
    {
        try {
            $inicio = \Carbon\Carbon::createFromFormat('H:i:s', $bloque->horaInicio);
            $fin = \Carbon\Carbon::createFromFormat('H:i:s', $bloque->horaFin);
            return $fin->diffInHours($inicio);
        } catch (\Exception $e) {
            Log::error("Error calculando horas del bloque {$bloque->idBloque}: " . $e->getMessage());
            return 0;
        }
    }

public function index(Request $request)
{
    $query = Asignacion::with([
        'periodo',
        'materia',
        'docente.usuario',
        'grupo',
        'horarios.bloque',
        'horarios.aula'
    ]);

    if ($request->has('search') && $request->search) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->whereHas('docente.usuario', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->orWhereHas('materia', function($q) use ($search) {
                $q->where('sigla', 'like', "%{$search}%")
                  ->orWhere('nombre', 'like', "%{$search}%");
            })
            ->orWhereHas('grupo', function($q) use ($search) {
                $q->where('codigoGrupo', 'like', "%{$search}%");
            });
        });
    }

    if ($request->has('estado') && $request->estado && $request->estado !== 'all') {
        $query->where('estado', $request->estado);
    }

    if ($request->has('periodo') && $request->periodo && $request->periodo !== 'all') {
        $query->where('idPeriodo', $request->periodo);
    }

    $asignaciones = $query->get(); // ← Esto podría ser el problema
    $periodos = PeriodoAcademico::all();


    return Inertia::render('asignaciones/Index', [
        'asignaciones' => $asignaciones,
        'periodos' => $periodos,
        'filters' => $request->only(['search', 'estado', 'periodo'])
    ]);
}

    public function create()
    {
        return Inertia::render('asignaciones/Create', [
            'periodos' => PeriodoAcademico::where('estado', 'activo')->get(),
            'materias' => Materia::where('estado', 'activo')->get(),
            'docentes' => Docente::with('usuario')
                ->where('estado', 'activo')
                ->get(),
            'grupos' => Grupo::where('estado', 'activo')->get(),
            'bloques' => BloqueHorario::all(),
            'aulas' => Aula::where('activo', true)->get()
        ]);
    }

public function store(StoreAsignacionRequest $request)
{
    try {
        $data = $request->validated();

        Log::info('📥 INICIO - Datos recibidos en store:', $request->all());
        Log::info('📊 Datos validados:', $data);

        // Verificar capacidad del aula para cada horario
        foreach ($data['horarios'] as $horario) {
            $capacidadCheck = $this->verificarCapacidadAula($horario['idAula'], $data['inscritos'] ?? 0);
            if ($capacidadCheck['error']) {
                Log::warning('⚠️ Error de capacidad:', $capacidadCheck);
                return back()
                    ->withInput()
                    ->with('error', $capacidadCheck['mensaje']);
            }
        }

        // Verificar horas del docente
        $horasCheck = $this->verificarHorasDocente(
            $data['idDocente'], 
            $data['idPeriodo'],
            array_column($data['horarios'], 'idBloque')
        );
        
        if ($horasCheck['error']) {
            Log::warning('⚠️ Error de horas:', $horasCheck);
            return back()
                ->withInput()
                ->with('error', $horasCheck['mensaje']);
        }

        // Verificar conflictos para cada horario
        $todosLosConflictos = [];
        foreach ($data['horarios'] as $horario) {
            $conflictos = $this->verificarConflictos(
                $data['idDocente'],
                $data['idGrupo'],
                $horario['idAula'],
                $horario['idBloque']
            );

            if (!empty($conflictos)) {
                $todosLosConflictos = array_merge($todosLosConflictos, $conflictos);
            }
        }

        // Si hay conflictos, mostrar mensaje de error
        if (!empty($todosLosConflictos)) {
            Log::warning('⚠️ Conflictos detectados:', $todosLosConflictos);
            
            $mensajeError = "Se encontraron los siguientes conflictos:\n";
            foreach ($todosLosConflictos as $conflicto) {
                $materia = $conflicto['asignacion']->materia->nombre ?? 'Desconocida';
                $grupo = $conflicto['asignacion']->grupo->codigoGrupo ?? 'Desconocido';
                $mensajeError .= "• {$conflicto['mensaje']} (Materia: {$materia}, Grupo: {$grupo})\n";
            }
            
            return back()
                ->withInput()
                ->with('error', $mensajeError);
        }

        Log::info('✅ Todas las validaciones pasaron, iniciando transacción...');

        // Iniciar transacción
        DB::beginTransaction();
        
        try {
            // Crear asignación
            $asignacion = Asignacion::create([
                'idPeriodo' => $data['idPeriodo'],
                'idMateria' => $data['idMateria'],
                'idDocente' => $data['idDocente'],
                'idGrupo' => $data['idGrupo'],
                'modalidad' => $data['modalidad'] ?? 'presencial',
                'estado' => 'activo',
                'inscritos' => $data['inscritos'] ?? 0
            ]);

            Log::info('✅ Asignación creada con ID: ' . $asignacion->idAsignacion, $asignacion->toArray());

            // Crear horarios
            $horariosCreados = [];
            foreach ($data['horarios'] as $horario) {
                $horarioCreado = HorarioAsignacion::create([
                    'idAsignacion' => $asignacion->idAsignacion,
                    'idBloque' => $horario['idBloque'],
                    'idAula' => $horario['idAula'],
                    'estado' => 'activo'
                ]);
                $horariosCreados[] = $horarioCreado->idHorarioAsignacion;
            }

            Log::info('✅ Horarios creados:', $horariosCreados);

            // Commit de la transacción
            DB::commit();
            
            Log::info('✅ TRANSACCIÓN COMPLETADA - Asignación ID: ' . $asignacion->idAsignacion);

            return redirect()
                ->route('asignaciones.index')
                ->with('success', 'Asignación creada exitosamente');

        } catch (\Exception $e) {
            // Rollback en caso de error
            DB::rollBack();
            
            Log::error('❌ ERROR EN TRANSACCIÓN: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            throw $e; // Re-lanzar para que el catch externo lo maneje
        }

    } catch (\Exception $e) {
        Log::error('❌ ERROR GENERAL al crear asignación: ' . $e->getMessage());
        Log::error('Archivo: ' . $e->getFile() . ' Línea: ' . $e->getLine());
        Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return back()
            ->withInput()
            ->with('error', 'Error al crear la asignación: ' . $e->getMessage());
    }
}

    public function edit(Asignacion $asignacion)
    {
        // Verificar si el período está finalizado
        $periodoFinalizado = $asignacion->periodo->estado === 'finalizado';

        return Inertia::render('asignaciones/Edit', [
            'asignacion' => $asignacion->load([
                'periodo',
                'materia',
                'docente.usuario',
                'grupo',
                'horarios.bloque',
                'horarios.aula'
            ]),
            'periodos' => PeriodoAcademico::where('estado', 'activo')->get(),
            'materias' => Materia::where('estado', 'activo')->get(),
            'docentes' => Docente::with('usuario')->where('estado', 'activo')->get(),
            'grupos' => Grupo::where('estado', 'activo')->get(),
            'bloques' => BloqueHorario::all(),
            'aulas' => Aula::where('activo', true)->get(),
            'periodoFinalizado' => $periodoFinalizado
        ]);
    }

    public function update(UpdateAsignacionRequest $request, Asignacion $asignacion)
    {
        // Verificar si el período está finalizado
        if ($asignacion->periodo->estado === 'finalizado') {
            return back()->with('error', 'No se puede editar una asignación de un período finalizado.');
        }

        try {
            $data = $request->validated();

            Log::info('📥 Datos recibidos en update:', $request->all());
            Log::info('📊 Datos validados en update:', $data);

            // Verificar capacidad del aula para cada horario
            foreach ($data['horarios'] as $horario) {
                $capacidadCheck = $this->verificarCapacidadAula($horario['idAula'], $data['inscritos'] ?? 0);
                if ($capacidadCheck['error']) {
                    return back()->with('error', $capacidadCheck['mensaje']);
                }
            }

            // Verificar horas del docente
            $horasCheck = $this->verificarHorasDocente(
                $data['idDocente'], 
                $data['idPeriodo'],
                array_column($data['horarios'], 'idBloque'),
                $asignacion->idAsignacion
            );
            if ($horasCheck['error']) {
                return back()->with('error', $horasCheck['mensaje']);
            }

            // Verificar conflictos para cada horario (excluyendo la asignación actual)
            $todosLosConflictos = [];
            foreach ($data['horarios'] as $horario) {
                $conflictos = $this->verificarConflictos(
                    $data['idDocente'],
                    $data['idGrupo'],
                    $horario['idAula'],
                    $horario['idBloque'],
                    $asignacion->idAsignacion
                );

                if (!empty($conflictos)) {
                    $todosLosConflictos = array_merge($todosLosConflictos, $conflictos);
                }
            }

            // Si hay conflictos, mostrar mensaje de error
            if (!empty($todosLosConflictos)) {
                $mensajeError = "Se encontraron los siguientes conflictos:\n";
                foreach ($todosLosConflictos as $conflicto) {
                    $materia = $conflicto['asignacion']->materia->nombre ?? 'Desconocida';
                    $grupo = $conflicto['asignacion']->grupo->codigoGrupo ?? 'Desconocido';
                    $mensajeError .= "• {$conflicto['mensaje']} (Materia: {$materia}, Grupo: {$grupo})\n";
                }
                
                return back()->with('error', $mensajeError);
            }

            DB::transaction(function () use ($asignacion, $data) {
                $asignacion->update([
                    'idPeriodo' => $data['idPeriodo'],
                    'idMateria' => $data['idMateria'],
                    'idDocente' => $data['idDocente'],
                    'idGrupo' => $data['idGrupo'],
                    'modalidad' => $data['modalidad'] ?? $asignacion->modalidad,
                    'inscritos' => $data['inscritos'] ?? $asignacion->inscritos
                ]);

                Log::info('✅ Asignación actualizada:', $asignacion->toArray());

                $asignacion->horarios()->delete();
                
                $horariosData = array_map(function ($horario) use ($asignacion) {
                    return [
                        'idAsignacion' => $asignacion->idAsignacion,
                        'idBloque' => $horario['idBloque'],
                        'idAula' => $horario['idAula'],
                        'estado' => 'activo',
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }, $data['horarios']);

                HorarioAsignacion::insert($horariosData);
            });

            return redirect()->route('asignaciones.index')
                ->with('success', 'Asignación actualizada exitosamente');

        } catch (\Exception $e) {
            Log::error('❌ Error al actualizar asignación: ' . $e->getMessage());
            Log::error('🔍 Trace:', ['trace' => $e->getTraceAsString()]);
            
            return back()->with('error', 'Error al actualizar la asignación. Por favor, intente nuevamente.');
        }
    }

    public function destroy(Asignacion $asignacion)
    {
        $asignacion->update(['estado' => 'cancelado']);

        return redirect()->route('asignaciones.index')
            ->with('success', 'Asignación cancelada exitosamente');
    }

    public function show(Asignacion $asignacion)
    {
        $asignacion->load([
            'periodo',
            'materia',
            'docente.usuario',
            'grupo',
            'horarios.bloque',
            'horarios.aula'
        ]);

        return Inertia::render('asignaciones/Detalle', [
            'asignacion' => $asignacion
        ]);
    }

    /**
     * API: Verificar conflictos en tiempo real (para usar en el frontend)
     */
    public function verificarConflictosApi(Request $request)
    {
        $request->validate([
            'idDocente' => 'required|integer',
            'idGrupo' => 'required|integer',
            'idAula' => 'required|integer',
            'idBloque' => 'required|integer',
            'excluirAsignacion' => 'nullable|integer'
        ]);

        $conflictos = $this->verificarConflictos(
            $request->idDocente,
            $request->idGrupo,
            $request->idAula,
            $request->idBloque,
            $request->excluirAsignacion
        );

        return response()->json([
            'tiene_conflictos' => !empty($conflictos),
            'conflictos' => $conflictos
        ]);
    }

    /**
     * API: Verificar capacidad del aula
     */
    public function verificarCapacidadApi(Request $request)
    {
        $request->validate([
            'idAula' => 'required|integer',
            'inscritos' => 'required|integer|min:0'
        ]);

        $resultado = $this->verificarCapacidadAula($request->idAula, $request->inscritos);

        return response()->json($resultado);
    }

    /**
     * API: Verificar horas del docente
     */
    public function verificarHorasDocenteApi(Request $request)
    {
        $request->validate([
            'idDocente' => 'required|integer',
            'idPeriodo' => 'required|integer',
            'horarios' => 'required|array',
            'horarios.*' => 'integer',
            'excluirAsignacion' => 'nullable|integer'
        ]);

        $resultado = $this->verificarHorasDocente(
            $request->idDocente,
            $request->idPeriodo,
            $request->horarios,
            $request->excluirAsignacion
        );

        return response()->json($resultado);
    }
}