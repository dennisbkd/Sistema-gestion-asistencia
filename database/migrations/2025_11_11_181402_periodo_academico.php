<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('periodoAcademico', function (Blueprint $table) {
            $table->id('idPeriodo');
            $table->string('nombre', 50);
            $table->integer('gestion');
            $table->integer('semestre');
            $table->date('fechaInicio');
            $table->date('fechaFin');
            $table->enum('estado', ['activo', 'finalizado', 'planificado'])->default('activo');
            $table->timestamps();

            // No puede haber dos periodos con la misma gestión-semestre
            $table->unique(['gestion', 'semestre']);
            
            // Índices para búsquedas
            $table->index(['gestion', 'semestre']);
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periodoAcademico');
    }
};