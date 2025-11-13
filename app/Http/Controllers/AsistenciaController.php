<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Asignacion;
use App\Models\HorarioAsignacion;
use App\Models\Docente;
use App\Traits\RegistrarBitacora;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Container\Attributes\Log;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Support\Str;

class AsistenciaController extends Controller
{
    use RegistrarBitacora;
    /**
     * Display the attendance interface
     */

public function index()
{
    $userId = Auth::id();
    $docente = Docente::where('idUsuario', $userId)->first();

    if (!$docente) {
        return redirect()->route('dashboard')
            ->with('error', 'No se encontró información de docente.');
    }

    // Obtener clases del día actual
    $hoy = now();
    
    $clasesHoy = HorarioAsignacion::with(['asignacion.materia', 'asignacion.grupo', 'bloque', 'aula'])
        ->whereHas('asignacion', function($query) use ($docente) {
            $query->where('idDocente', $docente->idDocente)
                  ->where('estado', 'activo');
        })
        ->whereHas('bloque', function($query) use ($hoy) {
            $query->where('diaSemana', $hoy->dayOfWeekIso);
        })
        ->get()
        ->map(function($horario) use ($hoy) {
            // Verificar si ya tiene asistencia registrada
            $asistencia = Asistencia::where('idHorarioAsignacion', $horario->idHorarioAsignacion)
                ->whereDate('fecha', $hoy->toDateString())
                ->first();

            // Solo generar QR URL si existe token_qr y no es null
            $qr_url = null;
            if ($asistencia && $asistencia->token_qr) {
                $qr_url = route('asistencia.qr', $asistencia->token_qr);
            }

            return [
                'horario' => $horario,
                'asistencia' => $asistencia,
                'hora_inicio' => $horario->bloque->horaInicio,
                'hora_fin' => $horario->bloque->horaFin,
                'puede_registrar' => $this->puedeRegistrarAsistencia($horario->bloque->horaInicio, $horario->bloque->horaFin),
                'qr_url' => $qr_url,
            ];
        });

    return inertia('asistencia/Index', [
        'docente' => $docente,
        'clasesHoy' => $clasesHoy,
        'fechaActual' => $hoy->toDateString(),
    ]);
}

    /**
     * Generate QR for a class
     */
public function generarQR($horarioId)
{
    $userId = Auth::id();
    $docente = Docente::where('idUsuario', $userId)->first();

    if (!$docente) {
        return redirect()->route('dashboard')
            ->with('error', 'No se encontró información de docente.');
    }

    $horario = HorarioAsignacion::with(['asignacion', 'bloque'])
        ->where('idHorarioAsignacion', $horarioId)
        ->whereHas('asignacion', function($query) use ($docente) {
            $query->where('idDocente', $docente->idDocente);
        })
        ->firstOrFail();

    // Verificar que la clase es de hoy
    $hoy = now();
    if ($horario->bloque->diaSemana != $hoy->dayOfWeekIso) {
        return back()->with('error', 'Esta clase no corresponde al día de hoy');
    }

    FacadesLog::info("Buscando asistencia para horario: {$horarioId}, fecha: {$hoy->toDateString()}");
    
    // Buscar si ya existe una asistencia para este horario hoy
    $asistencia = Asistencia::where('idHorarioAsignacion', $horarioId)
        ->whereDate('fecha', $hoy->toDateString())
        ->first();

    if ($asistencia) {
        FacadesLog::info("Actualizando asistencia existente: " . $asistencia->idAsistencia);
        $asistencia->update([
            'token_qr' => Str::uuid()->toString(),
            'qr_generado_at' => now(),
            'qr_expiracion_at' => now()->addMinutes(15),
            'horaRegistro' => null,
            'estado' => 'presente',
            'minutosRetraso' => 0,
            'justificacion' => null,
        ]);
    } else {
        FacadesLog::info("Creando nueva asistencia para horario: {$horarioId}");
        $asistencia = Asistencia::create([
            'idAsignacion' => $horario->idAsignacion,
            'idHorarioAsignacion' => $horarioId,
            'fecha' => $hoy->toDateString(),
            'horaClaseInicio' => $horario->bloque->horaInicio,
            'horaClaseFin' => $horario->bloque->horaFin,
            'token_qr' => Str::uuid()->toString(),
            'qr_generado_at' => now(),
            'qr_expiracion_at' => now()->addMinutes(15),
            'estado' => 'presente',
        ]);
    }

    $qrContent = url("/asistencia/qr/{$asistencia->token_qr}");

    $qrData = [
        'qr_content' => $qrContent,
        'token' => $asistencia->token_qr,
        'qr_expira_en' => $asistencia->qr_expiracion_at->diffForHumans(),
        'asistencia_id' => $asistencia->idAsistencia,
        'horario_id' => $horarioId,
    ];

    // $this->registrarBitacora(
    // 'GENERAR_QR',
    // 'ASISTENCIA',
    // 'QR',
    // "QR generado para clase: {$asistencia->idAsistencia}",
    // null,
    // ['token' => $asistencia->token_qr, 'expira_en' => $asistencia->qr_expiracion_at],
    // $asistencia->idAsistencia
    // );

    // IMPORTANTE: En Inertia, usar with() para pasar datos flash
    return redirect()->route('asistencia.index')
        ->with('qr_data', $qrData)
        ->with('success', 'QR generado exitosamente');
}

