<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMateriaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'sigla' => 'required|string|max:20|unique:materias',
            'nombre' => 'required|string|max:100',
            'semestre' => 'required|integer|min:1',
            'horasSemanales' => 'required|integer|min:1',
            'estado' => 'required|in:activo,inactivo'
        ];
    }

    public function messages()
    {
        return [
            'sigla.required' => 'La sigla es obligatoria',
            'sigla.unique' => 'Esta sigla ya está registrada',
            'nombre.required' => 'El nombre es obligatorio',
            'semestre.required' => 'El semestre es obligatorio',
            'semestre.min' => 'El semestre debe ser mayor a 0',
            'horasSemanales.required' => 'Las horas semanales son obligatorias',
            'horasSemanales.min' => 'Las horas semanales deben ser mayor a 0',
            'estado.required' => 'El estado es obligatorio',
            'estado.in' => 'El estado debe ser activo o inactivo'
        ];
    }
}