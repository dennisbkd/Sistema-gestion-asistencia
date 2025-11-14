<?php

use App\Http\Controllers\AsignacionInventarioController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\AulaController;
use App\Http\Controllers\BitacoraController;
use App\Http\Controllers\DetalleInventarioController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\HorarioDocenteController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\MovimientoInventarioController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PeriodoAcademicoController;
use App\Http\Controllers\BloqueHorarioController;
use App\Http\Controllers\AsignacionController;
use App\Http\Controllers\ReporteController; 

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');



Route::get('/NoAutorizado', function () {
    return Inertia::render('usuarios/NoAutorizado'); // ← Con carpeta usuarios/
})->name('NoAutorizado');

Route::middleware(['auth', 'verified', 'user.active', 'track.activity'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
     Route::get('usuarios', [UserController::class, 'Index'])->name('usuarios.Index')->middleware('permission:view usuarios|edit usuarios|create usuarios');
     Route::patch('/usuarios/{user}/toggle-status', [UserController::class, 'toggleStatus'])
    ->name('usuarios.toggle-status');
    Route::get('usuarios/create', [UserController::class, 'create'])->name('usuarios.Create');
    Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::get('usuarios/editar/{user}',[UserController::class,'Edit'])->name('usuarios.Editar');
    Route::put('usuarios/{user}',[UserController::class,'update'])->name('usuarios.Update');
    Route::delete('usuarios/{user}',[UserController::class,'destroy'])->name('usuarios.Destroy');
    //rutas de rol y permisos
    Route::get('rol', [RoleController::class, 'index'])->name('rol.Index')->middleware('permission:view roles|edit roles|create roles');
    Route::get('rol/edit/{role}', [RoleController::class, 'edit'])->name('rol.Editar');
    Route::put('rol/{role}', [RoleController::class, 'update'])->name('rol.Update');
    Route::get('rol/create', [RoleController::class, 'create'])->name('rol.Create');
    Route::post('rol', [RoleController::class, 'store'])->name('rol.Store');
    Route::delete('rol/{role}', [RoleController::class, 'destroy'])->name('rol.Destroy');
    Route::post('rol/bulk-delete', [RoleController::class, 'bulkDelete'])->name('rol.BulkDestroy');

    //rutas de permisos
     Route::get('permisos', [PermisoController::class, 'index'])->name('permisos.Index')->middleware('permission:view permisos|edit permisos|create permisos');
    Route::get('permisos/create', [PermisoController::class, 'create'])->name('permisos.Create')->middleware('permission:create permisos');
    Route::post('permisos', [PermisoController::class, 'store'])->name('permisos.Store')->middleware('permission:create permisos');
    Route::get('permisos/edit/{permission}', [PermisoController::class, 'edit'])->name('permisos.Editar')->middleware('permission:edit permisos');
    Route::put('permisos/{permission}', [PermisoController::class, 'update'])->name('permisos.Update')->middleware('permission:edit permisos');
    Route::delete('permisos/{permission}', [PermisoController::class, 'destroy'])->name('permisos.Destroy')->middleware('permission:delete permisos');

    //rutas de aula
    Route::get('aula', [AulaController::class, 'index'])->name('aula.Index')->middleware('permission:view aulas|edit aulas|create aulas');
    Route::get('aula/create', [AulaController::class, 'create'])->name('aula.Create')->middleware('permission:create aulas');
    Route::post('aula', [AulaController::class, 'store'])->name('aula.Store')->middleware('permission:create aulas');
    Route::get('aula/{classroom}', [AulaController::class, 'show'])->name('aula.Show')->middleware('permission:view aulas|edit aulas|show aulas');
    Route::get('aula/edit/{classroom}', [AulaController::class, 'edit'])->name('aula.Edit')->middleware('permission:edit aulas');
    Route::put('aula/{classroom}', [AulaController::class, 'update'])->name('aula.Update')->middleware('permission:edit aulas');
    Route::delete('aula/{classroom}', [AulaController::class, 'destroy'])->name('aula.Destroy');

        //rutas de materias
    Route::get('/materias', [MateriaController::class, 'index'])->name('materias.index')->middleware('permission:view materias|edit materias|create materias');
    Route::get('/materias/create', [MateriaController::class, 'create'])->name('materias.create')->middleware('permission:create materias');
    Route::post('/materias', [MateriaController::class, 'store'])->name('materias.store')->middleware('permission:create materias');
    Route::get('/materias/{materia}/edit', [MateriaController::class, 'edit'])->name('materias.edit')->middleware('permission:edit materias');
    Route::put('/materias/{materia}', [MateriaController::class, 'update'])->name('materias.update')->middleware('permission:edit materias');
    Route::patch('/materias/{materia}/change-status', [MateriaController::class, 'changeStatus'])->name('materias.change-status')->middleware('permission:edit materias');

    // Rutas de grupos
    Route::get('/grupos', [GrupoController::class, 'index'])->name('grupos.index')->middleware('permission:view grupos|edit grupos|create grupos');
    Route::get('/grupos/create', [GrupoController::class, 'create'])->name('grupos.create')->middleware('permission:create grupos');
    Route::post('/grupos', [GrupoController::class, 'store'])->name('grupos.store')->middleware('permission:create grupos');
    Route::get('/grupos/{grupo}/edit', [GrupoController::class, 'edit'])->name('grupos.edit')->middleware('permission:edit grupos');
    Route::put('/grupos/{grupo}', [GrupoController::class, 'update'])->name('grupos.update')->middleware('permission:edit grupos');
    Route::patch('/grupos/{grupo}/change-status', [GrupoController::class, 'changeStatus'])->name('grupos.change-status')->middleware('permission:edit grupos');

    // Rutas de docentes
 Route::get('/docentes', [DocenteController::class, 'index'])->name('docentes.index')->middleware('permission:view docentes|edit docentes|create docentes');
    Route::get('/docentes/create', [DocenteController::class, 'create'])->name('docentes.create')->middleware('permission:create docentes');
    Route::post('/docentes', [DocenteController::class, 'store'])->name('docentes.store')->middleware('permission:create docentes');
    Route::get('/docentes/{docente}/edit', [DocenteController::class, 'edit'])->name('docentes.edit')->middleware('permission:edit docentes');
    Route::put('/docentes/{docente}', [DocenteController::class, 'update'])->name('docentes.update')->middleware('permission:edit docentes');
    Route::delete('/docentes/{docente}', [DocenteController::class, 'destroy'])->name('docentes.destroy')->middleware('permission:delete docentes');
    Route::patch('/docentes/{docente}/status', [DocenteController::class, 'changeStatus'])->name('docentes.changeStatus');
    
    // Rutas adicionales
    Route::get('/docentes/estadisticas', [DocenteController::class, 'estadisticas'])->name('docentes.estadisticas');
    Route::get('/docentes/buscar', [DocenteController::class, 'buscar'])->name('docentes.buscar');
    Route::get('/docentes/{docente}', [DocenteController::class, 'show'])->name('docentes.show');

        // // Rutas adicionales
    Route::get('/inventario/movimientos', [MovimientoInventarioController::class, 'index'])->name('inventario.movimientos.index')->middleware('permission:view movimientos');
    Route::get('/inventario/movimientos/registrar', [MovimientoInventarioController::class, 'create'])->name('inventario.movimientos.create');
    Route::post('/inventario/movimientos', [MovimientoInventarioController::class, 'store'])->name('inventario.movimientos.store');

    // Rutas de inventario
    Route::get('/inventario', [InventarioController::class, 'index'])->name('inventario.index')->middleware('permission:view inventario|edit inventario|create inventario');
    Route::get('/inventario/create', [InventarioController::class, 'create'])->name('inventario.create');
    Route::post('/inventario', [InventarioController::class, 'store'])->name('inventario.store');
    Route::get('/inventario/{inventario}/edit', [InventarioController::class, 'edit'])->name('inventario.edit');
    Route::put('/inventario/{inventario}', [InventarioController::class, 'update'])->name('inventario.update');

    Route::get('/inventario/{inventario}/asignar', [AsignacionInventarioController::class, 'create'])->name('inventario.asignar');
    Route::post('/inventario/{inventario}/asignar', [AsignacionInventarioController::class, 'store'])->name('inventario.asignar.store');
    Route::get('/inventario/{inventario}/transferir', [AsignacionInventarioController::class, 'createTransferencia'])->name('inventario.transferir.create');
    Route::post('/inventario/{inventario}/transferir', [AsignacionInventarioController::class, 'transferir'])->name('inventario.transferir.store');

    Route::get('/inventario/{inventario}/detalle', [DetalleInventarioController::class, 'show'])->name('inventario.detalle.show');

    // Rutas Periodo Académico
    Route::get('/periodos-academicos', [PeriodoAcademicoController::class, 'index'])->name('periodos-academicos.index')->middleware('permission:view periodos|edit periodos|create periodos');
    Route::get('/periodos-academicos/create', [PeriodoAcademicoController::class, 'create'])->name('periodos-academicos.create');
    Route::post('/periodos-academicos', [PeriodoAcademicoController::class, 'store'])->name('periodos-academicos.store');
    Route::get('/periodos-academicos/{periodosAcademico}/edit', [PeriodoAcademicoController::class, 'edit'])->name('periodos-academicos.edit');
    Route::put('/periodos-academicos/{periodosAcademico}', [PeriodoAcademicoController::class, 'update'])->name('periodos-academicos.update');
    Route::patch('/periodos-academicos/{periodosAcademico}/change-status', [PeriodoAcademicoController::class, 'changeStatus'])->name('periodos-academicos.change-status');
    // Rutas Periodo Academico para filtros
    Route::get('/periodos-academicos/{periodosAcademico}/materias', [PeriodoAcademicoController::class, 'materias'])->name('periodos-academicos.materias');
    Route::get('/periodos-academicos/{periodosAcademico}/docentes', [PeriodoAcademicoController::class, 'docentes'])->name('periodos-academicos.docentes');
    Route::get('/periodos-academicos/{periodosAcademico}/grupos', [PeriodoAcademicoController::class, 'grupos'])->name('periodos-academicos.grupos');
    Route::get('/periodos-academicos/{periodosAcademico}/detalle', [PeriodoAcademicoController::class, 'detalle'])->name('periodos-academicos.detalle');
    // //rutas de horario docente
    Route::get('/horario', [HorarioDocenteController::class, 'index'])->name('horario.index')->middleware('permission:view docentes|edit docentes|create docentes');
    Route::get('/horario/semanal', [HorarioDocenteController::class, 'horarioSemanal'])->name('horario.semanal');
    Route::get('/horario/materia/{materia}', [HorarioDocenteController::class, 'showMateria'])->name('horario.materia');


    Route::get('/asistencia', [AsistenciaController::class, 'index'])->name('asistencia.index')->middleware('permission:view docentes|edit docentes|create docentes');
    Route::get('/historial', [AsistenciaController::class, 'historial'])->name('asistencia.historial');
    Route::post('/asistencia/generar-qr/{horario}', [AsistenciaController::class, 'generarQR'])->name('asistencia.generar-qr');
    Route::post('/asistencia/justificar/{horario}', [AsistenciaController::class, 'justificarFalta'])->name('asistencia.justificar');
    Route::get('/asistencia/qr/{token}', [AsistenciaController::class, 'escanearQR'])
    ->name('asistencia.qr');
    Route::post('/api/asistencia/generar-qr/{horario}', [AsistenciaController::class, 'generarQRApi'])->name('api.asistencia.generar-qr');

    //ruta bitacora
     Route::get('/bitacora', [BitacoraController::class, 'index'])->name('bitacora.index');
    Route::get('/bitacora/exportar', [BitacoraController::class, 'exportar'])->name('bitacora.exportar');

    // Rutas horarios
    Route::get('bloques-horarios', [BloqueHorarioController::class, 'index'])->name('bloques-horarios.index')->middleware('permission:view bloques|edit bloques|create bloques');
    Route::get('bloques-horarios/create', [BloqueHorarioController::class, 'create'])->name('bloques-horarios.create');
    Route::post('bloques-horarios', [BloqueHorarioController::class, 'store'])->name('bloques-horarios.store');
    Route::get('bloques-horarios/{bloquesHorario}', [BloqueHorarioController::class, 'show'])->name('bloques-horarios.show');
    Route::get('bloques-horarios/{bloquesHorario}/edit', [BloqueHorarioController::class, 'edit'])->name('bloques-horarios.edit');
    Route::put('bloques-horarios/{bloquesHorario}', [BloqueHorarioController::class, 'update'])->name('bloques-horarios.update');
    Route::delete('bloques-horarios/{bloquesHorario}', [BloqueHorarioController::class, 'destroy'])->name('bloques-horarios.destroy');
    Route::get('bloques-horarios/{bloquesHorario}/detalle', [BloqueHorarioController::class, 'detalle'])->name('bloques-horarios.detalle');
    Route::get('bloques-horarios/{bloquesHorario}/materias', [BloqueHorarioController::class, 'materias'])->name('bloques-horarios.materias');
    Route::get('bloques-horarios/{bloquesHorario}/docentes', [BloqueHorarioController::class, 'docentes'])->name('bloques-horarios.docentes');
    Route::get('bloques-horarios/{bloquesHorario}/grupos', [BloqueHorarioController::class, 'grupos'])->name('bloques-horarios.grupos');
    Route::get('bloques-horarios/{bloquesHorario}/aulas', [BloqueHorarioController::class, 'aulas'])->name('bloques-horarios.aulas');

    // Rutas de Asignaciones
    Route::get('/asignaciones', [AsignacionController::class, 'index'])->name('asignaciones.index')->middleware('permission:view asignaciones');
    Route::get('/asignaciones/create', [AsignacionController::class, 'create'])->name('asignaciones.create');
    Route::post('/asignaciones', [AsignacionController::class, 'store'])->name('asignaciones.store');
    Route::get('/asignaciones/{asignacion}/edit', [AsignacionController::class, 'edit'])->name('asignaciones.edit');
    Route::put('/asignaciones/{asignacion}', [AsignacionController::class, 'update'])->name('asignaciones.update');
    Route::patch('/asignaciones/{asignacion}/change-status', [AsignacionController::class, 'changeStatus'])->name('asignaciones.change-status');
    Route::get('/asignaciones/{asignacion}', [AsignacionController::class, 'show'])->name('asignaciones.show');
    Route::get('/asignaciones/{asignacion}/detalle', [AsignacionController::class, 'show'])->name('asignaciones.detalle');

    // Rutas para reportes
    Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/dashboard', [ReporteController::class, 'dashboard'])->name('reportes.dashboard');
    Route::get('/reportes/asistencias', [ReporteController::class, 'asistencias'])->name('reportes.asistencias');
    Route::get('/reportes/asignaciones', [ReporteController::class, 'asignaciones'])->name('reportes.asignaciones');
    Route::get('/reportes/resumen-asistencias', [ReporteController::class, 'resumenAsistencias'])->name('reportes.resumen-asistencias');
    Route::get('/reportes/horarios-docente', [ReporteController::class, 'horariosDocente'])->name('reportes.horarios-docente');
    // routes/web.php
    Route::get('/reportes/utilizacion-aulas', [ReporteController::class, 'utilizacionAulas'])->name('reportes.utilizacion-aulas');
    Route::post('/reportes/exportar-utilizacion-aulas', [ReporteController::class, 'exportarUtilizacionAulas'])->name('reportes.exportar-utilizacion-aulas');

});

require __DIR__.'/settings.php';
