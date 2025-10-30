<?php

use App\Http\Controllers\AulaController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\PermisoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;

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

Route::middleware(['auth', 'verified', 'user.active'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
     Route::get('usuarios', [UserController::class, 'Index'])->name('usuarios.Index');
    Route::get('usuarios/create', [UserController::class, 'create'])->name('usuarios.Create');
    Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::get('usuarios/editar/{user}',[UserController::class,'Edit'])->name('usuarios.Editar');
    Route::put('usuarios/{user}',[UserController::class,'update'])->name('usuarios.Update');
    Route::delete('usuarios/{user}',[UserController::class,'destroy'])->name('usuarios.Destroy');
    //rutas de rol y permisos
    Route::get('rol', [RoleController::class, 'index'])->name('rol.Index');
    Route::get('rol/edit/{role}', [RoleController::class, 'edit'])->name('rol.Editar');
    Route::put('rol/{role}', [RoleController::class, 'update'])->name('rol.Update');
    Route::get('rol/create', [RoleController::class, 'create'])->name('rol.Create');
    Route::post('rol', [RoleController::class, 'store'])->name('rol.Store');
    Route::delete('rol/{role}', [RoleController::class, 'destroy'])->name('rol.Destroy');
    Route::post('rol/bulk-delete', [RoleController::class, 'bulkDelete'])->name('rol.BulkDestroy');

    //rutas de permisos
     Route::get('permisos', [PermisoController::class, 'index'])->name('permisos.Index');
    Route::get('permisos/create', [PermisoController::class, 'create'])->name('permisos.Create');
    Route::post('permisos', [PermisoController::class, 'store'])->name('permisos.Store');
    Route::get('permisos/edit/{permission}', [PermisoController::class, 'edit'])->name('permisos.Editar');
    Route::put('permisos/{permission}', [PermisoController::class, 'update'])->name('permisos.Update');
    Route::delete('permisos/{permission}', [PermisoController::class, 'destroy'])->name('permisos.Destroy');

    //rutas de aula
    Route::get('aula', [AulaController::class, 'index'])->name('aula.Index')->middleware('permission:view aulas|edit aulas|create aulas');
    Route::get('aula/create', [AulaController::class, 'create'])->name('aula.Create')->middleware('permission:create aulas');
    Route::post('aula', [AulaController::class, 'store'])->name('aula.Store')->middleware('permission:create aulas');
    Route::get('aula/{classroom}', [AulaController::class, 'show'])->name('aula.Show')->middleware('permission:view aulas|edit aulas|show aulas');
    Route::get('aula/edit/{classroom}', [AulaController::class, 'edit'])->name('aula.Edit')->middleware('permission:edit aulas');
    Route::put('aula/{classroom}', [AulaController::class, 'update'])->name('aula.Update')->middleware('permission:edit aulas');
    Route::delete('aula/{classroom}', [AulaController::class, 'destroy'])->name('aula.Destroy');

        //rutas de materias
    Route::get('/materias', [MateriaController::class, 'index'])->name('materias.index');
    Route::get('/materias/create', [MateriaController::class, 'create'])->name('materias.create');
    Route::post('/materias', [MateriaController::class, 'store'])->name('materias.store');
    Route::get('/materias/{materia}/edit', [MateriaController::class, 'edit'])->name('materias.edit');
    Route::put('/materias/{materia}', [MateriaController::class, 'update'])->name('materias.update');
    Route::patch('/materias/{materia}/change-status', [MateriaController::class, 'changeStatus'])->name('materias.change-status');

    // Rutas de grupos
    Route::get('/grupos', [GrupoController::class, 'index'])->name('grupos.index');
    Route::get('/grupos/create', [GrupoController::class, 'create'])->name('grupos.create');
    Route::post('/grupos', [GrupoController::class, 'store'])->name('grupos.store');
    Route::get('/grupos/{grupo}/edit', [GrupoController::class, 'edit'])->name('grupos.edit');
    Route::put('/grupos/{grupo}', [GrupoController::class, 'update'])->name('grupos.update');
    Route::patch('/grupos/{grupo}/change-status', [GrupoController::class, 'changeStatus'])->name('grupos.change-status');

    // Rutas de docentes
    Route::get('/docentes', [DocenteController::class, 'index'])->name('docentes.index');
    Route::get('/docentes/create', [DocenteController::class, 'create'])->name('docentes.create');
    Route::post('/docentes', [DocenteController::class, 'store'])->name('docentes.store');
    Route::get('/docentes/{docente}/edit', [DocenteController::class, 'edit'])->name('docentes.edit');
    Route::put('/docentes/{docente}', [DocenteController::class, 'update'])->name('docentes.update');
    Route::patch('/docentes/{docente}/change-status', [DocenteController::class, 'changeStatus'])->name('docentes.change-status');

});

require __DIR__.'/settings.php';
