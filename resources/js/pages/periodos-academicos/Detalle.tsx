import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Users, Layers } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MenuExportar } from '@/components/MenuExportar';

interface Materia {
  idMateria: number;
  sigla: string;
  nombre: string;
  semestre: number;
  horasSemanales: number;
  estado: string;
  asignaciones_count?: number;
}

interface Docente {
  idDocente: number;
  codigoDocente: string;
  especialidad: string;
  estado: string;
  usuario: {
    name: string;
    email: string;
  };
  asignaciones_count?: number;
}

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
  estado: string;
  asignaciones_count?: number;
}

interface DetalleProps {
  periodo: {
    idPeriodo: number;
    nroSemestre: number;
    año: number;
    estado: string;
  };
  materias: Materia[];
  docentes: Docente[];
  grupos: Grupo[];
  filters?: {
    materia?: string;
    docente?: string;
    grupo?: string;
  };
}

// Tipo común para el reporte
// type DatoReporte = Record<string, string | number | boolean>;
// type DatoReporte = Materia | Docente | Grupo;
type DatoReporte = Record<string, unknown>;

const breadcrumbs = (periodo: DetalleProps['periodo']): BreadcrumbItem[] => [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Períodos Académicos', href: '/periodos-academicos' },
  { title: `Detalle - ${periodo.año}-${periodo.nroSemestre}`, href: `/periodos-academicos/${periodo.idPeriodo}/detalle` },
];

