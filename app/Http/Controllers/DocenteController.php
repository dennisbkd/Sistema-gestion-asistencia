<?php

namespace App\Http\Controllers;

use App\Models\Docente;
use App\Models\User;
use App\Http\Requests\StoreDocenteRequest;
use App\Http\Requests\UpdateDocenteRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $docentes = Docente::with('usuario')
            ->when($request->filled('estado'), function ($query) use ($request) {
                $query->where('estado', $request->estado);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('codigoDocente', 'like', "%{$request->search}%")
                      ->orWhere('especialidad', 'like', "%{$request->search}%")
                      ->orWhere('telefono', 'like', "%{$request->search}%")
                      ->orWhereHas('usuario', function ($userQuery) use ($request) {
                          $userQuery->where('name', 'like', "%{$request->search}%")
                                   ->orWhere('email', 'like', "%{$request->search}%");
                      });
                });
            })
            ->orderBy('codigoDocente')
            ->get();

        return Inertia::render('docentes/Index', [
            'docentes' => $docentes,
            'filters' => $request->only(['search', 'estado'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // OPCIÓN 1: Usuarios sin perfil docente y con rol docente
        $usuarios = User::whereDoesntHave('docente') // Ahora funciona con la relación definida
            ->whereHas('roles', function ($query) {
                $query->where('name', 'docente');
            })
            ->select('id', 'name', 'email')
            ->get();

        // OPCIÓN 2: Si no todos los usuarios tienen rol docente, puedes usar esta alternativa:
        // $usuarios = User::whereDoesntHave('docente')
        //     ->select('id', 'name', 'email')
        //     ->get();

        return Inertia::render('docentes/Create', [
            'usuarios' => $usuarios
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocenteRequest $request)
    {
        try {
            // Generar código de docente automáticamente si no se proporciona
            $codigoDocente = $request->codigoDocente ?? $this->generarCodigoDocente();
            
            $docenteData = array_merge($request->validated(), [
                'codigoDocente' => $codigoDocente
            ]);

            Docente::create($docenteData);

            return redirect()->route('docentes.index')
                ->with('success', 'Docente creado exitosamente');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al crear el docente: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Docente $docente)
    {
        // Obtener usuarios que no tienen perfil docente o son el mismo usuario del docente actual
        $usuarios = User::where(function ($query) use ($docente) {
                $query->whereDoesntHave('docente')
                      ->orWhere('id', $docente->idUsuario);
            })
            ->whereHas('roles', function ($query) {
                $query->where('name', 'docente');
            })
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('docentes/Edit', [
            'docente' => $docente->load('usuario'),
            'usuarios' => $usuarios
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocenteRequest $request, Docente $docente)
    {
        try {
            $docente->update($request->validated());

            return redirect()->route('docentes.index')
                ->with('success', 'Docente actualizado exitosamente');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al actualizar el docente: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Docente $docente)
    {
        try {
            $docente->delete();

            return redirect()->route('docentes.index')
                ->with('success', 'Docente eliminado exitosamente');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al eliminar el docente: ' . $e->getMessage());
        }
    }

    /**
     * Change the status of the specified resource.
     */
    public function changeStatus(Docente $docente)
    {
        try {
            $nuevoEstado = $docente->estado === 'activo' ? 'inactivo' : 'activo';
            
            $docente->update(['estado' => $nuevoEstado]);

            $mensaje = $nuevoEstado === 'activo' 
                ? 'Docente activado exitosamente' 
                : 'Docente desactivado exitosamente';

            return redirect()->route('docentes.index')
                ->with('success', $mensaje);

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al cambiar el estado del docente: ' . $e->getMessage());
        }
    }

    /**
     * Generate automatic teacher code
     */
    private function generarCodigoDocente()
    {
        $year = date('Y');
        $lastDocente = Docente::where('codigoDocente', 'like', "DOC-{$year}-%")
            ->orderBy('codigoDocente', 'desc')
            ->first();

        if ($lastDocente) {
            $lastNumber = intval(substr($lastDocente->codigoDocente, -3));
            $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '001';
        }

        return "DOC-{$year}-{$newNumber}";
    }

    /**
     * Get teacher statistics
     */
    public function estadisticas()
    {
        $totalDocentes = Docente::count();
        $docentesActivos = Docente::where('estado', 'activo')->count();
        $docentesInactivos = Docente::where('estado', 'inactivo')->count();
        $docentesLicencia = Docente::where('estado', 'licencia')->count();
        $totalHoras = Docente::sum('maxHorasSemanales');

        return response()->json([
            'total' => $totalDocentes,
            'activos' => $docentesActivos,
            'inactivos' => $docentesInactivos,
            'licencia' => $docentesLicencia,
            'horas_totales' => $totalHoras
        ]);
    }

    /**
     * Search teachers for autocomplete
     */
    public function buscar(Request $request)
    {
        $docentes = Docente::with('usuario')
            ->when($request->filled('q'), function ($query) use ($request) {
                $query->where('codigoDocente', 'like', "%{$request->q}%")
                      ->orWhereHas('usuario', function ($userQuery) use ($request) {
                          $userQuery->where('name', 'like', "%{$request->q}%");
                      });
            })
            ->where('estado', 'activo')
            ->limit(10)
            ->get()
            ->map(function ($docente) {
                return [
                    'id' => $docente->idDocente,
                    'text' => "{$docente->codigoDocente} - {$docente->usuario->name}"
                ];
            });

        return response()->json($docentes);
    }

    public function show(Docente $docente)
    {
        return Inertia::render('docentes/Show', [
        'docente' => $docente->load('usuario')
        ]);
    }
}