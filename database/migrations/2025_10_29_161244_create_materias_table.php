<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('materias', function (Blueprint $table) {
            $table->id('idMateria');
            $table->string('sigla', 20)->unique();
            $table->string('nombre', 100);
            $table->integer('semestre');
            $table->integer('horasSemanales');
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('materias');
    }
};