<?php

use App\Http\Controllers\PermisoController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

use App\Http\Controllers\MateriaController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\DocenteController;

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
     Route::get('usuarios', [UserController::class, 'Index'])->name('usuarios.Index')->middleware('permission:view usuarios|edit usuarios|create usuarios|asignar roles|delete usuarios');
    Route::get('usuarios/create', [UserController::class, 'create'])->name('usuarios.Create')->middleware('permission:create usuarios|asignar roles');
    Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store')->middleware('permission:create usuarios');
    Route::get('usuarios/editar/{user}',[UserController::class,'Edit'])->name('usuarios.Editar')->middleware('permission:edit usuarios');
    Route::put('usuarios/{user}',[UserController::class,'update'])->name('usuarios.Update')->middleware('permission:edit usuarios');
    Route::delete('usuarios/{user}',[UserController::class,'destroy'])->name('usuarios.Destroy')->middleware('permission:delete usuarios');
    //rutas de rol y permisos
    Route::get('rol', [RoleController::class, 'index'])->name('rol.Index')->middleware('permission:view roles|edit roles|create roles');
    Route::get('rol/edit/{role}', [RoleController::class, 'edit'])->name('rol.Editar')->middleware('permission:edit roles');
    Route::put('rol/{role}', [RoleController::class, 'update'])->name('rol.Update')->middleware('permission:edit roles');
    Route::get('rol/create', [RoleController::class, 'create'])->name('rol.Create')->middleware('permission:create roles');
    Route::post('rol', [RoleController::class, 'store'])->name('rol.Store')->middleware('permission:create roles');
    Route::delete('rol/{role}', [RoleController::class, 'destroy'])->name('rol.Destroy')->middleware('permission:delete roles');
    Route::post('rol/bulk-delete', [RoleController::class, 'bulkDelete'])->name('rol.BulkDestroy')->middleware('permission:delete roles');

    //rutas de permisos
     Route::get('permisos', [PermisoController::class, 'index'])->name('permisos.Index')->middleware('permission:view permisos|edit permisos|create permisos');
    Route::get('permisos/create', [PermisoController::class, 'create'])->name('permisos.Create')->middleware('permission:create permisos|view permisos|edit permisos');
    Route::post('permisos', [PermisoController::class, 'store'])->name('permisos.Store')->middleware('permission:create permisos');
    Route::get('permisos/edit/{permission}', [PermisoController::class, 'edit'])->name('permisos.Editar')->middleware('permission:edit permisos');
    Route::put('permisos/{permission}', [PermisoController::class, 'update'])->name('permisos.Update')->middleware('permission:edit permisos');
    Route::delete('permisos/{permission}', [PermisoController::class, 'destroy'])->name('permisos.Destroy')->middleware('permission:delete permisos');  
    
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
