<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('docentes', function (Blueprint $table) {
            $table->id('idDocente');
            $table->foreignId('idUsuario')->constrained('users')->onDelete('cascade');
            $table->string('codigoDocente', 20)->unique();
            $table->string('telefono', 20)->nullable();
            $table->string('especialidad', 100)->nullable();
            $table->enum('estado', ['activo', 'inactivo', 'licencia'])->default('activo');
            $table->integer('maxHorasSemanales')->default(40);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('docentes');
    }
};