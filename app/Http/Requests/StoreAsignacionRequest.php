<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use App\Models\HorarioAsignacion;
use App\Models\Asignacion;

class StoreAsignacionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'idPeriodo' => 'required|exists:periodo_academicos,idPeriodo',
            'idMateria' => 'required|exists:materias,idMateria',
            'idDocente' => 'required|exists:docentes,idDocente',
            'idGrupo' => 'required|exists:grupos,idGrupo',
            'modalidad' => 'required|in:presencial,virtual,hibrida', // ✅ AÑADIR
            'inscritos' => 'required|integer|min:0', // ✅ AÑADIR
            'horarios' => 'required|array|min:1',
            'horarios.*.idBloque' => 'required|exists:bloquesHorarios,idBloque',
            'horarios.*.idAula' => 'required|exists:aulas,id',
        ];
    }

    public function messages()
    {
        return [
            'idPeriodo.required' => 'El período académico es obligatorio.',
            'idMateria.required' => 'La materia es obligatoria.',
            'idDocente.required' => 'El docente es obligatorio.',
            'idGrupo.required' => 'El grupo es obligatorio.',
            'modalidad.required' => 'La modalidad es obligatoria.', // ✅ AÑADIR
            'modalidad.in' => 'La modalidad debe ser presencial, virtual o híbrida.', // ✅ AÑADIR
            'inscritos.required' => 'El número de inscritos es obligatorio.', // ✅ AÑADIR
            'inscritos.integer' => 'Los inscritos deben ser un número entero.', // ✅ AÑADIR
            'inscritos.min' => 'Los inscritos no pueden ser negativos.', // ✅ AÑADIR
            'horarios.required' => 'Debe agregar al menos un horario.',
            'horarios.*.idBloque.required' => 'El bloque horario es obligatorio.',
            'horarios.*.idAula.required' => 'El aula es obligatoria.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $idPeriodo = $this->idPeriodo;
            $idDocente = $this->idDocente;

            foreach ($this->horarios as $index => $h) {
                $idBloque = $h['idBloque'];
                $idAula = $h['idAula'];

                // Validar aula ocupada
                $aulaOcupada = HorarioAsignacion::where('idBloque', $idBloque)
                    ->where('idAula', $idAula)
                    ->whereHas('asignacion', fn($q) => $q->where('idPeriodo', $idPeriodo))
                    ->exists();

                if ($aulaOcupada) {
                    $validator->errors()->add(
                        "horarios.$index.idAula",
                        "El aula ya está ocupada en este bloque para el periodo seleccionado."
                    );
                }

                // Validar docente ocupado
                $docenteOcupado = HorarioAsignacion::where('idBloque', $idBloque)
                    ->whereHas('asignacion', fn($q) => $q
                        ->where('idPeriodo', $idPeriodo)
                        ->where('idDocente', $idDocente))
                    ->exists();

                if ($docenteOcupado) {
                    $validator->errors()->add(
                        "horarios.$index.idBloque",
                        "El docente ya tiene otra asignación en este bloque para el periodo seleccionado."
                    );
                }
            }
        });
    }
}
