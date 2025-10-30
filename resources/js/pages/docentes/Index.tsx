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
  User,
  Phone,
  Briefcase,
  Filter,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { index, create, edit, changeStatus, show } from '@/routes/docentes';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Docentes',
    href: index().url,
  },
];

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface Docente {
  idDocente: number;
  idUsuario: number;
  codigoDocente: string;
  telefono: string;
  especialidad: string;
  estado: string;
  maxHorasSemanales: number;
  created_at: string;
  usuario: Usuario;
}

interface IndexProps {
  docentes: Docente[];
  filters: {
    search: string;
    estado: string;
  };
}

export default function Index({ docentes: docentesData, filters }: IndexProps) {
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
      licencia: 'outline',
    } as const;

    const colors = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-red-100 text-red-800',
      licencia: 'bg-yellow-100 text-yellow-800',
    } as const;

    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'outline'} className={colors[estado as keyof typeof colors]}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const changeStatusHandler = (docente: Docente) => {
    const nuevoEstado = docente.estado === 'activo' ? 'inactivo' : 'activo';

    router.patch(changeStatus(docente.idDocente).url, {}, {
      onSuccess: () => {
        toast.success(`Docente ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} exitosamente`);
      },
      onError: () => {
        toast.error('Error al cambiar el estado del docente');
      },
    });
  };

  const totalDocentes = docentesData.length;
  const docentesActivos = docentesData.filter(d => d.estado === 'activo').length;
  const totalHoras = docentesData.reduce((acc, docente) => acc + docente.maxHorasSemanales, 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Docentes" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Docentes</h1>
            <p className="text-muted-foreground">
              Administra los docentes del sistema académico
            </p>
          </div>

          <Link href={create().url}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Docente
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Docentes</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDocentes}</div>
              <p className="text-xs text-muted-foreground">
                Docentes en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Docentes Activos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{docentesActivos}</div>
              <p className="text-xs text-muted-foreground">
                +{((docentesActivos / totalDocentes) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Totales</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoras}</div>
              <p className="text-xs text-muted-foreground">
                Horas semanales disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Licencia</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {docentesData.filter(d => d.estado === 'licencia').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Docentes en licencia
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Busca y filtra los docentes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código, especialidad, nombre o email..."
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
                <option value="licencia">Licencia</option>
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
            <CardTitle>Lista de Docentes</CardTitle>
            <CardDescription>
              Gestiona todos los docentes del sistema académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {docentesData.length === 0
                  ? 'No se encontraron docentes'
                  : `Lista de ${docentesData.length} docente(s) encontrado(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Horas Máx.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docentesData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron docentes con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  docentesData.map((docente) => (
                    <TableRow key={docente.idDocente} className="hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {docente.codigoDocente}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{docente.usuario.name}</div>
                          <div className="text-sm text-muted-foreground">{docente.usuario.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {docente.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {docente.telefono}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {docente.especialidad && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            {docente.especialidad}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {docente.maxHorasSemanales} hrs
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(docente.estado)}
                      </TableCell>
                      <TableCell className="space-x-2 flex justify-center">
                        <Link href={show(docente.idDocente).url}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            Ver
                          </Button>
                        </Link>
                        <Link href={edit(docente.idDocente).url}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changeStatusHandler(docente)}
                          className={docente.estado === 'activo' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        >
                          {docente.estado === 'activo' ? 'Desactivar' : 'Activar'}
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