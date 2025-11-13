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

        $asignaciones = $query->get();
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

            // Debug: verificar datos recibidos
            Log::info('📥 Datos recibidos en store:', $request->all());
            Log::info('📊 Datos validados en store:', $data);
            Log::info('👥 Inscritos recibido:', ['inscritos' => $data['inscritos'] ?? 'No definido']);

            DB::transaction(function () use ($data) {
                $asignacion = Asignacion::create([
                    'idPeriodo' => $data['idPeriodo'],
                    'idMateria' => $data['idMateria'],
                    'idDocente' => $data['idDocente'],
                    'idGrupo' => $data['idGrupo'],
                    'modalidad' => $data['modalidad'] ?? 'presencial',
                    'estado' => 'activo',
                    'inscritos' => $data['inscritos'] ?? 0 // ✅ Asegurar que se guarde
                ]);

                // Debug: verificar asignación creada
                Log::info('✅ Asignación creada:', $asignacion->toArray());

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
                ->with('success', 'Asignación creada exitosamente');

        } catch (\Exception $e) {
            Log::error('❌ Error al crear asignación: ' . $e->getMessage());
            Log::error('🔍 Trace:', ['trace' => $e->getTraceAsString()]);
            
            return back()->with('error', 'Error al crear la asignación. Por favor, intente nuevamente.');
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
            'aulas' => Aula::where('activo', true)->get()
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

            // Debug: verificar datos recibidos
            Log::info('📥 Datos recibidos en update:', $request->all());
            Log::info('📊 Datos validados en update:', $data);
            Log::info('👥 Inscritos recibido:', ['inscritos' => $data['inscritos'] ?? 'No definido']);

            DB::transaction(function () use ($asignacion, $data) {
                // ✅ CORREGIDO: Incluir inscritos en la actualización
                $asignacion->update([
                    'idPeriodo' => $data['idPeriodo'],
                    'idMateria' => $data['idMateria'],
                    'idDocente' => $data['idDocente'],
                    'idGrupo' => $data['idGrupo'],
                    'modalidad' => $data['modalidad'] ?? $asignacion->modalidad,
                    'inscritos' => $data['inscritos'] ?? $asignacion->inscritos // ✅ AÑADIDO
                ]);

                // Debug: verificar asignación actualizada
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
}
