// pages/asignaciones/Detalle.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, BookOpen, Building, User, Users as GroupsIcon } from 'lucide-react';
import { AsignacionDetailProps } from './types/asignaciones';
import asignaciones from '@/routes/asignaciones';

export default function Detalle({ asignacion }: AsignacionDetailProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Asignaciones', href: asignaciones.index().url },
    { title: `Detalle - ${asignacion.materia?.sigla}`, href: '#' },
  ];

    // pages/asignaciones/Detalle.tsx - Añadir esta función
    const formatHora = (horaString: string | undefined) => {
    if (!horaString) return '-';
    
    // Extraer HH:MM del string
    const match = horaString.match(/(\d{2}:\d{2})/);
    return match ? match[1] : horaString;
    };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      finalizado: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge variant="outline" className={colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getModalidadBadge = (modalidad: string) => {
    const colors: Record<string, string> = {
      presencial: 'bg-purple-100 text-purple-800 border-purple-200',
      virtual: 'bg-orange-100 text-orange-800 border-orange-200',
      hibrida: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };

    return (
      <Badge variant="outline" className={colors[modalidad] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
      </Badge>
    );
  };

  const getNombreDia = (diaSemana: number) => {
    const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return dias[diaSemana] || "No definido";
  };

  const getTurnoBadge = (turno: string) => {
    const colors = {
      mañana: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tarde: 'bg-orange-100 text-orange-800 border-orange-200',
      noche: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[turno as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {turno.charAt(0).toUpperCase() + turno.slice(1)}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Detalle Asignación - ${asignacion.materia?.sigla}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Detalle de Asignación
            </h1>
            <p className="text-muted-foreground">
              {asignacion.materia?.sigla} - {asignacion.materia?.nombre}
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
            <Link href={asignaciones.edit(asignacion.idAsignacion).url}>
              <Button>
                Editar Asignación
              </Button>
            </Link>
          </div>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Detalles principales de la asignación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Materia</p>
                    <p className="text-lg font-semibold">{asignacion.materia?.sigla}</p>
                    <p className="text-sm text-muted-foreground">{asignacion.materia?.nombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Docente</p>
                    <p className="text-lg font-semibold">{asignacion.docente?.usuario.name}</p>
                    <p className="text-sm text-muted-foreground">{asignacion.docente?.codigoDocente}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <GroupsIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Grupo</p>
                    <p className="text-lg font-semibold">{asignacion.grupo?.codigoGrupo}</p>
                    <p className="text-sm text-muted-foreground">{getEstadoBadge(asignacion.grupo?.estado || '')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Período</p>
                    <p className="text-lg font-semibold">
                      {asignacion.periodo?.año} - Semestre {asignacion.periodo?.nroSemestre}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {asignacion.periodo?.tipoPeriodo}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Estado */}
          <Card>
            <CardHeader>
              <CardTitle>Estado y Configuración</CardTitle>
              <CardDescription>
                Configuración actual de la asignación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <div className="mt-1">
                    {getEstadoBadge(asignacion.estado)}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Modalidad</p>
                  <div className="mt-1">
                    {getModalidadBadge(asignacion.modalidad)}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estudiantes Inscritos</p>
                  <p className="text-2xl font-bold mt-1">{asignacion.inscritos}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horas Semanales</p>
                  <p className="text-lg font-semibold mt-1">
                    {asignacion.materia?.horasSemanales} horas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Horarios */}
        <Card>
          <CardHeader>
            <CardTitle>Horarios Asignados</CardTitle>
            <CardDescription>
              Horarios y aulas asignadas para esta materia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {asignacion.horarios && asignacion.horarios.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Día</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Aula</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asignacion.horarios.map((horario) => (
                    <TableRow key={horario.idHorarioAsignacion}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          {getNombreDia(horario.bloque?.diaSemana || 0)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          {formatHora(horario.bloque?.horaInicio)} - {formatHora(horario.bloque?.horaFin)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {horario.bloque?.turno ? getTurnoBadge(horario.bloque.turno) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-600" />
                          {horario.aula?.codigoAula || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {horario.aula?.tipo || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {horario.aula?.capacidad || 'N/A'} estudiantes
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(horario.estado)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay horarios asignados para esta materia</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información del Docente */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Docente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                  <p className="font-semibold">{asignacion.docente?.usuario.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Código</p>
                  <p className="font-semibold">{asignacion.docente?.codigoDocente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Especialidad</p>
                  <p className="font-semibold">{asignacion.docente?.especialidad || 'No especificada'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <div>{getEstadoBadge(asignacion.docente?.estado || '')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Materia */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Materia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sigla</p>
                  <p className="font-semibold">{asignacion.materia?.sigla}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="font-semibold">{asignacion.materia?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Semestre</p>
                  <p className="font-semibold">{asignacion.materia?.semestre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horas Semanales</p>
                  <p className="font-semibold">{asignacion.materia?.horasSemanales} horas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}