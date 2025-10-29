<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grupo extends Model
{
    use HasFactory;

    protected $primaryKey = 'idGrupo';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'codigoGrupo',
        'estado'
    ];

    protected $casts = [
        // Puedes agregar casts si necesitas
    ];
}
