<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePeriodoAcademicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nroSemestre' => 'required|integer|between:1,2',
            'año' => 'required|integer|min:2000|max:2030',
            'fechaInicio' => 'required|date',
            'fechaFin' => 'required|date|after:fechaInicio',
            'estado' => 'required|in:activo,finalizado,planificado'
        ];
    }
}