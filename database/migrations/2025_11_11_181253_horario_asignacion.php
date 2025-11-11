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
        Schema::create('horarioAsignacion', function (Blueprint $table) {
            $table->id('idHorarioAsignacion');
            $table->foreignId('idAsignacion')->constrained('asignacion', 'idAsignacion')->onDelete('cascade');
            $table->foreignId('idBloque')->constrained('bloquesHorarios', 'idBloque')->onDelete('cascade');
            $table->foreignId('idAula')->constrained('aulas', 'id')->onDelete('cascade');
            $table->enum('estado', ['activo', 'cancelado', 'reprogramado'])->default('activo');
            $table->timestamps();

            // Un aula no puede tener dos horarios en el mismo bloque
            $table->unique(['idBloque', 'idAula']);
            
            // Una asignación no puede tener el mismo bloque repetido
            $table->unique(['idAsignacion', 'idBloque']);

            // Índices para búsquedas
            $table->index(['idAsignacion', 'estado']);
            $table->index(['idAula', 'idBloque']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarioAsignacion');
    }
};