<?php

namespace App\Traits;
use App\Models\Bitacora;
use Illuminate\Support\Facades\Auth;

trait RegistrarBitacora
{
    /**
     * Registrar acción en bitácora
     */
    public static function registrarBitacora(string $accion, string $modulo, ?string $submodulo = null, ?string $descripcion = null, $datosAntes = null, $datosDespues = null, ?string $referenciaId = null): void
    {
        $request = request();
        
        Bitacora::create([
            'idUsuario' => Auth::id(),
            'accion' => $accion,
            'modulo' => $modulo,
            'submodulo' => $submodulo,
            'descripcion' => $descripcion,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metodo_http' => $request->method(),
            'ruta' => $request->path(),
            'datos_antes' => $datosAntes,
            'datos_despues' => $datosDespues,
            'parametros' => $request->except(['password', '_token']),
            'referencia_id' => $referenciaId,
            'estado' => 'exitoso',
        ]);
    }

    /**
     * Registrar error en bitácora
     */
    public static function registrarError(string $accion, string $modulo, ?string $submodulo = null, string $error, ?string $referenciaId = null): void
    {
        $request = request();
        
        Bitacora::create([
            'idUsuario' => Auth::id(),
            'accion' => $accion,
            'modulo' => $modulo,
            'submodulo' => $submodulo,
            'descripcion' => "Error en {$accion}",
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metodo_http' => $request->method(),
            'ruta' => $request->path(),
            'parametros' => $request->except(['password', '_token']),
            'referencia_id' => $referenciaId,
            'estado' => 'fallido',
            'error' => $error,
        ]);
    }

    /**
     * Boot del trait para modelos Eloquent
     */
    protected static function bootRegistraBitacora(): void
    {
        static::created(function ($model) {
            self::registrarBitacora(
                'CREAR',
                class_basename($model),
                null,
                "Registro creado: " . $model->getKey(),
                null,
                $model->toArray(),
                $model->getKey()
            );
        });

        static::updated(function ($model) {
            self::registrarBitacora(
                'ACTUALIZAR',
                class_basename($model),
                null,
                "Registro actualizado: " . $model->getKey(),
                $model->getOriginal(),
                $model->getChanges(),
                $model->getKey()
            );
        });

        static::deleted(function ($model) {
            self::registrarBitacora(
                'ELIMINAR',
                class_basename($model),
                null,
                "Registro eliminado: " . $model->getKey(),
                $model->getOriginal(),
                null,
                $model->getKey()
            );
        });
    }
}