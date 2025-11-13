import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Users, Building, BookOpen, ArrowLeft } from 'lucide-react';
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
import bloquesHorarios from '@/routes/bloques-horarios';
import { MenuExportar } from '@/components/MenuExportar';

// Tipos locales
interface Materia {
  idMateria: number;
  sigla: string;
  nombre: string;
}

interface Usuario {
  name: string;
  email: string;
}

interface Docente {
  idDocente: number;
  codigoDocente: string;
  usuario: Usuario;
}

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
}

interface Aula {
  id: number;
  codigoAula: string;
  capacidad: number;
  tipo: string;
}

interface Asignacion {
  materia: Materia;
  docente: Docente;
  grupo: Grupo;
}

interface HorarioAsignacion {
  idHorarioAsignacion: number;
  estado: string;
  asignacion: Asignacion;
  aula: Aula;
}

interface BloqueHorario {
  idBloque: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  turno: string;
}

interface Props {
  bloque: BloqueHorario;
  horarios: HorarioAsignacion[];
  materias: Materia[];
  docentes: Docente[];
  grupos: Grupo[];
  aulas: Aula[];
  aulasLibres: Aula[];
}

// const diasSemana = [
//   { id: 1, nombre: 'Lunes' },
//   { id: 2, nombre: 'Martes' },
//   { id: 3, nombre: 'Miércoles' },
//   { id: 4, nombre: 'Jueves' },
//   { id: 5, nombre: 'Viernes' },
//   { id: 6, nombre: 'Sábado' },
//   { id: 7, nombre: 'Domingo' },
// ];

