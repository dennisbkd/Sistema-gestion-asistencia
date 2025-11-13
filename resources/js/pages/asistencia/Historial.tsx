import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock, BookOpen, Users, Building, Calendar, ArrowLeft } from 'lucide-react';

interface Docente {
  id: number;
  codigoDocente: string;
  especialidad: string;
}

interface Materia {
  idMateria: number;
  sigla: string;
  nombre: string;
}

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
}

interface BloqueHorario {
  idBloque: number;
  horaInicio: string;
  horaFin: string;
  turno: string;
}

interface Asistencia {
  idAsistencia: number;
  fecha: string;
  horaRegistro: string;
  horaClaseInicio: string;
  horaClaseFin: string;
  estado: string;
  minutosRetraso: number;
  justificacion?: string;
  horario_asignacion: {  // Cambié de horarioAsignacion a horario_asignacion
    idHorarioAsignacion: number;
    bloque: BloqueHorario;
  };
  asignacion: {
    materia: Materia;
    grupo: Grupo;
  };
}

interface Props {
  docente: Docente;
  asistencias: {
    data: Asistencia[];
    links: any[];
    current_page: number;
    last_page: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Historial de Asistencia',
    href: '/asistencia/historial',
  },
];

export default function Historial({ docente, asistencias }: Props) {
  const getEstadoBadge = (estado: string) => {
    const variants = {
      presente: 'default',
      tardanza: 'secondary',
      ausente: 'destructive',
      justificado: 'outline',
    } as const;

    const colors = {
      presente: 'bg-green-100 text-green-800 border-green-200',
      tardanza: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ausente: 'bg-red-100 text-red-800 border-red-200',
      justificado: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    const icons = {
      presente: <CheckCircle className="h-3 w-3" />,
      tardanza: <AlertCircle className="h-3 w-3" />,
      ausente: <XCircle className="h-3 w-3" />,
      justificado: <CheckCircle className="h-3 w-3" />,
    } as const;

    return (
      <Badge
        variant={variants[estado as keyof typeof variants] || 'outline'}
        className={`flex items-center gap-1 ${colors[estado as keyof typeof colors]}`}
      >
        {icons[estado as keyof typeof icons]}
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getHorarioFormateado = (horaInicio: string, horaFin: string) => {
    return `${formatHora(horaInicio)} - ${formatHora(horaFin)}`;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Historial de Asistencia" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Historial de Asistencia</h1>
            <p className="text-muted-foreground">
              Consulta tu historial completo de asistencias - {docente.codigoDocente}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/asistencia">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Registro
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Registros de Asistencia</h3>
                  <p className="text-muted-foreground">
                    Total: {asistencias.data.length} registros
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Asistencias */}
        <div className="grid gap-4">
          {asistencias.data.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay registros de asistencia
                </h3>
                <p className="text-muted-foreground">
                  Aún no tienes registros de asistencia en el sistema.
                </p>
              </CardContent>
            </Card>
          ) : (
            asistencias.data.map((asistencia) => (
              <Card key={asistencia.idAsistencia}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {asistencia.asignacion.materia.nombre} ({asistencia.asignacion.materia.sigla})
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Grupo: {asistencia.asignacion.grupo.codigoGrupo}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getHorarioFormateado(asistencia.horaClaseInicio, asistencia.horaClaseFin)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatFecha(asistencia.fecha)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Turno: {asistencia.horario_asignacion.bloque.turno}
                        </span>
                      </CardDescription>
                    </div>
                    {getEstadoBadge(asistencia.estado)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium">Hora de registro</p>
                        <p className="text-sm text-muted-foreground">
                          {formatHora(asistencia.horaRegistro)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hora programada</p>
                        <p className="text-sm text-muted-foreground">
                          {formatHora(asistencia.horaClaseInicio)}
                        </p>
                      </div>
                      {asistencia.minutosRetraso > 0 ? (
                        <div>
                          <p className="text-sm font-medium">Retraso</p>
                          <p className="text-sm text-yellow-600">
                            {asistencia.minutosRetraso} minutos
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">Puntualidad</p>
                          <p className="text-sm text-green-600">
                            Puntual
                          </p>
                        </div>
                      )}
                    </div>

                    {asistencia.justificacion && (
                      <div>
                        <p className="text-sm font-medium">Justificación</p>
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                          {asistencia.justificacion}
                        </p>
                      </div>
                    )}

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <p><strong>ID Registro:</strong> {asistencia.idAsistencia}</p>
                        <p><strong>Modalidad:</strong> {asistencia.asignacion.modalidad}</p>
                      </div>
                      <div>
                        <p><strong>IP Registro:</strong> {asistencia.ip_registro || 'N/A'}</p>
                        <p><strong>Inscritos:</strong> {asistencia.asignacion.inscritos}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Paginación */}
        {asistencias.data.length > 0 && (
          <div className="flex justify-center">
            <nav className="flex gap-1">
              {asistencias.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${link.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground hover:bg-accent'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  preserveScroll
                >
                  {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </AppLayout>
  );
}