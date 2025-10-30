<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Docente extends Model
{
    use HasFactory;

    protected $primaryKey = 'idDocente';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'idUsuario',
        'codigoDocente',
        'telefono',
        'especialidad',
        'estado',
        'maxHorasSemanales'
    ];

    protected $casts = [
        'maxHorasSemanales' => 'integer',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'idUsuario', 'id');
    }
}
