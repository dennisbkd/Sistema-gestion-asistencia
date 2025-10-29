// resources/js/pages/permisos/Create.tsx
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

import {
  ArrowLeft,
  Save,
  Key,
  Shield
} from 'lucide-react';
import { create } from '@/actions/App/Http/Controllers/PermisoController';
import { Store } from '@/routes/permisos';

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
    title: 'Crear Permiso',
    href: '#',
  },
];

interface CreateProps {
  // No necesita props adicionales para crear
}

export default function Create({ }: CreateProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    guard_name: 'web',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!data.name.trim()) {
      toast.error('El nombre del permiso es requerido');
      return;
    }

    const createPromise = new Promise((resolve, reject) => {
      post(Store().url, {
        onSuccess: () => {
          reset();
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al crear el permiso'));
        },
      });
    });

    toast.promise(createPromise, {
      loading: 'Creando permiso...',
      success: () => {
        return `Permiso "${data.name}" creado exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Nuevo Permiso" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/permisos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Permisos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Permiso</h1>
            <p className="text-muted-foreground">
              Define un nuevo permiso para asignar a roles del sistema
            </p>
          </div>
        </div>

        <div className="flex place-content-center">
          <form onSubmit={submit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Información del Permiso
                </CardTitle>
                <CardDescription>
                  Configura los detalles del nuevo permiso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nombre del Permiso */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Permiso *</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Ej: view usuarios, edit posts, delete comments, etc."
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Usa un formato descriptivo: <strong>acción recurso</strong>
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <strong>Acciones comunes:</strong>
                      <ul className="list-disc list-inside ml-2">
                        <li>view - Ver</li>
                        <li>create - Crear</li>
                        <li>edit - Editar</li>
                        <li>delete - Eliminar</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Recursos comunes:</strong>
                      <ul className="list-disc list-inside ml-2">
                        <li>usuarios - Usuarios</li>
                        <li>roles - Roles</li>
                        <li>posts - Publicaciones</li>
                        <li>settings - Configuración</li>
                      </ul>
                    </div>
                  </div>
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
                  <p className="text-sm text-muted-foreground">
                    Define el contexto de seguridad para este permiso
                  </p>
                </div>

                {/* Resumen */}
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Resumen del Permiso
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span><strong>Nombre:</strong></span>
                      <Badge variant={data.name ? "default" : "outline"}>
                        {data.name || 'Sin definir'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span><strong>Guard:</strong></span>
                      <Badge variant="secondary">
                        {data.guard_name}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span><strong>Formato:</strong></span>
                      <Badge variant="outline">
                        {data.name ? data.name.split(' ').length > 1 ? 'Correcto' : 'Revisar' : '---'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Ejemplos */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Ejemplos de permisos bien formados:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-x-2">
                      <Badge variant="secondary">view usuarios</Badge>
                      <Badge variant="secondary">create posts</Badge>
                      <Badge variant="secondary">edit roles</Badge>
                    </div>
                    <div className="space-x-2">
                      <Badge variant="secondary">delete comments</Badge>
                      <Badge variant="secondary">manage settings</Badge>
                      <Badge variant="secondary">export data</Badge>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      * Campos obligatorios
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={create().url}>
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
                          Crear Permiso
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}