<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AsignacionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('asignacion')->insert([
            // Docente Test (usuario 4) - Varias materias
            [
                'idPeriodo' => 1,
                'idMateria' => 1, // Matemáticas I
                'idDocente' => 1, // Docente Test
                'idGrupo' => 1,
                'modalidad' => 'presencial',
                'estado' => 'activo',
                'inscritos' => 35,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idPeriodo' => 1,
                'idMateria' => 3, // Programación I
                'idDocente' => 1, // Docente Test
                'idGrupo' => 2,
                'modalidad' => 'presencial',
                'estado' => 'activo',
                'inscritos' => 28,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idPeriodo' => 1,
                'idMateria' => 4, // Bases de Datos
                'idDocente' => 1, // Docente Test
                'idGrupo' => 1,
                'modalidad' => 'hibrida',
                'estado' => 'activo',
                'inscritos' => 32,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'idPeriodo' => 1,
                'idMateria' => 5, // Desarrollo Web
                'idDocente' => 1, // Docente Test
                'idGrupo' => 3,
                'modalidad' => 'presencial',
                'estado' => 'activo',
                'inscritos' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Otros docentes
            [
                'idPeriodo' => 1,
                'idMateria' => 2, // Física General
                'idDocente' => 3, // Dra. Ana García
                'idGrupo' => 1,
                'modalidad' => 'presencial',
                'estado' => 'activo',
                'inscritos' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}