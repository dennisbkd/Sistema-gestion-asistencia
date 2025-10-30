<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDocenteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'idUsuario' => [
                'required',
                'exists:users,id',
                Rule::unique('docentes', 'idUsuario')->ignore($this->route('docente')->idDocente, 'idDocente')
            ],
            'codigoDocente' => [
                'required',
                'string',
                'max:20',
                Rule::unique('docentes', 'codigoDocente')->ignore($this->route('docente')->idDocente, 'idDocente')
            ],
            'telefono' => 'nullable|string|max:20',
            'especialidad' => 'nullable|string|max:100',
            'estado' => 'required|in:activo,inactivo,licencia',
            'maxHorasSemanales' => 'required|integer|min:1|max:60'
        ];
    }

    public function messages(): array
    {
        return [
            'idUsuario.required' => 'El usuario es obligatorio.',
            'idUsuario.exists' => 'El usuario seleccionado no existe.',
            'idUsuario.unique' => 'Este usuario ya tiene un perfil de docente.',
            'codigoDocente.required' => 'El código de docente es obligatorio.',
            'codigoDocente.unique' => 'El código de docente ya está en uso.',
            'maxHorasSemanales.required' => 'Las horas máximas semanales son obligatorias.',
            'maxHorasSemanales.min' => 'Las horas máximas semanales deben ser al menos 1.',
            'maxHorasSemanales.max' => 'Las horas máximas semanales no pueden exceder 60.',
        ];
    }
}