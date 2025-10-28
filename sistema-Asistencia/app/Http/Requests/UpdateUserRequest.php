<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255'
            ],
            'password' => [ 'nullable', 'string', Password::min(8), 'confirmed'],
            'estado' => 'sometimes|in:activo,inactivo,suspendido',
        ];
    }
    public function messages(): array
    {
        return [
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Si el password está vacío, removerlo del request
        if ($this->password === null || $this->password === '') {
            $this->request->remove('password');
            $this->request->remove('password_confirmation');
        }
    }
}
