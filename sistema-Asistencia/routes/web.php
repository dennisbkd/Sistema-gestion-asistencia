<?php

use App\Http\Controllers\UserController;
use App\Http\Middleware\CheckUserStatus;
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
    Route::get('usuarios/create', [UserController::class, 'Create'])->name('usuarios.Create');
    Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::get('usuarios/editar/{user}',[UserController::class,'Edit'])->name('usuarios.Editar');
    Route::put('usuarios/{user}',[UserController::class,'update'])->name('usuarios.Update');
    Route::delete('usuarios/{user}',[UserController::class,'destroy'])->name('usuarios.Destroy');
});

require __DIR__.'/settings.php';
