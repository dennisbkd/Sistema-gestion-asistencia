<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PeriodoAcademicoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('periodoAcademico')->insert([
            [
                'nombre' => 'Primer Semestre 2024',
                'gestion' => 2024,
                'semestre' => 1,
                'fechaInicio' => '2024-01-15',
                'fechaFin' => '2024-06-30',
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}