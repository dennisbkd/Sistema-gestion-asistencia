<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\{
    Asistencia,
    Asignacion,
    Docente,
    Materia,
    PeriodoAcademico,
    Aula,
    Inventario,
    HorarioAsignacion,
    BloqueHorario,
    Grupo,
};

class ReporteController extends Controller
{
    /**
     * Página principal de reportes
     */
    public function index()
    {
        return Inertia::render('reportes/Index');
    }

    /**
     * Página de dashboard de reportes
     */
    // En ReporteController.php - método dashboard actualizado
    public function dashboard()
    {
        // Estadísticas básicas
        $totalDocentes = Docente::where('estado', 'activo')->count();
        $totalAulas = Aula::where('activo', true)->count();
        $totalMaterias = Materia::where('estado', 'activo')->count();
        $totalAsignaciones = Asignacion::where('estado', 'activo')->count();
        $asistenciasHoy = Asistencia::whereDate('fecha', Carbon::today())->count();
        $inventarioDisponible = Inventario::where('estado', 'disponible')->count();

        // Estadísticas de asistencias del mes actual
        $inicioMes = Carbon::now()->startOfMonth();
        $finMes = Carbon::now()->endOfMonth();
        
        $asistenciasMes = Asistencia::whereBetween('fecha', [$inicioMes, $finMes])->count();
        $asistenciasPresentes = Asistencia::whereBetween('fecha', [$inicioMes, $finMes])
            ->where('estado', 'presente')->count();
        $asistenciasTardanzas = Asistencia::whereBetween('fecha', [$inicioMes, $finMes])
            ->where('estado', 'tardanza')->count();
        $asistenciasAusentes = Asistencia::whereBetween('fecha', [$inicioMes, $finMes])
            ->where('estado', 'ausente')->count();

        $porcentajeAsistencia = $asistenciasMes > 0 ? 
            round(($asistenciasPresentes / $asistenciasMes) * 100, 2) : 0;

        // Docentes con más asignaciones
        $docentesTop = Docente::withCount(['asignaciones' => function($query) {
                $query->where('estado', 'activo');
            }])
            ->where('estado', 'activo')
            ->orderBy('asignaciones_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($docente) {
                return [
                    'nombre' => $docente->usuario->name,
                    'asignaciones' => $docente->asignaciones_count,
                    'codigo' => $docente->codigoDocente
                ];
            });

