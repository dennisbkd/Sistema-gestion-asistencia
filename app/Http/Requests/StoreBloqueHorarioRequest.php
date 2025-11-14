<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBloqueHorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // permitir el acceso
    }

    public function rules(): array
    {
        return [
            'diaSemana' => 'required|integer|min:1|max:7',
            'horaInicio' => 'required|date_format:H:i',
            'horaFin' => 'required|date_format:H:i|after:horaInicio',
            'turno' => 'nullable|in:mañana,tarde,noche',
        ];
    }

    public function messages(): array
    {
        return [
            'diaSemana.required' => 'El día de la semana es obligatorio.',
            'horaInicio.required' => 'La hora de inicio es obligatoria.',
            'horaFin.after' => 'La hora de fin debe ser posterior a la hora de inicio.',
            'turno.in' => 'El turno debe ser: mañana, tarde o noche.',
        ];
    }
}
