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
        Schema::create('detalle_inventarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idAula')->constrained('aulas')->onDelete('cascade');
            $table->foreignId('idInventario')->constrained('inventarios')->onDelete('cascade');
            $table->integer('cantidad')->nullable(false)->check('cantidad > 0');
            $table->enum('estado', ['funcional', 'dañado', 'mantenimiento'])->default('funcional');
            $table->timestamps();
            
            // Evitar duplicados del mismo inventario en la misma aula
            $table->unique(['idAula', 'idInventario']);
            $table->index(['idAula', 'estado']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::dropIfExists('detalle_inventarios');
    }
};
