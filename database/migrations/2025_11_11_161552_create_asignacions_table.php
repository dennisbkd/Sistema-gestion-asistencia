<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('asignacions', function (Blueprint $table) {
            $table->id('idAsignacion');
            $table->foreignId('idPeriodo')->constrained('periodo_academicos', 'idPeriodo')->onDelete('cascade');
            $table->foreignId('idMateria')->constrained('materias', 'idMateria')->onDelete('cascade');
            $table->foreignId('idDocente')->constrained('docentes', 'idDocente')->onDelete('cascade');
            $table->foreignId('idGrupo')->constrained('grupos', 'idGrupo')->onDelete('cascade');
            $table->enum('modalidad', ['presencial', 'virtual', 'hibrida'])->default('presencial');
            $table->enum('estado', ['activo', 'finalizado', 'cancelado'])->default('activo');
            $table->integer('inscritos')->default(0);
            $table->timestamps();

            // Unique constraint para evitar duplicados
            $table->unique(['idPeriodo', 'idMateria', 'idGrupo']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('asignacions');
    }
};