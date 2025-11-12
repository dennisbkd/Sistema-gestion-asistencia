import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Calendar, Clock, Building, BookOpen, Users } from 'lucide-react';
import horario from '@/routes/horario';

interface Docente {
  id: number;
  codigoDocente: string;
  especialidad: string;
  usuario: {
    nombre: string;
    correo: string;
  };
}

interface Materia {
  idMateria: number;
  codigoMateria: string;
  nombre: string;
}

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
}

interface BloqueHorario {
  idBloque: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  turno: string;
  nombre_dia: string;
  horario_formateado: string;
}

interface Aula {
  id: number;
  codigoAula: string;
  nombre: string;
  tipo: string;
  capacidad: number;
}

interface HorarioItem {
  asignacion: {
    idAsignacion: number;
    modalidad: string;
    materia: Materia;
    grupo: Grupo;
  };
  horario: {
    idHorarioAsignacion: number;
    estado: string;
  };
  materia: Materia;
  grupo: Grupo;
  bloque: BloqueHorario;
  aula: Aula;
}

interface Props {
  docente: Docente;
  horariosSemana: Record<number, HorarioItem[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Mi Horario',
    href: horario.index().url,
  },
  {
    title: 'Vista Semanal',
    href: '#',
  },
];

export default function HorarioSemanal({ docente, horariosSemana }: Props) {
  const diasSemana = [
    { numero: 1, nombre: 'Lunes' },
    { numero: 2, nombre: 'Martes' },
    { numero: 3, nombre: 'Miércoles' },
    { numero: 4, nombre: 'Jueves' },
    { numero: 5, nombre: 'Viernes' },
    { numero: 6, nombre: 'Sábado' },
    { numero: 7, nombre: 'Domingo' },
  ];

  const getModalidadBadge = (modalidad: string) => {
    const colors = {
      presencial: 'bg-blue-100 text-blue-800 border-blue-200',
      virtual: 'bg-purple-100 text-purple-800 border-purple-200',
      hibrida: 'bg-green-100 text-green-800 border-green-200',
    } as const;

    return (
      <Badge variant="outline" className={`text-xs ${colors[modalidad as keyof typeof colors]}`}>
        {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
      </Badge>
    );
  };

  const getTipoAulaBadge = (tipo: string) => {
    const colors = {
      teorica: 'bg-blue-50 text-blue-700 border-blue-200',
      laboratorio: 'bg-orange-50 text-orange-700 border-orange-200',
      auditorio: 'bg-purple-50 text-purple-700 border-purple-200',
      taller: 'bg-green-50 text-green-700 border-green-200',
    } as const;

    return (
      <Badge variant="outline" className={`text-xs ${colors[tipo as keyof typeof colors]}`}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  // Función para agrupar horarios por hora en cada día
  const organizarHorariosPorHora = (horarios: HorarioItem[]) => {
    return horarios.reduce((acc, horarioItem) => {
      const horaKey = horarioItem.bloque.horario_formateado;
      if (!acc[horaKey]) {
        acc[horaKey] = [];
      }
      acc[horaKey].push(horarioItem);
      return acc;
    }, {} as Record<string, HorarioItem[]>);
  };

  // Obtener todas las horas únicas de la semana para la tabla
  const todasLasHoras = Array.from(
    new Set(
      Object.values(horariosSemana)
        .flat()
        .map(item => item.bloque.horario_formateado)
    )
  ).sort();
  console.log('docente', docente, 'horariosSemana', horariosSemana);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Horario Semanal" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Horario Semanal</h1>
            <p className="text-muted-foreground">
              Vista completa de todos tus horarios organizados por día - {docente.codigoDocente || 'Docente'}
            </p>
          </div>

          <Link href={horario.index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Horario
            </Button>
          </Link>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Días con Clases</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(horariosSemana).length}</div>
              <p className="text-xs text-muted-foreground">Días de la semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Horarios</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(horariosSemana).flat().length}
              </div>
              <p className="text-xs text-muted-foreground">Bloques horarios</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias Diferentes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(
                  Object.values(horariosSemana)
                    .flat()
                    .map(item => item.materia.idMateria)
                ).size}
              </div>
              <p className="text-xs text-muted-foreground">Materias asignadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aulas Diferentes</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(
                  Object.values(horariosSemana)
                    .flat()
                    .map(item => item.aula.id)
                ).size}
              </div>
              <p className="text-xs text-muted-foreground">Aulas utilizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Horario Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Horario Semanal Completo
            </CardTitle>
            <CardDescription>
              Tu horario organizado por días y horas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(horariosSemana).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 text-left bg-muted/50 font-semibold">
                        Horario
                      </th>
                      {diasSemana.map((dia) => (
                        <th key={dia.numero} className="border p-3 text-center bg-muted/50 font-semibold">
                          {dia.nombre}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {todasLasHoras.map((hora) => (
                      <tr key={hora}>
                        <td className="border p-3 text-center font-medium bg-muted/30">
                          {hora}
                        </td>
                        {diasSemana.map((dia) => {
                          const horariosDelDia = horariosSemana[dia.numero] || [];
                          const horariosEnEstaHora = horariosDelDia.filter(
                            item => item.bloque.horario_formateado === hora
                          );

                          return (
                            <td key={dia.numero} className="border p-2 align-top">
                              {horariosEnEstaHora.length > 0 ? (
                                <div className="space-y-2">
                                  {horariosEnEstaHora.map((item) => (
                                    <div
                                      key={item.horario.idHorarioAsignacion}
                                      className="p-3 rounded-lg border bg-card text-card-foreground space-y-2"
                                    >
                                      <div className="space-y-1">
                                        <div className="font-semibold text-sm flex items-center gap-1">
                                          <BookOpen className="h-3 w-3" />
                                          {item.materia.nombre}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Users className="h-3 w-3" />
                                          {item.grupo.codigoGrupo}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Building className="h-3 w-3" />
                                          {item.aula.codigoAula}
                                          {getTipoAulaBadge(item.aula.tipo)}
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        {getModalidadBadge(item.asignacion.modalidad)}
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${item.horario.estado === 'activo'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}
                                        >
                                          {item.horario.estado}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                  -
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay horarios asignados</h3>
                <p>No tienes horarios asignados para el periodo académico actual.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leyenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Leyenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
                <span className="text-sm">Modalidad Presencial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-purple-100 border border-purple-200"></div>
                <span className="text-sm">Modalidad Virtual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                <span className="text-sm">Modalidad Híbrida</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  activo
                </Badge>
                <span className="text-sm">Horario Activo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}