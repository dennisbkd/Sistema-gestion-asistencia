<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bitacora', function (Blueprint $table) {
            $table->id('id');
            $table->foreignId('idUsuario')->nullable()->constrained('users')->onDelete('set null');
            $table->string('accion', 100)->nullable(false); // CREATE, UPDATE, DELETE, LOGIN, etc.
            $table->string('modulo', 50)->nullable(false); // ASISTENCIA, USUARIO, DOCENTE, etc.
            $table->string('submodulo', 50)->nullable(); // QR, JUSTIFICACION, HISTORIAL, etc.
            $table->text('descripcion')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('metodo_http', 10)->nullable(); // GET, POST, PUT, DELETE
            $table->string('ruta')->nullable(); // /asistencia/generar-qr/1
            $table->json('datos_antes')->nullable();
            $table->json('datos_despues')->nullable();
            $table->json('parametros')->nullable(); // Datos enviados en la request
            $table->string('referencia_id')->nullable(); // ID del registro afectado (ej: idAsistencia)
            $table->string('estado', 20)->default('exitoso'); // exitoso, fallido
            $table->text('error')->nullable(); // Mensaje de error si falló
            $table->timestamps();

            // Índices para mejor performance
            $table->index(['modulo', 'submodulo']);
            $table->index(['accion', 'created_at']);
            $table->index('idUsuario');
            $table->index('referencia_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bitacora');
    }
};