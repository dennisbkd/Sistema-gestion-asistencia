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
        Schema::create('bloquesHorarios', function (Blueprint $table) {
            $table->id('idBloque');
            $table->integer('diaSemana');
            $table->time('horaInicio');
            $table->time('horaFin');
            $table->enum('turno', ['mañana', 'tarde', 'noche'])->nullable();
            $table->timestamps();

            // No puede haber bloques solapados en el mismo día
            $table->unique(['diaSemana', 'horaInicio', 'horaFin']);

            // Índices para búsquedas por día y turno
            $table->index(['diaSemana', 'turno']);
            $table->index(['horaInicio', 'horaFin']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bloquesHorarios');
    }
};