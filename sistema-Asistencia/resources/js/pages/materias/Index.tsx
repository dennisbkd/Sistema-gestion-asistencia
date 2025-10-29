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
  BookOpen,
  Clock,
  School,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { index, create, edit, changeStatus } from '@/routes/materias';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Materias',
    href: index().url,
  },
];

interface Materia {
  idMateria: number;
  sigla: string;
  nombre: string;
  semestre: number;
  horasSemanales: number;
  estado: string;
  created_at: string;
}

interface IndexProps {
  materias: Materia[];
  filters: {
    search: string;
    semestre: string;
    estado: string;
  };
}

export default function Index({ materias: materiasData, filters }: IndexProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedSemestre, setSelectedSemestre] = useState(filters?.semestre || '');
  const [selectedEstado, setSelectedEstado] = useState(filters?.estado || '');

  const { processing, get } = useForm();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedSemestre) params.append('semestre', selectedSemestre);
    if (selectedEstado) params.append('estado', selectedEstado);
    
    get(index().url + `?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedSemestre('');
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

  const changeStatusHandler = (materia: Materia) => {
    const nuevoEstado = materia.estado === 'activo' ? 'inactivo' : 'activo';
    
    router.patch(changeStatus(materia.idMateria).url, {}, {
      onSuccess: () => {
        toast.success(`Materia ${nuevoEstado === 'activo' ? 'activada' : 'desactivada'} exitosamente`);
      },
      onError: () => {
        toast.error('Error al cambiar el estado de la materia');
      },
    });
  };

  const totalMaterias = materiasData.length;
  const materiasActivas = materiasData.filter(m => m.estado === 'activo').length;
  const totalHoras = materiasData.reduce((acc, materia) => acc + materia.horasSemanales, 0);
  const semestresUnicos = [...new Set(materiasData.map(m => m.semestre))].length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Materias" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Materias</h1>
            <p className="text-muted-foreground">
              Administra las materias del sistema académico
            </p>
          </div>

          <Link href={create().url}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Materia
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMaterias}</div>
              <p className="text-xs text-muted-foreground">
                Materias en el sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias Activas</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materiasActivas}</div>
              <p className="text-xs text-muted-foreground">
                +{((materiasActivas / totalMaterias) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Horas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoras}</div>
              <p className="text-xs text-muted-foreground">
                Horas semanales totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Semestres</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{semestresUnicos}</div>
              <p className="text-xs text-muted-foreground">
                Semestres diferentes
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Busca y filtra las materias del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar materias por nombre o sigla..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Todos los semestres</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(sem => (
                  <option key={sem} value={sem.toString()}>Semestre {sem}</option>
                ))}
              </select>

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
              
              {(search || selectedSemestre || selectedEstado) && (
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
            <CardTitle>Lista de Materias</CardTitle>
            <CardDescription>
              Gestiona todas las materias del sistema académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {materiasData.length === 0
                  ? 'No se encontraron materias'
                  : `Lista de ${materiasData.length} materia(s) encontrada(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Horas Semanales</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materiasData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron materias con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  materiasData.map((materia) => (
                    <TableRow key={materia.idMateria} className="hover:bg-muted/50">
                      <TableCell className="font-medium font-mono">
                        {materia.sigla}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          {materia.nombre}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Semestre {materia.semestre}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {materia.horasSemanales} hrs
                        </div>
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(materia.estado)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(materia.created_at).toLocaleDateString('es-BO')}
                      </TableCell>
                      <TableCell className="space-x-2 flex justify-center">
                        <Link href={edit(materia.idMateria).url}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => changeStatusHandler(materia)}
                          className={materia.estado === 'activo' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        >
                          {materia.estado === 'activo' ? 'Desactivar' : 'Activar'}
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