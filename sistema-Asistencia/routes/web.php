<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('usuarios', [UserController::class, 'Index'])->name('usuarios.Index');
    Route::get('usuarios/create', [UserController::class, 'Create'])->name('usuarios.Create');
    Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store');
});

require __DIR__.'/settings.php';
