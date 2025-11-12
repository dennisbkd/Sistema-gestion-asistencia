<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePeriodoAcademicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nroSemestre' => [
                'required',
                'integer',
                'between:1,4',
                Rule::unique('periodoAcademico')
                    ->where('año', $this->año)
                    ->ignore($this->route('periodoAcademico'), 'idPeriodo')
            ],
            'año' => 'required|integer|min:2000|max:2030',
            'tipoPeriodo' => 'required|in:normal,mesa,verano',
            'fechaInicio' => 'required|date',
            'fechaFin' => 'required|date|after:fechaInicio',
            'estado' => 'required|in:activo,finalizado,planificado'
        ];
    }
}