        // Aulas más utilizadas
        $aulasUtilizadas = Aula::withCount(['horariosAsignacion' => function($query) {
                $query->whereHas('asignacion', function($q) {
                    $q->where('estado', 'activo');
                });
            }])
            ->where('activo', true)
            ->orderBy('horarios_asignacion_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($aula) {
                return [
                    'nombre' => $aula->codigoAula,
                    'horarios' => $aula->horarios_asignacion_count,
                    'tipo' => $aula->tipo,
                    'capacidad' => $aula->capacidad
                ];
            });

        // Materias más asignadas
        $materiasTop = Materia::withCount(['asignaciones' => function($query) {
                $query->where('estado', 'activo');
            }])
            ->where('estado', 'activo')
            ->orderBy('asignaciones_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($materia) {
                return [
                    'nombre' => $materia->nombre,
                    'sigla' => $materia->sigla,
                    'asignaciones' => $materia->asignaciones_count,
                    'semestre' => $materia->semestre
                ];
            });

        // Actividad reciente en bitácora (últimas 24 horas)
        $actividadesRecientes = DB::table('bitacora')
            ->where('created_at', '>=', Carbon::now()->subDay())
            ->count();

        // Movimientos de inventario del mes
        $movimientosMes = DB::table('movimientos_inventario')
            ->where('created_at', '>=', $inicioMes)
            ->count();

        // Distribución de modalidades
        $modalidades = Asignacion::where('estado', 'activo')
            ->select('modalidad', DB::raw('COUNT(*) as total'))
            ->groupBy('modalidad')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->modalidad => $item->total];
            });

        // Grupos activos
        $gruposActivos = Grupo::where('estado', 'activo')->count();

        // Periodo académico activo
        $periodoActivo = PeriodoAcademico::where('estado', 'activo')->first();

        $resumen = [
            // Estadísticas principales
            'total_docentes' => $totalDocentes,
            'total_aulas' => $totalAulas,
            'total_materias' => $totalMaterias,
            'total_asignaciones' => $totalAsignaciones,
            'asistencias_hoy' => $asistenciasHoy,
            'inventario_disponible' => $inventarioDisponible,
            
            // Estadísticas de asistencias
            'asistencias_mes' => $asistenciasMes,
            'asistencias_presentes' => $asistenciasPresentes,
            'asistencias_tardanzas' => $asistenciasTardanzas,
            'asistencias_ausentes' => $asistenciasAusentes,
            'porcentaje_asistencia' => $porcentajeAsistencia,
            
            // Actividad del sistema
            'actividades_recientes' => $actividadesRecientes,
            'movimientos_mes' => $movimientosMes,
            'grupos_activos' => $gruposActivos,
            
            // Datos para gráficos y listas
            'docentes_top' => $docentesTop,
            'aulas_utilizadas' => $aulasUtilizadas,
            'materias_top' => $materiasTop,
            'modalidades' => $modalidades,
            
            // Información del periodo
            'periodo_activo' => $periodoActivo ? [
                'nombre' => "{$periodoActivo->año} - Semestre {$periodoActivo->nroSemestre}",
                'tipo' => $periodoActivo->tipoPeriodo,
                'fecha_inicio' => $periodoActivo->fechaInicio->format('d/m/Y'),
                'fecha_fin' => $periodoActivo->fechaFin->format('d/m/Y')
            ] : null,
            
            // Fechas para referencia
            'mes_actual' => Carbon::now()->translatedFormat('F Y'),
            'hoy' => Carbon::today()->format('d/m/Y')
        ];

        return Inertia::render('reportes/Dashboard', [
            'resumen' => $resumen
        ]);
    }

    /**
     * Mostrar página de reporte de asistencias
     */
    public function asistencias(Request $request)
    {
        $filtros = $request->only(['idPeriodo', 'idMateria', 'idDocente', 'fechaInicio', 'fechaFin']);
        
        $query = Asistencia::with([
            'asignacion.periodo',
            'asignacion.materia',
            'asignacion.docente.usuario',
            'asignacion.grupo',
            'horarioAsignacion.bloque',
            'horarioAsignacion.aula'
        ]);

        // Aplicar filtros si existen
        if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
            $query->whereHas('asignacion', function($q) use ($filtros) {
                $q->where('idPeriodo', $filtros['idPeriodo']);
            });
        }

        if (!empty($filtros['idMateria']) && $filtros['idMateria'] !== 'all') {
            $query->whereHas('asignacion', function($q) use ($filtros) {
                $q->where('idMateria', $filtros['idMateria']);
            });
        }

        if (!empty($filtros['idDocente']) && $filtros['idDocente'] !== 'all') {
            $query->whereHas('asignacion', function($q) use ($filtros) {
                $q->where('idDocente', $filtros['idDocente']);
            });
        }

        if (!empty($filtros['fechaInicio'])) {
            $query->where('fecha', '>=', $filtros['fechaInicio']);
        }

        if (!empty($filtros['fechaFin'])) {
            $query->where('fecha', '<=', $filtros['fechaFin']);
        }

        $asistencias = $query->orderBy('fecha', 'desc')
                            ->orderBy('horaClaseInicio')
                            ->get()
                            ->map(function ($asistencia) {
                                return [
                                    'id' => $asistencia->idAsistencia,
                                    'fecha' => $asistencia->fecha->format('d/m/Y'),
                                    'hora_clase' => Carbon::parse($asistencia->horaClaseInicio)->format('H:i') . ' - ' . 
                                                   Carbon::parse($asistencia->horaClaseFin)->format('H:i'),
                                    'hora_registro' => $asistencia->horaRegistro ? 
                                                      Carbon::parse($asistencia->horaRegistro)->format('H:i') : 'No registrado',
                                    'estado' => $asistencia->estado,
                                    'minutos_retraso' => $asistencia->minutosRetraso,
                                    'justificacion' => $asistencia->justificacion,
                                    'periodo' => $asistencia->asignacion->periodo->año . '-' . 
                                                $asistencia->asignacion->periodo->nroSemestre,
                                    'materia' => $asistencia->asignacion->materia->nombre,
                                    'docente' => $asistencia->asignacion->docente->usuario->name,
                                    'grupo' => $asistencia->asignacion->grupo->codigoGrupo,
                                    'aula' => $asistencia->horarioAsignacion->aula->codigoAula,
                                    'dia_semana' => $asistencia->horarioAsignacion->bloque->nombreDia
                                ];
                            });

        $periodos = PeriodoAcademico::select('idPeriodo', 'nroSemestre', 'año', 'tipoPeriodo')
            ->orderBy('año', 'desc')
            ->orderBy('nroSemestre', 'desc')
            ->get()
            ->map(function ($periodo) {
                return [
                    'id' => $periodo->idPeriodo,
                    'nombre' => "{$periodo->año} - Semestre {$periodo->nroSemestre} ({$periodo->tipoPeriodo})"
                ];
            });

        $materias = Materia::select('idMateria', 'sigla', 'nombre', 'semestre')
            ->where('estado', 'activo')
            ->orderBy('semestre')
            ->orderBy('nombre')
            ->get()
            ->map(function ($materia) {
                return [
                    'id' => $materia->idMateria,
                    'nombre' => "{$materia->sigla} - {$materia->nombre} (Sem {$materia->semestre})"
                ];
            });

        $docentes = Docente::with('usuario:id,name')
            ->select('idDocente', 'idUsuario', 'codigoDocente')
            ->where('estado', 'activo')
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->idDocente,
                    'nombre' => "{$docente->codigoDocente} - {$docente->usuario->name}"
                ];
            });

        return Inertia::render('reportes/Asistencias', [
            'asistencias' => $asistencias,
            'periodos' => $periodos,
            'materias' => $materias,
            'docentes' => $docentes,
            'filters' => $filtros,
            'total' => $asistencias->count()
        ]);
    }

    /**
     * Mostrar página de reporte de asignaciones
     */
    public function asignaciones(Request $request)
    {
        $filtros = $request->only(['idPeriodo', 'idMateria', 'idDocente']);

        $query = Asignacion::with([
            'periodo',
            'materia',
            'docente.usuario',
            'grupo',
            'horarios.bloque',
            'horarios.aula'
        ]);

        // Aplicar filtros
        if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
            $query->where('idPeriodo', $filtros['idPeriodo']);
        }

        if (!empty($filtros['idMateria']) && $filtros['idMateria'] !== 'all') {
            $query->where('idMateria', $filtros['idMateria']);
        }

        if (!empty($filtros['idDocente']) && $filtros['idDocente'] !== 'all') {
            $query->where('idDocente', $filtros['idDocente']);
        }

        $asignaciones = $query->where('estado', 'activo')
                            ->orderBy('idPeriodo')
                            ->get()
                            ->map(function ($asignacion) {
                                $horarios = $asignacion->horarios->map(function ($horario) {
                                    return [
                                        'dia' => $horario->bloque->nombreDia,
                                        'hora' => Carbon::parse($horario->bloque->horaInicio)->format('H:i') . ' - ' . 
                                                 Carbon::parse($horario->bloque->horaFin)->format('H:i'),
                                        'aula' => $horario->aula->codigoAula,
                                        'turno' => $horario->bloque->turno
                                    ];
                                });

                                return [
                                    'id' => $asignacion->idAsignacion,
                                    'periodo' => $asignacion->periodo->año . '-' . $asignacion->periodo->nroSemestre,
                                    'materia' => $asignacion->materia->nombre,
                                    'sigla' => $asignacion->materia->sigla,
                                    'docente' => $asignacion->docente->usuario->name,
                                    'codigo_docente' => $asignacion->docente->codigoDocente,
                                    'grupo' => $asignacion->grupo->codigoGrupo,
                                    'modalidad' => $asignacion->modalidad,
                                    'inscritos' => $asignacion->inscritos,
                                    'horarios' => $horarios,
                                    'total_horas' => $asignacion->materia->horasSemanales
                                ];
                            });

        $periodos = PeriodoAcademico::select('idPeriodo', 'nroSemestre', 'año', 'tipoPeriodo')
            ->orderBy('año', 'desc')
            ->orderBy('nroSemestre', 'desc')
            ->get()
            ->map(function ($periodo) {
                return [
                    'id' => $periodo->idPeriodo,
                    'nombre' => "{$periodo->año} - Semestre {$periodo->nroSemestre} ({$periodo->tipoPeriodo})"
                ];
            });

        $materias = Materia::select('idMateria', 'sigla', 'nombre', 'semestre')
            ->where('estado', 'activo')
            ->orderBy('semestre')
            ->orderBy('nombre')
            ->get()
            ->map(function ($materia) {
                return [
                    'id' => $materia->idMateria,
                    'nombre' => "{$materia->sigla} - {$materia->nombre} (Sem {$materia->semestre})"
                ];
            });

        $docentes = Docente::with('usuario:id,name')
            ->select('idDocente', 'idUsuario', 'codigoDocente')
            ->where('estado', 'activo')
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->idDocente,
                    'nombre' => "{$docente->codigoDocente} - {$docente->usuario->name}"
                ];
            });

        return Inertia::render('reportes/Asignaciones', [
            'asignaciones' => $asignaciones,
            'periodos' => $periodos,
            'materias' => $materias,
            'docentes' => $docentes,
            'filters' => $filtros,
            'total' => $asignaciones->count()
        ]);
    }

    /**
     * Mostrar página de reporte resumen de asistencias
     */
    public function resumenAsistencias(Request $request)
    {
        $filtros = $request->only(['idPeriodo', 'idMateria', 'idDocente']);

        $query = Asignacion::with([
            'periodo',
            'materia',
            'docente.usuario',
            'grupo',
            'asistencias'
        ]);

        // Aplicar filtros
        if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
            $query->where('idPeriodo', $filtros['idPeriodo']);
        }

        if (!empty($filtros['idMateria']) && $filtros['idMateria'] !== 'all') {
            $query->where('idMateria', $filtros['idMateria']);
        }

        if (!empty($filtros['idDocente']) && $filtros['idDocente'] !== 'all') {
            $query->where('idDocente', $filtros['idDocente']);
        }

        $resumen = $query->where('estado', 'activo')
                        ->get()
                        ->map(function ($asignacion) {
                            $totalAsistencias = $asignacion->asistencias->count();
                            $presentes = $asignacion->asistencias->where('estado', 'presente')->count();
                            $tardanzas = $asignacion->asistencias->where('estado', 'tardanza')->count();
                            $ausentes = $asignacion->asistencias->where('estado', 'ausente')->count();
                            $justificados = $asignacion->asistencias->where('estado', 'justificado')->count();

                            $porcentajeAsistencia = $totalAsistencias > 0 ? 
                                round((($presentes + $justificados) / $totalAsistencias) * 100, 2) : 0;

                            return [
                                'asignacion_id' => $asignacion->idAsignacion,
                                'periodo' => $asignacion->periodo->año . '-' . $asignacion->periodo->nroSemestre,
                                'materia' => $asignacion->materia->nombre,
                                'sigla' => $asignacion->materia->sigla,
                                'docente' => $asignacion->docente->usuario->name,
                                'grupo' => $asignacion->grupo->codigoGrupo,
                                'estadisticas' => [
                                    'total' => $totalAsistencias,
                                    'presentes' => $presentes,
                                    'tardanzas' => $tardanzas,
                                    'ausentes' => $ausentes,
                                    'justificados' => $justificados,
                                    'porcentaje_asistencia' => $porcentajeAsistencia
                                ]
                            ];
                        });

        $periodos = PeriodoAcademico::select('idPeriodo', 'nroSemestre', 'año', 'tipoPeriodo')
            ->orderBy('año', 'desc')
            ->orderBy('nroSemestre', 'desc')
            ->get()
            ->map(function ($periodo) {
                return [
                    'id' => $periodo->idPeriodo,
                    'nombre' => "{$periodo->año} - Semestre {$periodo->nroSemestre} ({$periodo->tipoPeriodo})"
                ];
            });

        $materias = Materia::select('idMateria', 'sigla', 'nombre', 'semestre')
            ->where('estado', 'activo')
            ->orderBy('semestre')
            ->orderBy('nombre')
            ->get()
            ->map(function ($materia) {
                return [
                    'id' => $materia->idMateria,
                    'nombre' => "{$materia->sigla} - {$materia->nombre} (Sem {$materia->semestre})"
                ];
            });

        $docentes = Docente::with('usuario:id,name')
            ->select('idDocente', 'idUsuario', 'codigoDocente')
            ->where('estado', 'activo')
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->idDocente,
                    'nombre' => "{$docente->codigoDocente} - {$docente->usuario->name}"
                ];
            });

        return Inertia::render('reportes/ResumenAsistencias', [
            'resumen' => $resumen,
            'periodos' => $periodos,
            'materias' => $materias,
            'docentes' => $docentes,
            'filters' => $filtros,
            'total' => $resumen->count()
        ]);
    }

    /**
     * Mostrar página de reporte de horarios por docente
     */
    public function horariosDocente(Request $request)
    {
        $filtros = $request->only(['idPeriodo', 'idDocente']);

        $query = HorarioAsignacion::with([
            'asignacion.periodo',
            'asignacion.materia',
            'asignacion.grupo',
            'bloque',
            'aula'
        ])->whereHas('asignacion', function($q) use ($filtros) {
            $q->where('estado', 'activo');
            
            if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
                $q->where('idPeriodo', $filtros['idPeriodo']);
            }
            
            if (!empty($filtros['idDocente']) && $filtros['idDocente'] !== 'all') {
                $q->where('idDocente', $filtros['idDocente']);
            }
        });

        $horarios = $query->get()
                         ->groupBy('asignacion.docente.usuario.name')
                         ->map(function ($horariosDocente, $nombreDocente) {
                             return [
                                 'docente' => $nombreDocente,
                                 'horarios' => $horariosDocente->map(function ($horario) {
                                     return [
                                         'dia' => $horario->bloque->nombreDia,
                                         'hora' => Carbon::parse($horario->bloque->horaInicio)->format('H:i') . ' - ' . 
                                                  Carbon::parse($horario->bloque->horaFin)->format('H:i'),
                                         'materia' => $horario->asignacion->materia->nombre,
                                         'grupo' => $horario->asignacion->grupo->codigoGrupo,
                                         'aula' => $horario->aula->codigoAula,
                                         'periodo' => $horario->asignacion->periodo->año . '-' . 
                                                     $horario->asignacion->periodo->nroSemestre
                                     ];
                                 })->sortBy('bloque.diaSemana')->values()
                             ];
                         })->values();

        $periodos = PeriodoAcademico::select('idPeriodo', 'nroSemestre', 'año', 'tipoPeriodo')
            ->orderBy('año', 'desc')
            ->orderBy('nroSemestre', 'desc')
            ->get()
            ->map(function ($periodo) {
                return [
                    'id' => $periodo->idPeriodo,
                    'nombre' => "{$periodo->año} - Semestre {$periodo->nroSemestre} ({$periodo->tipoPeriodo})"
                ];
            });

        $docentes = Docente::with('usuario:id,name')
            ->select('idDocente', 'idUsuario', 'codigoDocente')
            ->where('estado', 'activo')
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->idDocente,
                    'nombre' => "{$docente->codigoDocente} - {$docente->usuario->name}"
                ];
            });

        return Inertia::render('reportes/HorariosDocente', [
            'horarios' => $horarios,
            'periodos' => $periodos,
            'docentes' => $docentes,
            'filters' => $filtros
        ]);
    }

    /**
     * Reporte de utilización de aulas
     */
    public function utilizacionAulas(Request $request)
    {
        $filtros = $request->only(['idPeriodo', 'tipoAula', 'fechaInicio', 'fechaFin']);

        // Fechas por defecto (mes actual)
        $fechaInicio = $filtros['fechaInicio'] ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $fechaFin = $filtros['fechaFin'] ?? Carbon::now()->endOfMonth()->format('Y-m-d');

        // Consulta principal de aulas
        $query = Aula::withCount(['horariosAsignacion' => function($query) use ($fechaInicio, $fechaFin, $filtros) {
                $query->whereHas('asignacion', function($q) use ($filtros) {
                    $q->where('estado', 'activo');
                    
                    if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
                        $q->where('idPeriodo', $filtros['idPeriodo']);
                    }
                })
                ->whereHas('asistencias', function($q) use ($fechaInicio, $fechaFin) {
                    $q->whereBetween('fecha', [$fechaInicio, $fechaFin]);
                });
            }])
            ->with(['horariosAsignacion.asignacion.materia', 'horariosAsignacion.asignacion.docente.usuario']);

        // Filtro por tipo de aula
        if (!empty($filtros['tipoAula']) && $filtros['tipoAula'] !== 'all') {
            $query->where('tipo', $filtros['tipoAula']);
        }

        $aulas = $query->where('activo', true)
            ->orderBy('horarios_asignacion_count', 'desc')
            ->get()
            ->map(function ($aula) use ($fechaInicio, $fechaFin) {
                // Calcular horas utilizadas
                $horasUtilizadas = $this->calcularHorasUtilizadas($aula, $fechaInicio, $fechaFin);
                
                // Obtener materias que se imparten en esta aula
                $materias = $aula->horariosAsignacion
                    ->where('asignacion.estado', 'activo')
                    ->pluck('asignacion.materia')
                    ->unique('idMateria')
                    ->values();
                
                // Obtener docentes que usan esta aula
                $docentes = $aula->horariosAsignacion
                    ->where('asignacion.estado', 'activo')
                    ->pluck('asignacion.docente')
                    ->unique('idDocente')
                    ->values();

                return [
                    'id' => $aula->id,
                    'codigo' => $aula->codigoAula,
                    'nombre' => $aula->nombre,
                    'tipo' => $aula->tipo,
                    'capacidad' => $aula->capacidad,
                    'ubicacion' => $aula->ubicacion,
                    'horarios_count' => $aula->horarios_asignacion_count,
                    'horas_utilizadas' => $horasUtilizadas,
                    'materias' => $materias->map(function ($materia) {
                        return [
                            'nombre' => $materia->nombre,
                            'sigla' => $materia->sigla
                        ];
                    }),
                    'docentes' => $docentes->map(function ($docente) {
                        return [
                            'nombre' => $docente->usuario->name,
                            'codigo' => $docente->codigoDocente
                        ];
                    }),
                    'disponibilidad' => $this->calcularDisponibilidad($aula)
                ];
            });

        // Estadísticas generales
        $totalAulas = Aula::where('activo', true)->count();
        $aulasUtilizadas = $aulas->where('horarios_count', '>', 0)->count();
        $aulasNoUtilizadas = $totalAulas - $aulasUtilizadas;
        $porcentajeUtilizacion = $totalAulas > 0 ? round(($aulasUtilizadas / $totalAulas) * 100, 2) : 0;

        // Distribución por tipo de aula
        $distribucionTipos = Aula::where('activo', true)
            ->select('tipo', DB::raw('COUNT(*) as total'))
            ->groupBy('tipo')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->tipo => $item->total];
            });

        // Aulas más utilizadas (top 5)
        $aulasMasUtilizadas = $aulas->take(5)->values();

        // Aulas menos utilizadas
        $aulasMenosUtilizadas = Aula::where('activo', true)
            ->withCount(['horariosAsignacion' => function($query) use ($filtros) {
                $query->whereHas('asignacion', function($q) use ($filtros) {
                    $q->where('estado', 'activo');
                    
                    if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
                        $q->where('idPeriodo', $filtros['idPeriodo']);
                    }
                });
            }])
            ->having('horarios_asignacion_count', '=', 0)
            ->orderBy('codigoAula')
            ->get()
            ->map(function ($aula) {
                return [
                    'codigo' => $aula->codigoAula,
                    'nombre' => $aula->nombre,
                    'tipo' => $aula->tipo,
                    'capacidad' => $aula->capacidad
                ];
            });

        // Horarios por día de la semana
        $horariosPorDia = $this->obtenerHorariosPorDia($filtros);

        $periodos = PeriodoAcademico::select('idPeriodo', 'nroSemestre', 'año', 'tipoPeriodo')
            ->orderBy('año', 'desc')
            ->orderBy('nroSemestre', 'desc')
            ->get()
            ->map(function ($periodo) {
                return [
                    'id' => $periodo->idPeriodo,
                    'nombre' => "{$periodo->año} - Semestre {$periodo->nroSemestre} ({$periodo->tipoPeriodo})"
                ];
            });

        // Tipos de aula disponibles para filtro
        $tiposAula = Aula::where('activo', true)
            ->distinct()
            ->pluck('tipo')
            ->map(function ($tipo) {
                return [
                    'value' => $tipo,
                    'label' => ucfirst($tipo)
                ];
            });

        return Inertia::render('reportes/UtilizacionAulas', [
            'aulas' => $aulas,
            'estadisticas' => [
                'total_aulas' => $totalAulas,
                'aulas_utilizadas' => $aulasUtilizadas,
                'aulas_no_utilizadas' => $aulasNoUtilizadas,
                'porcentaje_utilizacion' => $porcentajeUtilizacion,
                'distribucion_tipos' => $distribucionTipos,
                'aulas_mas_utilizadas' => $aulasMasUtilizadas,
                'aulas_menos_utilizadas' => $aulasMenosUtilizadas,
                'horarios_por_dia' => $horariosPorDia
            ],
            'periodos' => $periodos,
            'tipos_aula' => $tiposAula,
            'filters' => array_merge($filtros, [
                'fechaInicio' => $fechaInicio,
                'fechaFin' => $fechaFin
            ]),
            'rango_fechas' => [
                'inicio' => Carbon::parse($fechaInicio)->format('d/m/Y'),
                'fin' => Carbon::parse($fechaFin)->format('d/m/Y')
            ]
        ]);
    }

    /**
     * Calcular horas utilizadas por aula
     */
    private function calcularHorasUtilizadas($aula, $fechaInicio, $fechaFin)
    {
        return HorarioAsignacion::where('idAula', $aula->id)
            ->whereHas('asignacion', function($q) {
                $q->where('estado', 'activo');
            })
            ->whereHas('asistencias', function($q) use ($fechaInicio, $fechaFin) {
                $q->whereBetween('fecha', [$fechaInicio, $fechaFin]);
            })
            ->with('bloque')
            ->get()
            ->sum(function ($horario) {
                $horaInicio = Carbon::parse($horario->bloque->horaInicio);
                $horaFin = Carbon::parse($horario->bloque->horaFin);
                return $horaInicio->diffInHours($horaFin);
            });
    }

    /**
     * Calcular disponibilidad del aula
     */
    private function calcularDisponibilidad($aula)
    {
        $diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        $disponibilidad = [];

        foreach ($diasSemana as $dia) {
            $horariosDia = $aula->horariosAsignacion
                ->where('bloque.nombreDia', $dia)
                ->where('asignacion.estado', 'activo')
                ->count();

            $disponibilidad[$dia] = $horariosDia > 0 ? 'Ocupada' : 'Disponible';
        }

        return $disponibilidad;
    }

    /**
     * Obtener horarios por día de la semana
     */
    private function obtenerHorariosPorDia($filtros)
    {
        $query = HorarioAsignacion::whereHas('asignacion', function($q) use ($filtros) {
            $q->where('estado', 'activo');
            
            if (!empty($filtros['idPeriodo']) && $filtros['idPeriodo'] !== 'all') {
                $q->where('idPeriodo', $filtros['idPeriodo']);
            }
        })
        ->with('bloque')
        ->select('idBloque', DB::raw('COUNT(*) as total'))
        ->groupBy('idBloque');

        $horarios = $query->get();

        $dias = [
            'Lunes' => 0,
            'Martes' => 0,
            'Miércoles' => 0,
            'Jueves' => 0,
            'Viernes' => 0,
            'Sábado' => 0
        ];

        foreach ($horarios as $horario) {
            $dia = $horario->bloque->nombreDia;
            if (isset($dias[$dia])) {
                $dias[$dia] += $horario->total;
            }
        }

        return $dias;
    }

    /**
     * Exportar reporte de utilización de aulas
     */
    public function exportarUtilizacionAulas(Request $request)
    {
        $filtros = $request->only(['idPeriodo', 'tipoAula', 'fechaInicio', 'fechaFin']);
        
        // Lógica similar al método utilizacionAulas pero para exportar
        // Puedes implementar exportación a PDF o Excel aquí
        
        return response()->json([
            'message' => 'Exportación implementada aquí'
        ]);
    }
}