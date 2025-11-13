<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->nullable(); // ID de sesión de Laravel
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device_type')->nullable(); // desktop, mobile, tablet
            $table->string('browser')->nullable();
            $table->string('platform')->nullable();
            $table->timestamp('login_at')->useCurrent();
            $table->timestamp('last_activity_at')->useCurrent();
            $table->timestamp('logout_at')->nullable();
            $table->enum('status', ['online', 'offline', 'idle'])->default('online');
            $table->integer('active_minutes')->default(0);
            
            $table->timestamps();

            // Índices para mejor performance
            $table->index(['user_id', 'status']);
            $table->index(['status', 'last_activity_at']);
            $table->index('session_id');
            $table->index('login_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_connections');
    }
};