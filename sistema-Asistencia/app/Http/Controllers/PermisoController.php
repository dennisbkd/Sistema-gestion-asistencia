<?php
// app/Http/Controllers/PermissionController.php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;

class PermisoController extends Controller
{
    public function index(Request $request)
    {
        $permissions = Permission::withCount('roles')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('guard_name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get()
            ->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'guard_name' => $permission->guard_name,
                    'roles_count' => $permission->roles_count,
                    'created_at' => $permission->created_at->toDateTimeString(),
                ];
            });

        return Inertia::render('permisos/Index', [
            'permissions' => $permissions,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('permisos/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
            'guard_name' => 'required|string|in:web,api',
        ]);

        Permission::create($validated);

        return redirect()->route('permisos.Index')
            ->with('success', 'Permiso creado exitosamente.');
    }

    public function edit(Permission $permission)
    {
        $permission->load('roles'); // Cargar roles asociados

        return Inertia::render('permisos/Edit', [
            'permission' => [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'created_at' => $permission->created_at->toDateTimeString(),
                'updated_at' => $permission->updated_at->toDateTimeString(),
                'roles_count' => $permission->roles()->count(),
                'roles' => $permission->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'guard_name' => $role->guard_name,
                    ];
                }),
            ],
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'guard_name' => 'required|string|in:web,api',
        ]);

        $permission->update($validated);

        return redirect()->route('permisos.Index')
            ->with('success', 'Permiso actualizado exitosamente.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->route('permisos.Index')
            ->with('success', 'Permiso eliminado exitosamente.');
    }
}