export default function Detalle({ periodo, materias, docentes, grupos, filters }: DetalleProps) {
  // Estado local para manejar filtros sin recargar
  const [localFilters, setLocalFilters] = useState({
    materia: filters?.materia || '',
    docente: filters?.docente || '',
    grupo: filters?.grupo || '',
  });

  // Función que actualiza un filtro local
  const handleInputChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Función que aplica los filtros (recarga la página con los filtros activos)
  const applyFilters = () => {
    router.get(`/periodos-academicos/${periodo.idPeriodo}/detalle`, localFilters, {
      preserveState: true,
      replace: true,
    });
  };

  // Limpia filtros
  const clearFilters = () => {
    setLocalFilters({ materia: '', docente: '', grupo: '' });
    router.get(`/periodos-academicos/${periodo.idPeriodo}/detalle`, {}, {
      preserveState: true,
      replace: true,
    });
  };

  // Badge de estado
  const getEstadoBadge = (estado: string) => {
    const colors = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      finalizado: 'bg-blue-100 text-blue-800 border-blue-200',
      planificado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[estado as keyof typeof colors]}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const obtenerFiltrosLegibles = () => {
    const filtrosLegibles: Record<string, string> = {};

    if (localFilters.materia && localFilters.materia !== 'all') {
      const materia = materias.find(m => m.idMateria.toString() === localFilters.materia);
      filtrosLegibles.materia = materia ? `${materia.sigla} - ${materia.nombre}` : localFilters.materia;
    }

    if (localFilters.docente && localFilters.docente !== 'null') {
      const docente = docentes.find(d => d.idDocente.toString() === localFilters.docente);
      filtrosLegibles.docente = docente ? docente.usuario.name : localFilters.docente;
    }

    if (localFilters.grupo && localFilters.grupo !== 'null') {
      const grupo = grupos.find(g => g.idGrupo.toString() === localFilters.grupo);
      filtrosLegibles.grupo = grupo ? grupo.codigoGrupo : localFilters.grupo;
    }

    return filtrosLegibles;
  };

  // Datos para el reporte PDF - Usando mapeo personalizado
  const seccionesReporte = [
    // Sección de Materias
    {
      titulo: 'Materias del Período Académico',
      columnas: ['Sigla', 'Nombre', 'Semestre', 'Horas Semanales', 'Estado', 'Asignaciones'],
      datos: materias,
      mapearDatos: (materia: Materia) => [
        materia.sigla,
        materia.nombre,
        materia.semestre,
        `${materia.horasSemanales} hrs`,
        materia.estado.charAt(0).toUpperCase() + materia.estado.slice(1),
        materia.asignaciones_count || 0
      ]
    },
    // Sección de Docentes
    {
      titulo: 'Docentes del Período Académico',
      columnas: ['Código', 'Nombre', 'Email', 'Especialidad', 'Estado', 'Asignaciones'],
      datos: docentes,
      mapearDatos: (docente: Docente) => [
        docente.codigoDocente,
        docente.usuario.name,
        docente.usuario.email,
        docente.especialidad,
        docente.estado.charAt(0).toUpperCase() + docente.estado.slice(1),
        docente.asignaciones_count || 0
      ]
    },
    // Sección de Grupos
    {
      titulo: 'Grupos del Período Académico',
      columnas: ['Código', 'Estado', 'Asignaciones'],
      datos: grupos,
      mapearDatos: (grupo: Grupo) => [
        grupo.codigoGrupo,
        grupo.estado.charAt(0).toUpperCase() + grupo.estado.slice(1),
        grupo.asignaciones_count || 0
      ]
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs(periodo)}>
      <Head title={`Detalle Período ${periodo.año}-${periodo.nroSemestre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header con título y botón de exportar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Período Académico {periodo.año}-{periodo.nroSemestre}
            </h1>
            <p className="text-muted-foreground">
              Detalle completo de materias, docentes y grupos asignados
            </p>
          </div>
          <MenuExportar<DatoReporte>
            periodo={{ año: periodo.año, nroSemestre: periodo.nroSemestre }}
            filters={obtenerFiltrosLegibles()}
            secciones={seccionesReporte}
            disabled={materias.length === 0 && docentes.length === 0 && grupos.length === 0}
          />
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtra por grupo, materia o docente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Materia */}
              <Select
                defaultValue={localFilters.materia || 'all'}
                onValueChange={(value) => handleInputChange('materia', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {materias.map((m) => (
                    <SelectItem key={m.idMateria} value={m.idMateria.toString()}>
                      {m.sigla} - {m.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Grupo */}
              <Select
                value={localFilters.grupo || ''}
                onValueChange={(value) => handleInputChange('grupo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Todos</SelectItem>
                  {grupos.map((g) => (
                    <SelectItem key={g.idGrupo} value={g.idGrupo.toString()}>
                      {g.codigoGrupo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Docente */}
              <Select
                value={localFilters.docente || ''}
                onValueChange={(value) => handleInputChange('docente', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar docente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Todos</SelectItem>
                  {docentes.map((d) => (
                    <SelectItem key={d.idDocente} value={d.idDocente.toString()}>
                      {d.usuario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botones */}
              <div className="flex gap-2">
                <Button onClick={applyFilters}>Aplicar filtros</Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resto del código permanece igual... */}
        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materias.length}</div>
              <p className="text-xs text-muted-foreground">Materias asignadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Docentes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{docentes.length}</div>
              <p className="text-xs text-muted-foreground">Docentes asignados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Grupos</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{grupos.length}</div>
              <p className="text-xs text-muted-foreground">Grupos activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Materias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Materias del Período
            </CardTitle>
            <CardDescription>
              Lista de materias asignadas en este período académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Horas Semanales</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay materias que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  materias.map((materia) => (
                    <TableRow key={materia.idMateria}>
                      <TableCell className="font-mono">{materia.sigla}</TableCell>
                      <TableCell>{materia.nombre}</TableCell>
                      <TableCell>{materia.semestre}</TableCell>
                      <TableCell>{materia.horasSemanales} hrs</TableCell>
                      <TableCell>{getEstadoBadge(materia.estado)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{materia.asignaciones_count || 0}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Docentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Docentes del Período
            </CardTitle>
            <CardDescription>
              Lista de docentes asignados en este período académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docentes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay docentes que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  docentes.map((docente) => (
                    <TableRow key={docente.idDocente}>
                      <TableCell>{docente.codigoDocente}</TableCell>
                      <TableCell>{docente.usuario.name}</TableCell>
                      <TableCell>{docente.usuario.email}</TableCell>
                      <TableCell>{docente.especialidad}</TableCell>
                      <TableCell>{getEstadoBadge(docente.estado)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{docente.asignaciones_count || 0}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Grupos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Grupos del Período
            </CardTitle>
            <CardDescription>Lista de grupos activos en este período académico</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Asignaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grupos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No hay grupos que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  grupos.map((grupo) => (
                    <TableRow key={grupo.idGrupo}>
                      <TableCell>{grupo.codigoGrupo}</TableCell>
                      <TableCell>{getEstadoBadge(grupo.estado)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{grupo.asignaciones_count || 0}</Badge>
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