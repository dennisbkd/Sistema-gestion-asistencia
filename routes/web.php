<?php

use App\Http\Controllers\AulaController;
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

    //rutas de aula
    Route::get('aula', [AulaController::class, 'index'])->name('aula.Index')->middleware('permission:view aulas|edit aulas|create aulas');
    Route::get('aula/create', [AulaController::class, 'create'])->name('aula.Create')->middleware('permission:create aulas');
    Route::post('aula', [AulaController::class, 'store'])->name('aula.Store')->middleware('permission:create aulas');
    Route::get('aula/{classroom}', [AulaController::class, 'show'])->name('aula.Show')->middleware('permission:view aulas|edit aulas|show aulas');
    Route::get('aula/edit/{classroom}', [AulaController::class, 'edit'])->name('aula.Edit')->middleware('permission:edit aulas');
    Route::put('aula/{classroom}', [AulaController::class, 'update'])->name('aula.Update')->middleware('permission:edit aulas');
    Route::delete('aula/{classroom}', [AulaController::class, 'destroy'])->name('aula.Destroy');

});

require __DIR__.'/settings.php';
