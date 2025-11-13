<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HorarioAsignacionSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener algunos bloques horarios (asumiendo que ya existen)
        $bloques = DB::table('bloquesHorarios')->get();

        DB::table('horarioAsignacion')->insert([
            // Matemáticas I - Lunes y Miércoles
            [
                'idAsignacion' => 1, // Matemáticas I - G1
                'idBloque' => 1, // Lunes 07:00-08:30
                'idAula' => 1, // A101
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idAsignacion' => 1, // Matemáticas I - G1
                'idBloque' => 9, // Miércoles 07:00-08:30
                'idAula' => 1, // A101
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idAsignacion' => 1, // Matemáticas I - G1
                'idBloque' => 3, // Lunes 10:00-11:30
                'idAula' => 1, // A101
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Programación I - Martes y Jueves (Laboratorio)
            [
                'idAsignacion' => 2, // Programación I - G2
                'idBloque' => 5, // Martes 07:00-08:30
                'idAula' => 3, // LAB1
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idAsignacion' => 2, // Programación I - G2
                'idBloque' => 13, // Jueves 07:00-08:30
                'idAula' => 3, // LAB1
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idAsignacion' => 2, // Programación I - G2
                'idBloque' => 7, // Martes 11:30-13:00
                'idAula' => 3, // LAB1
                'estado' => 'activo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}