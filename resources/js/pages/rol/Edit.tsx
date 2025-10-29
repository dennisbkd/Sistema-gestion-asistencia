// resources/js/pages/rol/Edit.tsx - Versión mejorada
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  ArrowLeft,
  Save,
  Shield,
  Key,
  Users
} from 'lucide-react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Roles',
    href: '/rol',
  },
  {
    title: 'Editar Rol',
    href: '#',
  },
];

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface EditProps {
  role: {
    id: number;
    name: string;
    guard_name: string;
    permissions: number[];
  };
  permissions: Permission[];
}

export default function Edit({ role, permissions }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    name: role.name,
    guard_name: role.guard_name,
    permissions: role.permissions,
  });

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(data.permissions);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
    setData('permissions',
      selectedPermissions.includes(permissionId)
        ? selectedPermissions.filter(id => id !== permissionId)
        : [...selectedPermissions, permissionId]
    );
  };

  const handleSelectAll = (guardName: string) => {
    const guardPermissions = permissions
      .filter(p => p.guard_name === guardName)
      .map(p => p.id);

    const allSelected = guardPermissions.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      // Deseleccionar todos
      const newPermissions = selectedPermissions.filter(id => !guardPermissions.includes(id));
      setSelectedPermissions(newPermissions);
      setData('permissions', newPermissions);
    } else {
      // Seleccionar todos
      const newPermissions = [...new Set([...selectedPermissions, ...guardPermissions])];
      setSelectedPermissions(newPermissions);
      setData('permissions', newPermissions);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatePromise = new Promise((resolve, reject) => {
      try {
        put(RoleController.update(role).url, {
          onSuccess: () => {
            resolve('success');
          },
          onError: (errors) => {
            // Construir mensaje de error detallado
            const errorMessages = Object.values(errors).join(', ');
            reject(new Error(errorMessages || 'Error al actualizar el rol'));
          },
        });
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(updatePromise, {
      loading: 'Guardando cambios del rol...',
      success: () => {
        return `Rol "${data.name}" actualizado correctamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  const permissionsByGuard = permissions.reduce((acc, permission) => {
    if (!acc[permission.guard_name]) {
      acc[permission.guard_name] = [];
    }
    acc[permission.guard_name].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Rol: ${role.name}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/rol">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Rol</h1>
            <p className="text-muted-foreground">
              Modifica los detalles y permisos del rol
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Información del Rol
              </CardTitle>
              <CardDescription>
                Configura los detalles básicos del rol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Rol</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Ej: administrador, editor, etc."
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guard_name">Guard</Label>
                <select
                  id="guard_name"
                  value={data.guard_name}
                  onChange={(e) => setData('guard_name', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="web">Web</option>
                  <option value="api">API</option>
                </select>
                {errors.guard_name && <p className="text-sm text-red-600">{errors.guard_name}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permisos Asignados
              </CardTitle>
              <CardDescription>
                Selecciona los permisos para este rol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {Object.entries(permissionsByGuard).map(([guardName, guardPermissions]) => (
                    <div key={guardName} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Guard: <Badge variant="outline">{guardName}</Badge>
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectAll(guardName)}
                        >
                          {guardPermissions.every(p => selectedPermissions.includes(p.id))
                            ? 'Deseleccionar Todos'
                            : 'Seleccionar Todos'
                          }
                        </Button>
                      </div>

                      <div className="grid gap-2">
                        {guardPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-3 rounded-lg border p-3">
                            <Switch
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <div className="flex-1 space-y-1">
                              <Label htmlFor={`permission-${permission.id}`} className="font-medium cursor-pointer">
                                {permission.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Guard: {permission.guard_name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>{selectedPermissions.length}</strong> permisos seleccionados
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={processing} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {processing ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}