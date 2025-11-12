import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

import { Calendar, Clock, Building, Users, BookOpen, ArrowRight } from 'lucide-react';
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
  creditos: number;
  horasSemanales: number;
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
}

interface Horario {
  idHorarioAsignacion: number;
  bloque: BloqueHorario;
  aula: Aula;
}

interface Asignacion {
  idAsignacion: number;
  modalidad: string;
  inscritos: number;
  materia: Materia;
  grupo: Grupo;
  horarios: Horario[];
}

interface Props {
  docente: Docente;
  asignaciones: Asignacion[];
  materias: Materia[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Mi Horario',
    href: '/horario',
  },
];

export default function HorarioIndex({ docente, asignaciones, materias }: Props) {
  const getModalidadBadge = (modalidad: string) => {
    const variants = {
      presencial: 'default',
      virtual: 'secondary',
      hibrida: 'outline',
    } as const;

    const colors = {
      presencial: 'bg-blue-100 text-blue-800 border-blue-200',
      virtual: 'bg-purple-100 text-purple-800 border-purple-200',
      hibrida: 'bg-green-100 text-green-800 border-green-200',
    } as const;

    return (
      <Badge
        variant={variants[modalidad as keyof typeof variants] || 'outline'}
        className={colors[modalidad as keyof typeof colors]}
      >
        {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
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


  console.log('Asignaciones:', asignaciones);
  console.log('Docente:', docente);
  console.log('Materias:', materias);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Mi Horario" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mi Horario</h1>
            <p className="text-muted-foreground">
              Horario de materias asignadas - {docente.codigoDocente || 'Docente'}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={horario.semanal().url}>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Vista Semanal
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materias.length}</div>
              <p className="text-xs text-muted-foreground">
                Materias asignadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grupos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{asignaciones.length}</div>
              <p className="text-xs text-muted-foreground">
                Grupos asignados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Semanales</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {asignaciones.reduce((total, asignacion) =>
                  total + asignacion.materia.horasSemanales, 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Horas totales por semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Especialidad</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {docente.especialidad}
              </div>
              <p className="text-xs text-muted-foreground">
                {docente.codigoDocente}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Materias con Horarios */}
        <div className="grid gap-6">
          {asignaciones.map((asignacion) => (
            <Card key={asignacion.idAsignacion}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {asignacion.materia.nombre}
                      {getModalidadBadge(asignacion.modalidad)}
                    </CardTitle>
                    <CardDescription>
                      Código: {asignacion.materia.codigoMateria} •
                      Grupo: {asignacion.grupo.codigoGrupo} •
                      Créditos: {asignacion.materia.creditos} •
                      Horas: {asignacion.materia.horasSemanales}/semana
                    </CardDescription>
                  </div>
                  <Link href={horario.materia(asignacion.materia.idMateria).url}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      Ver Detalle
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {asignacion.horarios.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Horarios asignados:
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {asignacion.horarios.map((horario) => (
                        <div key={horario.idHorarioAsignacion}
                          className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {getDiaSemana(horario.bloque.diaSemana)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatHora(horario.bloque.horaInicio)} - {formatHora(horario.bloque.horaFin)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {horario.aula.codigoAula}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No hay horarios asignados para esta materia.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {asignaciones.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No tienes materias asignadas
                </h3>
                <p className="text-muted-foreground">
                  Actualmente no tienes materias asignadas para el periodo activo.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}