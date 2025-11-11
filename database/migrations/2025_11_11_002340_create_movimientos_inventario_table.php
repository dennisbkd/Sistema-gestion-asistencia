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
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idInventario')->constrained('inventarios')->onDelete('cascade');
            $table->enum('tipoMovimiento', ['entrada', 'salida', 'transferencia', 'mantenimiento']);
            $table->integer('cantidad')->check('cantidad > 0');
            $table->timestamp('fechaMovimiento')->useCurrent();
            $table->text('observacion')->nullable();
            $table->foreignId('realizadoPor')->constrained('users')->onDelete('cascade');
            $table->foreignId('idAulaOrigen')->nullable()->constrained('aulas')->onDelete('set null');
            $table->foreignId('idAulaDestino')->nullable()->constrained('aulas')->onDelete('set null');
            $table->timestamps();

            // Índices para mejor performance
            $table->index(['tipoMovimiento', 'fechaMovimiento']);
            $table->index('idInventario');
            $table->index('realizadoPor');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventarios');
    }
};
