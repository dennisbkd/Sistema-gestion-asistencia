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
        Schema::create('inventarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100)->nullable(false);
            $table->string('modelo', 50)->nullable();
            $table->string('marca', 50)->nullable();
            $table->integer('stockTotal')->default(0)->check('stockTotal >= 0');
            $table->boolean('activo')->default(true);
            $table->foreignId('registradoPor')->constrained('users')->onDelete('cascade');
            $table->enum('estado', ['disponible', 'agotado', 'mantenimiento'])->default('disponible');
            $table->timestamps();
            
            $table->index(['activo', 'estado']);
            $table->index('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventarios');
    }
};
