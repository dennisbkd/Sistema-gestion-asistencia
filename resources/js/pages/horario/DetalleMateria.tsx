import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Calendar, Clock, Building, Users, BookOpen, MapPin, User } from 'lucide-react';
import horario from '@/routes/horario';

interface Docente {
  id: number;
  codigoDocente: string;
  especialidad: string;
  telefono: string;
  usuario: {
    nombre: string;
    correo: string;
  };
}

interface PeriodoAcademico {
  idPeriodo: number;
  nombre: string;
  gestion: number;
  semestre: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface Materia {
  idMateria: number;
  codigoMateria: string;
  nombre: string;
  creditos: number;
  horasSemanales: number;
  estado: string;
}

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
  estado: string;
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
  capacidad: number;
  tipo: string;
}

interface Horario {
  idHorarioAsignacion: number;
  bloque: BloqueHorario;
  aula: Aula;
  estado: string;
}

interface Asignacion {
  idAsignacion: number;
  modalidad: string;
  estado: string;
  inscritos: number;
  fechaCreacion: string;
  materia: Materia;
  grupo: Grupo;
  periodo: PeriodoAcademico;
  horarios: Horario[];
}

interface Props {
  docente: Docente;
  asignacion: Asignacion;
}

const breadcrumbs = (asignacion: Asignacion): BreadcrumbItem[] => [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Mi Horario',
    href: '/horario',
  },
  {
    title: `${asignacion.materia.nombre}`,
    href: '#',
  },
];

export default function DetalleMateria({ docente, asignacion }: Props) {
  const getModalidadBadge = (modalidad: string) => {
    const colors = {
      presencial: 'bg-blue-100 text-blue-800 border-blue-200',
      virtual: 'bg-purple-100 text-purple-800 border-purple-200',
      hibrida: 'bg-green-100 text-green-800 border-green-200',
    } as const;

    return (
      <Badge className={colors[modalidad as keyof typeof colors]}>
        {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
      </Badge>
    );
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      finalizado: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
    } as const;

    return (
      <Badge className={colors[estado as keyof typeof colors]}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getTipoAulaBadge = (tipo: string) => {
    const colors = {
      teorica: 'bg-blue-100 text-blue-800 border-blue-200',
      laboratorio: 'bg-orange-100 text-orange-800 border-orange-200',
      auditorio: 'bg-purple-100 text-purple-800 border-purple-200',
      taller: 'bg-green-100 text-green-800 border-green-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[tipo as keyof typeof colors]}>
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  const getDiaSemana = (dia: number) => {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias[dia - 1] || 'Desconocido';
  };

  function formatHora(fechaISO: string) {
    const date = new Date(fechaISO);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Agrupar horarios por día
  const horariosPorDia = asignacion.horarios.reduce((acc, horario) => {
    const dia = horario.bloque.diaSemana;
    if (!acc[dia]) {
      acc[dia] = [];
    }
    acc[dia].push(horario);
    return acc;
  }, {} as Record<number, Horario[]>);

  // Ordenar los días
  const diasOrdenados = Object.keys(horariosPorDia)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <AppLayout breadcrumbs={breadcrumbs(asignacion)}>
      <Head title={`Horario - ${asignacion.materia.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {asignacion.materia.nombre}
            </h1>
            <p className="text-muted-foreground">
              Detalle completo del horario y información de la materia
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={horario.semanal().url}>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Vista Semanal
              </Button>
            </Link>
            <Link href={horario.index().url}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Horario
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta de Información de la Materia */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Información de la Materia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Código de Materia
                      </label>
                      <p className="font-semibold">{asignacion.materia.codigoMateria}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Créditos
                      </label>
                      <p className="font-semibold">{asignacion.materia.creditos}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Estado
                      </label>
                      <div className="mt-1">
                        {getEstadoBadge(asignacion.materia.estado)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Horas Semanales
                      </label>
                      <p className="font-semibold">{asignacion.materia.horasSemanales} horas</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Modalidad
                      </label>
                      <div className="mt-1">
                        {getModalidadBadge(asignacion.modalidad)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Estado Asignación
                      </label>
                      <div className="mt-1">
                        {getEstadoBadge(asignacion.estado)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horarios por Día */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios Asignados
                </CardTitle>
                <CardDescription>
                  Horarios específicos para esta materia y grupo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {asignacion.horarios.length > 0 ? (
                  <div className="space-y-6">
                    {diasOrdenados.map((dia) => (
                      <div key={dia} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3 text-foreground">
                          {getDiaSemana(dia)}
                        </h3>
                        <div className="grid gap-3">
                          {horariosPorDia[dia].map((horario) => (
                            <div key={horario.idHorarioAsignacion}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {formatHora(horario.bloque.horaInicio)} - {formatHora(horario.bloque.horaFin)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  <span>{horario.aula.codigoAula}</span>
                                  {getTipoAulaBadge(horario.aula.tipo)}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Cap: {horario.aula.capacidad} estudiantes
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline" className={
                                horario.estado === 'activo'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }>
                                {horario.estado}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay horarios asignados para esta materia.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar con Información Adicional */}
          <div className="space-y-6">
            {/* Información del Grupo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grupo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Código de Grupo
                  </label>
                  <p className="font-semibold text-lg">{asignacion.grupo.codigoGrupo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estado del Grupo
                  </label>
                  <div className="mt-1">
                    <Badge className={
                      asignacion.grupo.estado === 'activo'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }>
                      {asignacion.grupo.estado}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Estudiantes Inscritos
                  </label>
                  <p className="font-semibold text-lg">{asignacion.inscritos}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Periodo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Periodo Académico
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Periodo
                  </label>
                  <p className="font-semibold">{asignacion.periodo.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Gestión
                  </label>
                  <p className="font-semibold">{asignacion.periodo.gestion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Semestre
                  </label>
                  <p className="font-semibold">{asignacion.periodo.semestre}° Semestre</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Fechas
                  </label>
                  <p className="text-sm">
                    {new Date(asignacion.periodo.fechaInicio).toLocaleDateString('es-ES')} - {' '}
                    {new Date(asignacion.periodo.fechaFin).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información del Docente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Docente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nombre
                  </label>
                  <p className="font-semibold">{docente.codigoDocente}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Código
                  </label>
                  <p className="font-semibold">{docente.codigoDocente}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Especialidad
                  </label>
                  <p className="font-semibold">{docente.especialidad}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Teléfono
                  </label>
                  <p className="text-sm break-all">{docente.telefono}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}