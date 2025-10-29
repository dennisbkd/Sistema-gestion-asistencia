<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;

    protected $primaryKey = 'idMateria';
    
    protected $fillable = [
        'sigla',
        'nombre', 
        'semestre',
        'horasSemanales',
        'estado'
    ];

    protected $casts = [
        'semestre' => 'integer',
        'horasSemanales' => 'integer',
    ];

    protected $attributes = [
        'estado' => 'activo'
    ];
}