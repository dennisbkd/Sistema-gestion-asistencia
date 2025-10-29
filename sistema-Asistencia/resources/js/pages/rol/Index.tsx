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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Iconos de Lucide React
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Users,
  Filter,
  Download
} from 'lucide-react';
import RoleController, { index } from '@/actions/App/Http/Controllers/RoleController';
import { Create } from '@/routes/rol';
import { AlertDelete } from '@/components/AlertDelete';
import { toast } from 'sonner';
import { dashboard } from '@/routes';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Roles',
    href: index().url,
  },
];

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface Role {
  id: number;
  name: string;
  guard_name: string;
  permissions_count: number;
  users_count: number;
  created_at: string;
  permissions: Permission[];
}

interface IndexProps {
  roles: Role[];
  filters: {
    search: string;
  };
}

export default function Index({ roles, filters }: IndexProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const { processing, get, delete: EliminarRol } = useForm();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    get(index().url + (search ? `?search=${search}` : ''));
  };

  const handleRoleSelect = (roleId: number) => {
    setSelectedRoles(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedRoles(
      selectedRoles.length === roles.length
        ? []
        : roles.map(role => role.id)
    );
  };

  const getGuardNameBadge = (guardName: string) => {
    const variants = {
      web: 'default',
      api: 'secondary',
      admin: 'destructive'
    } as const;

    return (
      <Badge variant={variants[guardName as keyof typeof variants] || 'outline'}>
        {guardName}
      </Badge>
    );
  };

  const deleteRole = (role: Role) => {
    const eliminarPromise = new Promise((resolve, reject) => {
      try {
        EliminarRol(RoleController.destroy(role).url, {
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
    })

    toast.promise(eliminarPromise, {
      loading: 'Eliminando cambios del rol...',
      success: () => {
        return `Rol "${role.name}" Eliminado correctamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  const bulkDelete = () => {
    if (selectedRoles.length === 0) return;
    router.post(RoleController.bulkDelete().url, {
      ids: selectedRoles
    }, {
      onSuccess: () => {
        setSelectedRoles([]);
      },
      onError: (errors) => {
        console.error('Error al eliminar roles:', errors);
      }
    })
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Roles" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Roles y Permisos</h1>
            <p className="text-muted-foreground">
              Gestiona los roles y permisos del sistema usando Spatie Permissions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {selectedRoles.length > 0 && can('delete roles') && (
              <AlertDelete
                onConfirm={() => bulkDelete()}
                processing={processing}
                title='Eliminar Roles'
                triggerLabel={`Eliminar ${selectedRoles.length}`}
                description={`Se eliminarán ${selectedRoles.length} rol(es) junto con todos sus datos y permisos.`}
              />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>PDF</DropdownMenuItem>
                <DropdownMenuItem>Excel</DropdownMenuItem>
                <DropdownMenuItem>CSV</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {can('create roles') && (
              <Link href={Create().url}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Rol
                </Button>
              </Link>)}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{roles.length}</div>
              <p className="text-xs text-muted-foreground">
                Roles en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Permisos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.reduce((acc, role) => acc + role.permissions_count, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Permisos asignados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Roles Web</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.filter(role => role.guard_name === 'web').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Roles para aplicación web
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Roles API</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {roles.filter(role => role.guard_name === 'api').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Roles para API
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Busca y filtra los roles del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar roles por nombre..."
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
                    router.get('/roles');
                  }}
                >
                  Limpiar
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Roles</CardTitle>
            <CardDescription>
              Gestiona todos los roles y sus permisos asociados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {roles.length === 0
                  ? 'No se encontraron roles'
                  : `Lista de ${roles.length} rol(es) encontrado(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedRoles.length === roles.length && roles.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Guard</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} className="group hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => handleRoleSelect(role.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getGuardNameBadge(role.guard_name)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {role.permissions_count} permisos
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {role.users_count} usuarios
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(role.created_at).toLocaleDateString('es-BO')}
                    </TableCell>
                    <TableCell className="space-x-2 flex justify-center ">
                      {can('edit roles') && (<Link href={RoleController.edit(role).url}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                      </Link>)}
                      {can('delete roles') && (<AlertDelete
                        onConfirm={() => deleteRole(role)}
                        processing={processing}
                        triggerLabel="Eliminar"
                        title="¿Eliminar este rol?"
                        description="Se eliminará junto con todos sus datos y permisos."
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