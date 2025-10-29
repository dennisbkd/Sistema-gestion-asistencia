// resources/js/pages/permisos/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  Filter,
  Key
} from 'lucide-react';
import { Create } from '@/routes/permisos';
import PermisoController from '@/actions/App/Http/Controllers/PermisoController';
import { AlertDelete } from '@/components/AlertDelete';
import { toast } from 'sonner';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Permisos',
    href: '/permisos',
  },
];

interface Permission {
  id: number;
  name: string;
  guard_name: string;
  roles_count: number;
  created_at: string;
}

interface IndexProps {
  permissions: Permission[];
  filters: {
    search: string;
  };
}

export default function Index({ permissions, filters }: IndexProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const { processing, delete: deletePermiso } = useForm();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/permisos', { search }, {
      preserveState: true,
      replace: true,
    });
  };

  const deletePermission = (permission: Permission) => {

    const deletePromise = new Promise((resolve, reject) => {
      try {
        deletePermiso(PermisoController.destroy(permission.id).url, {
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

    toast.promise(deletePromise, {
      loading: 'Eliminando permiso...',
      success: () => {
        return `Permiso "${permission.name}" eliminado exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  const getGuardNameBadge = (guardName: string) => {
    const variants = {
      web: 'default',
      api: 'secondary',
    } as const;

    return (
      <Badge variant={variants[guardName as keyof typeof variants] || 'outline'}>
        {guardName}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Permisos" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Permisos del Sistema</h1>
            <p className="text-muted-foreground">
              Gestiona los permisos disponibles para asignar a roles
            </p>
          </div>

          {can('create permisos') && (<Link href={Create().url}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Permiso
            </Button>
          </Link>)}
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permisos</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Permisos en el sistema
            </p>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Busca permisos por nombre o guard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar permisos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              {search && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setSearch('');
                    router.get('/permisos');
                  }}
                >
                  Limpiar
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Permissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Permisos</CardTitle>
            <CardDescription>
              Todos los permisos disponibles en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {permissions.length === 0
                  ? 'No se encontraron permisos'
                  : `Lista de ${permissions.length} permiso(s) encontrado(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Guard</TableHead>
                  <TableHead>Roles Asignados</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {permission.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getGuardNameBadge(permission.guard_name)}
                    </TableCell>
                    <TableCell className='pl-8'>
                      <Badge variant="secondary" >
                        {permission.roles_count} roles
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(permission.created_at).toLocaleDateString('es-BO')}
                    </TableCell>
                    <TableCell className="space-x-2 flex justify-center ">
                      {can('edit permisos') && (<Link href={PermisoController.edit(permission.id).url}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                      </Link>)}
                      {can('delete permisos') && (<AlertDelete
                        onConfirm={() => deletePermission(permission)}
                        processing={processing}
                        description='Estas seguro de elimar este Permiso? Esta acción no se puede deshacer.'
                      />)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}