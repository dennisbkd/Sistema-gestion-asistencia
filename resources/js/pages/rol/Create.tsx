// resources/js/pages/rol/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

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
  Plus
} from 'lucide-react';
import RoleController from '@/actions/App/Http/Controllers/RoleController';

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
    title: 'Crear Rol',
    href: '#',
  },
];

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface CreateProps {
  permissions: Permission[];
}

export default function Create({ permissions }: CreateProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    guard_name: 'web',
    permissions: [] as number[],
  });

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const handlePermissionToggle = (permissionId: number) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter(id => id !== permissionId)
      : [...selectedPermissions, permissionId];

    setSelectedPermissions(newPermissions);
    setData('permissions', newPermissions);
  };

  const handleSelectAll = (guardName: string) => {
    const guardPermissions = permissions
      .filter(p => p.guard_name === guardName)
      .map(p => p.id);

    const allSelected = guardPermissions.every(id => selectedPermissions.includes(id));

    const newPermissions = allSelected
      ? selectedPermissions.filter(id => !guardPermissions.includes(id))
      : [...new Set([...selectedPermissions, ...guardPermissions])];

    setSelectedPermissions(newPermissions);
    setData('permissions', newPermissions);
  };

  const handleSelectAllPermissions = () => {
    const allPermissionIds = permissions.map(p => p.id);
    const allSelected = allPermissionIds.every(id => selectedPermissions.includes(id));

    const newPermissions = allSelected ? [] : allPermissionIds;
    setSelectedPermissions(newPermissions);
    setData('permissions', newPermissions);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!data.name.trim()) {
      toast.error('El nombre del rol es requerido');
      return;
    }

    const createPromise = new Promise((resolve, reject) => {
      post(RoleController.store().url, {
        onSuccess: () => {
          reset();
          setSelectedPermissions([]);
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al crear el rol'));
        },
      });
    });

    toast.promise(createPromise, {
      loading: 'Creando rol...',
      success: () => {
        return `Rol "${data.name}" creado exitosamente`;
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
      <Head title="Crear Nuevo Rol" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/rol">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Roles
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Rol</h1>
            <p className="text-muted-foreground">
              Define un nuevo rol y asigna los permisos correspondientes
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
                Configura los detalles básicos del nuevo rol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Rol *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Ej: administrador, editor, supervisor, etc."
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  El nombre debe ser único y descriptivo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guard_name">Guard *</Label>
                <select
                  id="guard_name"
                  value={data.guard_name}
                  onChange={(e) => setData('guard_name', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="web">Web - Para aplicación web</option>
                  <option value="api">API - Para APIs REST</option>
                </select>
                {errors.guard_name && (
                  <p className="text-sm text-red-600">{errors.guard_name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Define el contexto de seguridad para este rol
                </p>
              </div>

              {/* Resumen */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Resumen del Rol</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Nombre:</strong> {data.name || 'Sin definir'}</p>
                  <p><strong>Guard:</strong> {data.guard_name}</p>
                  <p><strong>Permisos asignados:</strong> {selectedPermissions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permisos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Permisos Disponibles
              </CardTitle>
              <CardDescription>
                Selecciona los permisos que tendrá este rol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">
                  Total de permisos: {permissions.length}
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllPermissions}
                >
                  {selectedPermissions.length === permissions.length
                    ? 'Deseleccionar Todos'
                    : 'Seleccionar Todos'
                  }
                </Button>
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-6">
                  {Object.entries(permissionsByGuard).map(([guardName, guardPermissions]) => (
                    <div key={guardName} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Guard: <Badge variant="outline">{guardName}</Badge>
                          <Badge variant="secondary" className="ml-2">
                            {guardPermissions.length} permisos
                          </Badge>
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
                          <div key={permission.id} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                            <Switch
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <div className="flex-1 space-y-1">
                              <Label
                                htmlFor={`permission-${permission.id}`}
                                className="font-medium cursor-pointer"
                              >
                                {permission.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                ID: {permission.id} | Guard: {permission.guard_name}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {permission.guard_name}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Resumen de permisos seleccionados */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      Permisos Seleccionados
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {selectedPermissions.length} de {permissions.length} permisos
                    </p>
                  </div>
                  <Badge variant="default" className="bg-blue-600">
                    {Math.round((selectedPermissions.length / permissions.length) * 100)}%
                  </Badge>
                </div>

                {selectedPermissions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Permisos seleccionados:</p>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {selectedPermissions.map(permissionId => {
                        const permission = permissions.find(p => p.id === permissionId);
                        return permission ? (
                          <Badge key={permissionId} variant="secondary" className="text-xs">
                            {permission.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-between items-center pt-6 border-t">
            <div>
              <p className="text-sm text-muted-foreground">
                * Campos obligatorios
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/rol">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={processing || !data.name.trim()}
                className="flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Crear Rol
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}