<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Roles
        $adminRole = Role::create(['name' => 'administrador']);
        $editorRole = Role::create(['name' => 'editor']);

        //Permisos
        $permisosIndexAdmin = Permission::create(['name' => 'view usuarios']);
        $permisosEditAdmin = Permission::create(['name' => 'edit usuarios']);
        $permisosDeleteAdmin = Permission::create(['name' => 'delete usuarios']);
        $permisosCreateAdmin = Permission::create(['name' => 'create usuarios']);
        $permisosAssignRoles = Permission::create(['name' => 'asignar roles']);
        $permisosAssignarPermissions = Permission::create(['name' => 'asignar permisos']);

        //Asignar permisos a roles
        //administrador
        $adminRole->givePermissionTo(Permission::all());
        //editor
        $editorRole->givePermissionTo([
            $permisosIndexAdmin,
            $permisosEditAdmin
        ]);
    }
}
