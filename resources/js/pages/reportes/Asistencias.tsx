// resources/js/Pages/reportes/Asistencias.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Building, Filter, RefreshCw } from 'lucide-react';
import { MenuExportar } from '@/components/MenuExportar';
import { ReportData } from '@/components/services/servicePDF';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Reportes',
    href: '/reportes',
  },
  {
    title: 'Reporte de Asistencias',
    href: '/reportes/asistencias',
  },
];

interface Asistencia {
  id: number;
  fecha: string;
  hora_clase: string;
  hora_registro: string;
  estado: string;
  minutos_retraso: number;
  justificacion: string;
  periodo: string;
  materia: string;
  docente: string;
  grupo: string;
  aula: string;
  dia_semana: string;
}

interface Props {
  asistencias: Asistencia[];
  periodos: Array<{ id: number; nombre: string }>;
  materias: Array<{ id: number; nombre: string }>;
  docentes: Array<{ id: number; nombre: string }>;
  filters: any;
  total: number;
}

export default function ReporteAsistencias({ asistencias, periodos, materias, docentes, filters, total }: Props) {
  const [filtros, setFiltros] = useState({
    idPeriodo: filters.idPeriodo || 'all',
    idMateria: filters.idMateria || 'all',
    idDocente: filters.idDocente || 'all',
    fechaInicio: filters.fechaInicio || '',
    fechaFin: filters.fechaFin || ''
  });
  const [loading, setLoading] = useState(false);

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const aplicarFiltros = () => {
    setLoading(true);
    const params: any = {};
    
    if (filtros.idPeriodo !== 'all') params.idPeriodo = filtros.idPeriodo;
    if (filtros.idMateria !== 'all') params.idMateria = filtros.idMateria;
    if (filtros.idDocente !== 'all') params.idDocente = filtros.idDocente;
    if (filtros.fechaInicio) params.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) params.fechaFin = filtros.fechaFin;

    router.get('/reportes/asistencias', params, {
      preserveState: true,
      onFinish: () => setLoading(false)
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      idPeriodo: 'all',
      idMateria: 'all',
      idDocente: 'all',
      fechaInicio: '',
      fechaFin: ''
    });
    router.get('/reportes/asistencias');
  };

  // Preparar datos para exportación
  const prepararDatosExportacion = (): ReportData<Record<string, unknown>>[] => {
    const seccionAsistencias: ReportData<Record<string, unknown>> = {
      titulo: 'Reporte Detallado de Asistencias',
      columnas: ['Fecha', 'Día', 'Docente', 'Materia', 'Grupo', 'Horario Clase', 'Hora Registro', 'Aula', 'Estado', 'Minutos Retraso', 'Justificación', 'Periodo'],
      datos: asistencias.map(asistencia => ({
        ...asistencia,
        estado_formateado: asistencia.estado.charAt(0).toUpperCase() + asistencia.estado.slice(1),
        retraso_formateado: asistencia.minutos_retraso > 0 ? `${asistencia.minutos_retraso} min` : '-',
        justificacion_formateada: asistencia.justificacion || '-'
      })),
      mapearDatos: (item: Record<string, unknown>) => [
        item.fecha as string,
        item.dia_semana as string,
        item.docente as string,
        item.materia as string,
        item.grupo as string,
        item.hora_clase as string,
        item.hora_registro as string,
        item.aula as string,
        item.estado_formateado as string,
        item.retraso_formateado as string,
        item.justificacion_formateada as string,
        item.periodo as string
      ]
    };

    return [seccionAsistencias];
  };

  // Preparar filtros para el PDF
  const prepararFiltrosPDF = () => {
    const filtrosPDF: Record<string, string> = {};

    if (filtros.idPeriodo && filtros.idPeriodo !== 'all') {
      const periodo = periodos.find(p => p.id.toString() === filtros.idPeriodo);
      if (periodo) {
        filtrosPDF['Periodo académico'] = periodo.nombre;
      }
    }

    if (filtros.idMateria && filtros.idMateria !== 'all') {
      const materia = materias.find(m => m.id.toString() === filtros.idMateria);
      if (materia) {
        filtrosPDF['Materia'] = materia.nombre;
      }
    }

    if (filtros.idDocente && filtros.idDocente !== 'all') {
      const docente = docentes.find(d => d.id.toString() === filtros.idDocente);
      if (docente) {
        filtrosPDF['Docente'] = docente.nombre;
      }
    }

    if (filtros.fechaInicio) {
      filtrosPDF['Fecha inicio'] = filtros.fechaInicio;
    }

    if (filtros.fechaFin) {
      filtrosPDF['Fecha fin'] = filtros.fechaFin;
    }

    return filtrosPDF;
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      presente: 'bg-green-100 text-green-800',
      ausente: 'bg-red-100 text-red-800',
      tardanza: 'bg-yellow-100 text-yellow-800',
      justificado: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[estado as keyof typeof variants] || 'bg-gray-100'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reporte de Asistencias" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reporte de Asistencias</h1>
              <p className="text-muted-foreground">
                Reporte detallado de registros de asistencia con filtros avanzados
              </p>
            </div>
            
            {/* Botón de Exportar */}
            <MenuExportar
              filters={prepararFiltrosPDF()}
              secciones={prepararDatosExportacion()}
              disabled={asistencias.length === 0}
            />
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros del Reporte
            </CardTitle>
            <CardDescription>
              Selecciona los criterios para filtrar el reporte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filtro Periodo */}
              <div className="space-y-2">
                <Label htmlFor="periodo">Periodo Académico</Label>
                <Select
                  value={filtros.idPeriodo}
                  onValueChange={(value) => handleFiltroChange('idPeriodo', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los periodos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los periodos</SelectItem>
                    {periodos.map((periodo) => (
                      <SelectItem key={periodo.id} value={periodo.id.toString()}>
                        {periodo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Materia */}
              <div className="space-y-2">
                <Label htmlFor="materia">Materia</Label>
                <Select
                  value={filtros.idMateria}
                  onValueChange={(value) => handleFiltroChange('idMateria', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las materias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las materias</SelectItem>
                    {materias.map((materia) => (
                      <SelectItem key={materia.id} value={materia.id.toString()}>
                        {materia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Docente */}
              <div className="space-y-2">
                <Label htmlFor="docente">Docente</Label>
                <Select
                  value={filtros.idDocente}
                  onValueChange={(value) => handleFiltroChange('idDocente', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los docentes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los docentes</SelectItem>
                    {docentes.map((docente) => (
                      <SelectItem key={docente.id} value={docente.id.toString()}>
                        {docente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Botones */}
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <div className="flex gap-2">
                  <Button 
                    onClick={aplicarFiltros} 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Filter className="h-4 w-4" />
                    )}
                    {loading ? 'Aplicando...' : 'Aplicar Filtros'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={limpiarFiltros}
                    disabled={loading}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>

            {/* Filtros de fecha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filtros.fechaInicio}
                  onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <input
                  type="date"
                  id="fechaFin"
                  value={filtros.fechaFin}
                  onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resultados del Reporte
              </div>
              {total > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {total} registros encontrados
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Lista detallada de registros de asistencia según los filtros aplicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Cargando reporte...</span>
              </div>
            ) : asistencias.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos para mostrar. Aplica los filtros para generar el reporte.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Materia</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Aula</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Retraso</TableHead>
                      <TableHead>Justificación</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asistencias.map((asistencia) => (
                      <TableRow key={asistencia.id}>
                        <TableCell className="font-medium">
                          <div>{asistencia.fecha}</div>
                          <div className="text-sm text-muted-foreground">
                            {asistencia.dia_semana}
                          </div>
                        </TableCell>
                        <TableCell>{asistencia.docente}</TableCell>
                        <TableCell>{asistencia.materia}</TableCell>
                        <TableCell>{asistencia.grupo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {asistencia.hora_clase}
                          </div>
                          {asistencia.hora_registro !== 'No registrado' && (
                            <div className="text-xs text-muted-foreground">
                              Reg: {asistencia.hora_registro}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {asistencia.aula}
                          </div>
                        </TableCell>
                        <TableCell>{getEstadoBadge(asistencia.estado)}</TableCell>
                        <TableCell>
                          {asistencia.minutos_retraso > 0 ? (
                            <span className="text-yellow-600 font-medium">
                              {asistencia.minutos_retraso} min
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {asistencia.justificacion || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}