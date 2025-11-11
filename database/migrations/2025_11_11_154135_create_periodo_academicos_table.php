<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('periodo_academicos', function (Blueprint $table) {
            $table->id('idPeriodo');
            $table->integer('nroSemestre')->nullable();
            $table->integer('año')->nullable(); // Cambiado de gestion a año
            $table->date('fechaInicio');
            $table->date('fechaFin');
            $table->enum('estado', ['activo', 'finalizado', 'planificado'])->default('activo');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('periodo_academicos');
    }
};