export default function Detalle({ 
  bloque, 
  horarios, 
  materias, 
  docentes, 
  grupos, 
  aulas,
  aulasLibres 
}: Props) {
  const [filters, setFilters] = useState({
    materia: '',
    docente: '',
    grupo: '',
    aula: '',
    mostrarAulasLibres: false
  });

// Función getNombreDia mejorada
const getNombreDia = (diaSemana: number | string) => {
  if (diaSemana === '-' || diaSemana === '' || diaSemana === 0) {
    return "No definido";
  }
  
  const numero = Number(diaSemana);
  if (isNaN(numero) || numero < 1 || numero > 7) {
    return "No definido";
  }
  
  const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return dias[numero];
};

// Función para obtener código de aula con fallback
  const getCodigoAula = (aula: Aula) => {
    if (aula.codigoAula && aula.codigoAula !== '-') {
      return aula.codigoAula;
    }
    // Si no hay código, usa el ID o genera uno
    return '-'//`AULA-${aula.id}`;
  };

  const getTurnoBadge = (turno: string) => {
    const colors = {
      mañana: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tarde: 'bg-orange-100 text-orange-800 border-orange-200',
      noche: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[turno as keyof typeof colors]}>
        {turno.charAt(0).toUpperCase() + turno.slice(1)}
      </Badge>
    );
  };

  // Filtrar horarios basado en los filtros
  const filteredHorarios = useMemo(() => {
    return horarios.filter(horario => {
      const matchesMateria = !filters.materia || 
        horario.asignacion.materia.idMateria.toString() === filters.materia;
      const matchesDocente = !filters.docente || 
        horario.asignacion.docente.idDocente.toString() === filters.docente;
      const matchesGrupo = !filters.grupo || 
        horario.asignacion.grupo.idGrupo.toString() === filters.grupo;
      const matchesAula = !filters.aula || 
        horario.aula.id.toString() === filters.aula;

      return matchesMateria && matchesDocente && matchesGrupo && matchesAula;
    });
  }, [horarios, filters]);

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      materia: '',
      docente: '',
      grupo: '',
      aula: '',
      mostrarAulasLibres: false
    });
  };

  const tieneFiltros = Object.values(filters).some(value => value !== '' && value !== false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bloques Horarios', href: bloquesHorarios.index().url },
    { title: `Detalle - ${getNombreDia(bloque.diaSemana)}`, href: '#' },
  ];

  // 🧾 Función para mostrar los filtros en texto legible
  const obtenerFiltrosLegibles = () => {
    const filtroLegible: Record<string, string> = {};

    if (filters.materia) {
      const materia = materias.find(m => m.idMateria.toString() === filters.materia);
      filtroLegible["Materia"] = materia ? `${materia.sigla} - ${materia.nombre}` : "Todas";
    }

    if (filters.docente) {
      const docente = docentes.find(d => d.idDocente.toString() === filters.docente);
      filtroLegible["Docente"] = docente ? docente.usuario.name : "Todos";
    }

    if (filters.grupo) {
      const grupo = grupos.find(g => g.idGrupo.toString() === filters.grupo);
      filtroLegible["Grupo"] = grupo ? grupo.codigoGrupo : "Todos";
    }

    if (filters.aula) {
      const aula = aulas.find(a => a.id.toString() === filters.aula);
      filtroLegible["Aula"] = aula ? getCodigoAula(aula) : "Todas";
    }

    filtroLegible["Mostrar Aulas Libres"] = filters.mostrarAulasLibres ? "Sí" : "No";

    return filtroLegible;
  };

  // 🧾 Estructura de las secciones del PDF
  const seccionesReporte = [
    {
      titulo: "Información del Bloque Horario",
      columnas: ["Día", "Hora Inicio", "Hora Fin", "Turno", "Cantidad Asignaciones"],
      datos: [
        {
          Día: getNombreDia(bloque.diaSemana),
          "Hora Inicio": bloque.horaInicio,
          "Hora Fin": bloque.horaFin,
          Turno: bloque.turno,
          "Cantidad Asignaciones": horarios.length,
        },
      ],
    },
    filters.mostrarAulasLibres
      ? {
          titulo: "Aulas Libres",
          columnas: ["Código Aula", "Capacidad", "Tipo", "Estado"],
          datos: aulasLibres.map((aula) => ({
            "Código Aula": aula.codigoAula,
            Capacidad: aula.capacidad,
            Tipo: aula.tipo,
            Estado: "Disponible",
          })),
        }
      : {
          titulo: "Asignaciones del Bloque",
          columnas: ["Materia", "Docente", "Grupo", "Aula", "Estado"],
          datos: filteredHorarios.map((horario) => ({
            Materia: `${horario.asignacion.materia.sigla} - ${horario.asignacion.materia.nombre}`,
            Docente: horario.asignacion.docente.usuario.name,
            Grupo: horario.asignacion.grupo.codigoGrupo,
            Aula: getCodigoAula(horario.aula),
            Estado: horario.estado,
          })),
        },
  ];

  console.log('Bloque recibido:', bloque);
  console.log('Horarios recibidos:', horarios);
  console.log('Aulas recibidas:', aulas);
  console.log('Aulas libres recibidas:', aulasLibres);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detalle Bloque ${getNombreDia(bloque.diaSemana)}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detalle del Bloque Horario
            </h1>
            <p className="text-muted-foreground">
              {getNombreDia(bloque.diaSemana)} • {bloque.horaInicio} - {bloque.horaFin} • {getTurnoBadge(bloque.turno)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <MenuExportar
              periodo={{ año: 2024, nroSemestre: 2 }} // Puedes ajustar esto según tus datos
              filters={obtenerFiltrosLegibles()}
              secciones={seccionesReporte}
              disabled={filteredHorarios.length === 0 && aulasLibres.length === 0}
            />
            <Button asChild>
              <a href={bloquesHorarios.edit(bloque.idBloque).url}>
                Editar Bloque
              </a>
            </Button>
          </div>
        </div>

        {/* Información del Bloque */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Bloque</CardTitle>
            <CardDescription>
              Detalles del bloque horario seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Día</p>
                  <p className="text-lg font-semibold">{getNombreDia(bloque.diaSemana)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horario</p>
                  <p className="text-lg font-semibold">{bloque.horaInicio} - {bloque.horaFin}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turno</p>
                  <div className="text-lg">
                    {getTurnoBadge(bloque.turno)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Asignaciones</p>
                  <p className="text-lg font-semibold">{horarios.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtra las asignaciones por materia, docente, grupo o aula
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              {/* Materia - CORREGIDO */}
              <Select
                value={filters.materia}
                onValueChange={(value) => handleFilterChange('materia', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {materias.map((materia) => (
                    <SelectItem key={materia.idMateria} value={materia.idMateria.toString()}>
                      {materia.sigla} - {materia.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Docente - CORREGIDO */}
              <Select
                value={filters.docente}
                onValueChange={(value) => handleFilterChange('docente', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los docentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los docentes</SelectItem>
                  {docentes.map((docente) => (
                    <SelectItem key={docente.idDocente} value={docente.idDocente.toString()}>
                      {docente.usuario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Grupo - CORREGIDO */}
              <Select
                value={filters.grupo}
                onValueChange={(value) => handleFilterChange('grupo', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  {grupos.map((grupo) => (
                    <SelectItem key={grupo.idGrupo} value={grupo.idGrupo.toString()}>
                      {grupo.codigoGrupo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Aula - CORREGIDO */}
              <Select
                value={filters.aula}
                onValueChange={(value) => handleFilterChange('aula', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las aulas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las aulas</SelectItem>
                  {aulas.map((aula) => (
                    <SelectItem key={aula.id} value={aula.id.toString()}>
                      {aula.codigoAula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botón Limpiar */}
              <Button 
                variant="outline" 
                onClick={clearFilters}
                disabled={!tieneFiltros}
              >
                Limpiar Filtros
              </Button>
            </div>

            {/* Filtro de Aulas Libres */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="mostrarAulasLibres"
                checked={filters.mostrarAulasLibres}
                onChange={(e) => handleFilterChange('mostrarAulasLibres', e.target.checked )}
                className="rounded border-gray-300"
              />
              <label htmlFor="mostrarAulasLibres" className="text-sm font-medium">
                Mostrar solo aulas libres
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Asignaciones */}
        <Card>
          <CardHeader>
            <CardTitle>
              {filters.mostrarAulasLibres ? 'Aulas Libres' : 'Asignaciones'} 
              ({filters.mostrarAulasLibres ? aulasLibres.length : filteredHorarios.length})
            </CardTitle>
            <CardDescription>
              {filters.mostrarAulasLibres 
                ? 'Aulas disponibles en este horario' 
                : 'Asignaciones activas en este bloque horario'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filters.mostrarAulasLibres ? (
              // Mostrar aulas libres
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código Aula</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aulasLibres.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No hay aulas libres en este horario
                      </TableCell>
                    </TableRow>
                  ) : (
                    aulasLibres.map((aula) => (
                      <TableRow key={aula.id}>
                        <TableCell className="font-medium">{aula.codigoAula}</TableCell>
                        <TableCell>{aula.capacidad}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{aula.tipo}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            ) : (
              // Mostrar asignaciones
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHorarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {tieneFiltros 
                          ? 'No hay asignaciones que coincidan con los filtros' 
                          : 'No hay asignaciones en este horario'
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHorarios.map((horario) => (
                      <TableRow key={horario.idHorarioAsignacion}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <div>
                              <div>{horario.asignacion.materia.sigla}</div>
                              <div className="text-sm text-muted-foreground">
                                {horario.asignacion.materia.nombre}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-600" />
                            {horario.asignacion.docente.usuario.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {horario.asignacion.grupo.codigoGrupo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-purple-600" />
                            {getCodigoAula(horario.aula)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            horario.estado === 'activo' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {horario.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}