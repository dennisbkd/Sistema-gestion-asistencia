<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGrupoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'codigoGrupo' => 'required|string|max:20|unique:grupos,codigoGrupo',
            'estado' => 'required|in:activo,inactivo',
        ];
    }

    public function messages()
    {
        return [
            'codigoGrupo.required' => 'El código del grupo es obligatorio',
            'codigoGrupo.unique' => 'Este código de grupo ya existe',
            'estado.required' => 'El estado es obligatorio',
            'estado.in' => 'El estado debe ser activo o inactivo',
        ];
    }
}