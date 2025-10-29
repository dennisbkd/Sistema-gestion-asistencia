// resources/js/pages/permisos/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  ArrowLeft,
  Save,
  Key,
  Shield,
  Users,
  AlertTriangle
} from 'lucide-react';
import PermisoController from '@/actions/App/Http/Controllers/PermisoController';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Permisos',
    href: '/permisos',
  },
  {
    title: 'Editar Permiso',
    href: '#',
  },
];

interface Role {
  id: number;
  name: string;
  guard_name: string;
}

interface EditProps {
  permission: {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    roles_count?: number | 0;
    roles?: Role[];
  };
}

export default function Edit({ permission }: EditProps) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: permission.name,
    guard_name: permission.guard_name,
  });

  // Reset form cuando el permiso cambia
  useEffect(() => {
    setData({
      name: permission.name,
      guard_name: permission.guard_name,
    });
  }, [permission]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!data.name.trim()) {
      toast.error('El nombre del permiso es requerido');
      return;
    }

    const updatePromise = new Promise((resolve, reject) => {
      put(PermisoController.update(permission).url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al actualizar el permiso'));
        },
      });
    });

    toast.promise(updatePromise, {
      loading: 'Actualizando permiso...',
      success: () => {
        return `Permiso "${data.name}" actualizado exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  const hasChanges = data.name !== permission.name || data.guard_name !== permission.guard_name;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Permiso: ${permission.name}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href={PermisoController.index().url}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Permisos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Permiso</h1>
            <p className="text-muted-foreground">
              Modifica los detalles del permiso "{permission.name}"
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulario de Edición */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Información del Permiso
                </CardTitle>
                <CardDescription>
                  Actualiza los detalles del permiso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={submit} className="space-y-4">
                  {/* Nombre del Permiso */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Permiso *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Ej: view usuarios, edit posts, etc."
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Guard */}
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
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Link href="/permisos">
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={processing || !data.name.trim() || !hasChanges}
                      className="flex items-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Actualizando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Actualizar Permiso
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Información del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Información del Sistema
                </CardTitle>
                <CardDescription>
                  Detalles técnicos del permiso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">ID del Permiso</Label>
                    <p className="font-medium">{permission.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Estado</Label>
                    <Badge variant="default">Activo</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Creado</Label>
                    <p className="font-medium">
                      {new Date(permission.created_at).toLocaleDateString('es-BO')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Actualizado</Label>
                    <p className="font-medium">
                      {new Date(permission.updated_at).toLocaleDateString('es-BO')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de Roles Asignados */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Roles con este Permiso
                </CardTitle>
                <CardDescription>
                  Roles que tienen asignado este permiso
                </CardDescription>
              </CardHeader>
              <CardContent>
                {permission?.roles_count > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {permission.roles_count} rol(es) asignado(s)
                      </Badge>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre del Rol</TableHead>
                          <TableHead>Guard</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permission.roles?.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                {role.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {role.guard_name}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Este permiso no está asignado a ningún rol
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Los permisos deben asignarse a roles para tener efecto
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advertencia de Cambios */}
            {hasChanges && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-5 w-5" />
                    Cambios Pendientes
                  </CardTitle>
                  <CardDescription className="text-yellow-700 dark:text-yellow-300">
                    Tienes cambios sin guardar en este permiso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                    <p><strong>Cambios detectados:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      {data.name !== permission.name && (
                        <li>Nombre del permiso</li>
                      )}
                      {data.guard_name !== permission.guard_name && (
                        <li>Guard del permiso</li>
                      )}
                    </ul>
                    <p className="mt-2">
                      No olvides guardar los cambios para aplicarlos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}