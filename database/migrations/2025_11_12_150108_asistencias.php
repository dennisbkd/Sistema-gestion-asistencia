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
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id('idAsistencia');
            $table->foreignId('idAsignacion')->constrained('asignacion', 'idAsignacion')->onDelete('cascade');
            $table->foreignId('idHorarioAsignacion')->constrained('horarioAsignacion', 'idHorarioAsignacion')->onDelete('cascade');
            $table->date('fecha')->nullable(false);
            $table->time('horaRegistro')->nullable();
            $table->time('horaClaseInicio')->nullable(false); // Hora programada de inicio
            $table->time('horaClaseFin')->nullable(false);   // Hora programada de fin
            $table->enum('estado', ['presente', 'ausente', 'tardanza', 'justificado'])->default('presente');
            $table->text('justificacion')->nullable();
            $table->integer('minutosRetraso')->default(0); // Minutos de retraso si es tardanza
            $table->string('token_qr', 100)->nullable()->unique(); // Token único para QR
            $table->timestamp('qr_generado_at')->nullable(); // Cuando se generó el QR
            $table->timestamp('qr_expiracion_at')->nullable(); // Cuando expira el QR
            $table->string('ip_registro', 45)->nullable(); // IP desde donde se registró
            $table->timestamps();

            // Un docente no puede tener dos asistencias para la misma clase
            $table->unique(['idHorarioAsignacion', 'fecha']);

            // Índices para mejor performance
            $table->index(['fecha', 'estado']);
            $table->index(['idAsignacion', 'fecha']);
            $table->index('token_qr');
            $table->index('qr_expiracion_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};