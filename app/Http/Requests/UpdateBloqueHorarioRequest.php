<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBloqueHorarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'diaSemana' => 'sometimes|integer|min:1|max:7',
            'horaInicio' => 'sometimes|date_format:H:i',
            'horaFin' => 'sometimes|date_format:H:i|after:horaInicio',
            'turno' => 'nullable|in:mañana,tarde,noche',
        ];
    }

    public function messages(): array
    {
        return [
            'horaFin.after' => 'La hora de fin debe ser posterior a la hora de inicio.',
            'turno.in' => 'El turno debe ser: mañana, tarde o noche.',
        ];
    }
}
