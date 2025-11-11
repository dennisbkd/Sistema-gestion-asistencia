<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BloquesHorariosSeeder extends Seeder
{
    public function run(): void
    {
        $bloques = [
            // Turno Mañana
            ['diaSemana' => 1, 'horaInicio' => '07:00', 'horaFin' => '08:30', 'turno' => 'mañana'],
            ['diaSemana' => 1, 'horaInicio' => '08:30', 'horaFin' => '10:00', 'turno' => 'mañana'],
            ['diaSemana' => 1, 'horaInicio' => '10:00', 'horaFin' => '11:30', 'turno' => 'mañana'],
            ['diaSemana' => 1, 'horaInicio' => '11:30', 'horaFin' => '13:00', 'turno' => 'mañana'],

            ['diaSemana' => 2, 'horaInicio' => '07:00', 'horaFin' => '08:30', 'turno' => 'mañana'],
            ['diaSemana' => 2, 'horaInicio' => '08:30', 'horaFin' => '10:00', 'turno' => 'mañana'],
            ['diaSemana' => 2, 'horaInicio' => '10:00', 'horaFin' => '11:30', 'turno' => 'mañana'],
            ['diaSemana' => 2, 'horaInicio' => '11:30', 'horaFin' => '13:00', 'turno' => 'mañana'],

            ['diaSemana' => 3, 'horaInicio' => '07:00', 'horaFin' => '08:30', 'turno' => 'mañana'],
            ['diaSemana' => 3, 'horaInicio' => '08:30', 'horaFin' => '10:00', 'turno' => 'mañana'],
            ['diaSemana' => 3, 'horaInicio' => '10:00', 'horaFin' => '11:30', 'turno' => 'mañana'],
            ['diaSemana' => 3, 'horaInicio' => '11:30', 'horaFin' => '13:00', 'turno' => 'mañana'],

            ['diaSemana' => 4, 'horaInicio' => '07:00', 'horaFin' => '08:30', 'turno' => 'mañana'],
            ['diaSemana' => 4, 'horaInicio' => '08:30', 'horaFin' => '10:00', 'turno' => 'mañana'],
            ['diaSemana' => 4, 'horaInicio' => '10:00', 'horaFin' => '11:30', 'turno' => 'mañana'],
            ['diaSemana' => 4, 'horaInicio' => '11:30', 'horaFin' => '13:00', 'turno' => 'mañana'],

            ['diaSemana' => 5, 'horaInicio' => '07:00', 'horaFin' => '08:30', 'turno' => 'mañana'],
            ['diaSemana' => 5, 'horaInicio' => '08:30', 'horaFin' => '10:00', 'turno' => 'mañana'],
            ['diaSemana' => 5, 'horaInicio' => '10:00', 'horaFin' => '11:30', 'turno' => 'mañana'],
            ['diaSemana' => 5, 'horaInicio' => '11:30', 'horaFin' => '13:00', 'turno' => 'mañana'],

            // Turno Tarde
            ['diaSemana' => 1, 'horaInicio' => '14:00', 'horaFin' => '15:30', 'turno' => 'tarde'],
            ['diaSemana' => 1, 'horaInicio' => '15:30', 'horaFin' => '17:00', 'turno' => 'tarde'],
            ['diaSemana' => 1, 'horaInicio' => '17:00', 'horaFin' => '18:30', 'turno' => 'tarde'],

            ['diaSemana' => 2, 'horaInicio' => '14:00', 'horaFin' => '15:30', 'turno' => 'tarde'],
            ['diaSemana' => 2, 'horaInicio' => '15:30', 'horaFin' => '17:00', 'turno' => 'tarde'],
            ['diaSemana' => 2, 'horaInicio' => '17:00', 'horaFin' => '18:30', 'turno' => 'tarde'],

            ['diaSemana' => 3, 'horaInicio' => '14:00', 'horaFin' => '15:30', 'turno' => 'tarde'],
            ['diaSemana' => 3, 'horaInicio' => '15:30', 'horaFin' => '17:00', 'turno' => 'tarde'],
            ['diaSemana' => 3, 'horaInicio' => '17:00', 'horaFin' => '18:30', 'turno' => 'tarde'],

            ['diaSemana' => 4, 'horaInicio' => '14:00', 'horaFin' => '15:30', 'turno' => 'tarde'],
            ['diaSemana' => 4, 'horaInicio' => '15:30', 'horaFin' => '17:00', 'turno' => 'tarde'],
            ['diaSemana' => 4, 'horaInicio' => '17:00', 'horaFin' => '18:30', 'turno' => 'tarde'],

            ['diaSemana' => 5, 'horaInicio' => '14:00', 'horaFin' => '15:30', 'turno' => 'tarde'],
            ['diaSemana' => 5, 'horaInicio' => '15:30', 'horaFin' => '17:00', 'turno' => 'tarde'],
            ['diaSemana' => 5, 'horaInicio' => '17:00', 'horaFin' => '18:30', 'turno' => 'tarde'],
        ];

        foreach ($bloques as $bloque) {
            DB::table('bloquesHorarios')->insert([
                ...$bloque,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}