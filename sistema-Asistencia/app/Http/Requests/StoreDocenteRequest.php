<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocenteRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'idUsuario' => 'required|exists:users,id',
            'codigoDocente' => 'required|string|max:20|unique:docentes,codigoDocente',
            'telefono' => 'nullable|string|max:20',
            'especialidad' => 'nullable|string|max:100',
            'estado' => 'required|in:activo,inactivo,licencia',
            'maxHorasSemanales' => 'required|integer|min:1|max:60',
        ];
    }

    public function messages()
    {
        return [
            'idUsuario.required' => 'El usuario es obligatorio',
            'idUsuario.exists' => 'El usuario seleccionado no existe',
            'codigoDocente.required' => 'El código del docente es obligatorio',
            'codigoDocente.unique' => 'Este código de docente ya existe',
            'maxHorasSemanales.required' => 'Las horas máximas semanales son obligatorias',
            'maxHorasSemanales.min' => 'Las horas máximas deben ser al menos 1',
            'maxHorasSemanales.max' => 'Las horas máximas no pueden exceder 60',
        ];
    }
}