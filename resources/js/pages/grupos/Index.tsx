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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Plus,
  Search,
  Edit,
  Users,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { index, create, edit, changeStatus } from '@/routes/grupos';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Grupos',
    href: index().url,
  },
];

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
  estado: string;
  created_at: string;
}

interface IndexProps {
  grupos: Grupo[];
  filters: {
    search: string;
    estado: string;
  };
}

export default function Index({ grupos: gruposData, filters }: IndexProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedEstado, setSelectedEstado] = useState(filters?.estado || '');

  const { processing, get } = useForm();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedEstado) params.append('estado', selectedEstado);
    
    get(index().url + `?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedEstado('');
    router.get(index().url);
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo: 'default',
      inactivo: 'secondary',
    } as const;

    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'outline'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const changeStatusHandler = (grupo: Grupo) => {
    const nuevoEstado = grupo.estado === 'activo' ? 'inactivo' : 'activo';
    
    router.patch(changeStatus(grupo.idGrupo).url, {}, {
      onSuccess: () => {
        toast.success(`Grupo ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`);
      },
      onError: () => {
        toast.error('Error al cambiar el estado del grupo');
      },
    });
  };

  const totalGrupos = gruposData.length;
  const gruposActivos = gruposData.filter(g => g.estado === 'activo').length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Grupos" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Grupos</h1>
            <p className="text-muted-foreground">
              Administra los grupos del sistema académico
            </p>
          </div>

          <Link href={create().url}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Grupo
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGrupos}</div>
              <p className="text-xs text-muted-foreground">
                Grupos en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grupos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gruposActivos}</div>
              <p className="text-xs text-muted-foreground">
                +{((gruposActivos / totalGrupos) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grupos Inactivos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGrupos - gruposActivos}</div>
              <p className="text-xs text-muted-foreground">
                -{(((totalGrupos - gruposActivos) / totalGrupos) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Busca y filtra los grupos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar grupos por código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>

              <Button type="submit" variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              
              {(search || selectedEstado) && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearFilters}
                >
                  Limpiar
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Grupos</CardTitle>
            <CardDescription>
              Gestiona todos los grupos del sistema académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {gruposData.length === 0
                  ? 'No se encontraron grupos'
                  : `Lista de ${gruposData.length} grupo(s) encontrado(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gruposData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No se encontraron grupos con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  gruposData.map((grupo) => (
                    <TableRow key={grupo.idGrupo} className="hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {grupo.codigoGrupo}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(grupo.estado)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(grupo.created_at).toLocaleDateString('es-BO')}
                      </TableCell>
                      <TableCell className="space-x-2 flex justify-center">
                        <Link href={edit(grupo.idGrupo).url}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => changeStatusHandler(grupo)}
                          className={grupo.estado === 'activo' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        >
                          {grupo.estado === 'activo' ? 'Desactivar' : 'Activar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}