    /**
     * QR Scanner endpoint
     */
public function escanearQR($token)
{
    try {
        $asistencia = Asistencia::with(['horarioAsignacion.asignacion.materia', 'horarioAsignacion.asignacion.grupo'])
            ->where('token_qr', $token)
            ->first();

        if (!$asistencia) {
            return inertia('asistencia/QrError', [
                'mensaje' => 'Código QR no válido o no encontrado'
            ]);
        }

        // Verificar si ya fue usado
        if ($asistencia->horaRegistro) {
            return inertia('asistencia/QrError', [
                'mensaje' => 'Este QR ya fue utilizado'
            ]);
        }

        // Verificar si expiró
        if ($asistencia->qr_expiracion_at && $asistencia->qr_expiracion_at->lt(now())) {
            return inertia('asistencia/QrError', [
                'mensaje' => 'Este QR ha expirado'
            ]);
        }

        // Registrar asistencia
        $horaRegistro = now();
        
        // Convertir horas a Carbon para cálculo preciso
        $horaClaseInicio = Carbon::parse($asistencia->horaClaseInicio);
        
        // Calcular minutos de retraso
        $minutosRetraso = Asistencia::calcularMinutosRetraso(
            $horaRegistro->toTimeString(),
            $asistencia->horaClaseInicio
        );
        
        // Determinar estado con tolerancia
        $estado = Asistencia::determinarEstado($minutosRetraso);
        
        FacadesLog::info("Registro de asistencia", [
            'hora_registro' => $horaRegistro->format('H:i:s'),
            'hora_clase_inicio' => $horaClaseInicio->format('H:i:s'),
            'minutos_retraso' => $minutosRetraso,
            'estado' => $estado
        ]);

        $asistencia->update([
            'horaRegistro' => $horaRegistro,
            'estado' => $estado,
            'minutosRetraso' => $minutosRetraso,
            'ip_registro' => request()->ip(),
            'token_qr' => null, // Invalidar QR después de uso
        ]);

        // Mensaje según el estado
        $mensaje = match($estado) {
            'presente' => $minutosRetraso > 0 ? 
                "Asistencia registrada con {$minutosRetraso} minutos de retraso (dentro de la tolerancia)" : 
                "Asistencia registrada puntualmente",
            'tardanza' => "Asistencia registrada con {$minutosRetraso} minutos de retraso",
            'ausente' => "Asistencia registrada con {$minutosRetraso} minutos de retraso (ausencia)",
            default => "Asistencia registrada"
        };

         $this->registrarBitacora(
                'ESCANEAR_QR',
                'ASISTENCIA',
                'REGISTRO',
                "Asistencia registrada: {$asistencia->idAsistencia} - Estado: {$estado}",
                ['estado_anterior' => 'pendiente', 'token' => $token],
                ['estado_nuevo' => $estado, 'minutos_retraso' => $minutosRetraso, 'hora_registro' => $horaRegistro],
                $asistencia->idAsistencia
            );

        return inertia('asistencia/QrSuccess', [
            'mensaje' => $mensaje,
            'estado' => $estado,
            'minutos_retraso' => $minutosRetraso,
            'clase' => $asistencia->horarioAsignacion->asignacion->materia->nombre,
            'grupo' => $asistencia->horarioAsignacion->asignacion->grupo->codigoGrupo,
            'hora_registro' => $horaRegistro->format('H:i:s'),
            'redirect_url' => route('asistencia.index')
        ]);

    } catch (\Exception $e) {
        FacadesLog::error('Error al escanear QR', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return inertia('asistencia/QrError', [
            'mensaje' => 'Error al procesar el código QR'
        ]);
    }
}
    /**
     * Justify absence
     */
public function justificarFalta(Request $request, $horarioId)
{
    $request->validate([
        'justificacion' => 'required|string|min:10|max:500',
        'fecha' => 'required|date',
    ]);

    $userId = Auth::id();
    $docente = Docente::where('idUsuario', $userId)->first();

    if (!$docente) {
        return redirect()->back()->with('error', 'Docente no encontrado.');
    }

    $horario = HorarioAsignacion::with(['asignacion', 'bloque'])
        ->where('idHorarioAsignacion', $horarioId)
        ->whereHas('asignacion', function($query) use ($docente) {
            $query->where('idDocente', $docente->idDocente);
        })
        ->firstOrFail();

    $fecha = Carbon::parse($request->fecha)->toDateString();
    $horaRegistro = now();

    // Calcular minutos de retraso usando el mismo método
    $minutosRetraso = Asistencia::calcularMinutosRetraso(
        $horaRegistro->toTimeString(),
        $horario->bloque->horaInicio
    );

    // Determinar el estado que hubiera tenido (solo para referencia)
    $estadoOriginal = Asistencia::determinarEstado($minutosRetraso);

    FacadesLog::info("Justificación de falta", [
        'horario_id' => $horarioId,
        'minutos_retraso' => $minutosRetraso,
        'estado_original' => $estadoOriginal,
        'estado_final' => 'justificado'
    ]);

    // Usar updateOrCreate
    $asistencia = Asistencia::updateOrCreate(
        [
            'idHorarioAsignacion' => $horarioId,
            'fecha' => $fecha,
        ],
        [
            'idAsignacion' => $horario->idAsignacion,
            'horaRegistro' => $horaRegistro,
            'horaClaseInicio' => $horario->bloque->horaInicio,
            'horaClaseFin' => $horario->bloque->horaFin,
            'estado' => 'justificado',
            'justificacion' => $request->justificacion,
            'minutosRetraso' => $minutosRetraso,
            'ip_registro' => request()->ip(),
            'token_qr' => null,
            'qr_generado_at' => null,
            'qr_expiracion_at' => null,
        ]
    );
    $this->registrarBitacora(
                'JUSTIFICAR_FALTA',
                'ASISTENCIA',
                'JUSTIFICACION',
                "Falta justificada: {$asistencia->idAsistencia}",
                ['estado_anterior' => $asistencia->estado ?? 'no_registrado'],
                ['estado_nuevo' => 'justificado', 'justificacion' => $request->justificacion],
                $asistencia->idAsistencia
            );

    return redirect()->route('asistencia.index')
        ->with('success', 'Falta justificada correctamente.');
}

    /**
     * Check if attendance can be registered for this time
     */
    private function puedeRegistrarAsistencia($horaInicio, $horaFin): bool
    {
        $ahora = now();
        $inicio = Carbon::parse($horaInicio);
        $fin = Carbon::parse($horaFin);

        // Permitir registro 15 minutos antes hasta 1 hora después
        return $ahora->between(
            $inicio->copy()->subMinutes(15),
            $fin->copy()->addHour()
        );
    }

    /**
     * Attendance history
     */
    public function historial()
    {
        $userId = Auth::id();
        $docente = Docente::where('idUsuario', $userId)->first();

        if (!$docente) {
            return redirect()->route('dashboard')
                ->with('error', 'No se encontró información de docente.');
        }

        $asistencias = Asistencia::with([
                'horarioAsignacion.bloque',
                'asignacion.materia',
                'asignacion.grupo'
            ])
            ->whereHas('asignacion', function($query) use ($docente) {
                $query->where('idDocente', $docente->idDocente);
            })
            ->orderBy('fecha', 'desc')
            ->orderBy('horaClaseInicio', 'desc')
            ->paginate(20);

        return inertia('asistencia/Historial', [
            'docente' => $docente,
            'asistencias' => $asistencias,
        ]);
    }
}