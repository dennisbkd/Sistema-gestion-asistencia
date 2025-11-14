// resources/js/Pages/reportes/Asignaciones.tsx
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
import { ClipboardList, Clock, Building, Filter, RefreshCw, ArrowLeft } from 'lucide-react';
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
    title: 'Reporte de Asignaciones',
    href: '/reportes/asignaciones',
  },
];

interface Horario {
  dia: string;
  hora: string;
  aula: string;
  turno: string;
}

interface Asignacion {
  id: number;
  periodo: string;
  materia: string;
  sigla: string;
  docente: string;
  codigo_docente: string;
  grupo: string;
  modalidad: string;
  inscritos: number;
  total_horas: number;
  horarios: Horario[];
}

interface Props {
  asignaciones: Asignacion[];
  periodos: Array<{ id: number; nombre: string }>;
  materias: Array<{ id: number; nombre: string }>;
  docentes: Array<{ id: number; nombre: string }>;
  filters: any;
  total: number;
}

export default function ReporteAsignaciones({ asignaciones, periodos, materias, docentes, filters, total }: Props) {
  const [filtros, setFiltros] = useState({
    idPeriodo: filters.idPeriodo || 'all',
    idMateria: filters.idMateria || 'all',
    idDocente: filters.idDocente || 'all',
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

    router.get('/reportes/asignaciones', params, {
      preserveState: true,
      onFinish: () => setLoading(false)
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      idPeriodo: 'all',
      idMateria: 'all',
      idDocente: 'all',
    });
    router.get('/reportes/asignaciones');
  };

  const volverAReportes = () => {
    router.get('/reportes');
  };

  // Preparar datos para exportación
  const prepararDatosExportacion = (): ReportData<Record<string, unknown>>[] => {
    const seccionAsignaciones: ReportData<Record<string, unknown>> = {
      titulo: 'Reporte de Asignaciones Activas',
      columnas: ['Periodo', 'Materia', 'Sigla', 'Docente', 'Código Docente', 'Grupo', 'Modalidad', 'Inscritos', 'Horas Semanales', 'Horarios'],
      datos: asignaciones.map(asignacion => ({
        ...asignacion,
        horarios_formateados: asignacion.horarios.map(h => `${h.dia} ${h.hora} - Aula ${h.aula} (${h.turno})`).join('; ')
      })),
      mapearDatos: (item: Record<string, unknown>) => [
        item.periodo as string,
        item.materia as string,
        item.sigla as string,
        item.docente as string,
        item.codigo_docente as string,
        item.grupo as string,
        (item.modalidad as string).charAt(0).toUpperCase() + (item.modalidad as string).slice(1),
        (item.inscritos as number).toString(),
        (item.total_horas as number).toString() + 'h',
        item.horarios_formateados as string
      ]
    };

    return [seccionAsignaciones];
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

    return filtrosPDF;
  };

  const getModalidadBadge = (modalidad: string) => {
    const variants = {
      presencial: 'bg-blue-100 text-blue-800',
      virtual: 'bg-purple-100 text-purple-800',
      hibrida: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={variants[modalidad as keyof typeof variants] || 'bg-gray-100'}>
        {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reporte de Asignaciones" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              {/* Botón Volver */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={volverAReportes}
                className="flex-shrink-0"
                title="Volver a Reportes"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Reporte de Asignaciones</h1>
                <p className="text-muted-foreground">
                  Asignaciones activas con horarios y detalles de materias
                </p>
              </div>
            </div>
            
            {/* Botón de Exportar */}
            <MenuExportar
              filters={prepararFiltrosPDF()}
              secciones={prepararDatosExportacion()}
              disabled={asignaciones.length === 0}
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
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Resultados del Reporte
              </div>
              {total > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {total} asignaciones encontradas
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Lista de asignaciones activas según los filtros aplicados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Cargando reporte...</span>
              </div>
            ) : asignaciones.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos para mostrar. Aplica los filtros para generar el reporte.</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Materia</TableHead>
                      <TableHead>Docente</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Modalidad</TableHead>
                      <TableHead className="text-center">Inscritos</TableHead>
                      <TableHead className="text-center">Horas</TableHead>
                      <TableHead>Horarios</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asignaciones.map((asignacion) => (
                      <TableRow key={asignacion.id}>
                        <TableCell className="font-medium">
                          {asignacion.periodo}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{asignacion.materia}</div>
                          <div className="text-sm text-muted-foreground">
                            {asignacion.sigla}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{asignacion.docente}</div>
                          <div className="text-sm text-muted-foreground">
                            {asignacion.codigo_docente}
                          </div>
                        </TableCell>
                        <TableCell>{asignacion.grupo}</TableCell>
                        <TableCell>{getModalidadBadge(asignacion.modalidad)}</TableCell>
                        <TableCell>
                          <div className="text-center font-medium">
                            {asignacion.inscritos}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center font-medium">
                            {asignacion.total_horas}h
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="space-y-1">
                            {asignacion.horarios.map((horario, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium min-w-[60px]">{horario.dia}</span>
                                <span className="min-w-[100px]">{horario.hora}</span>
                                <Building className="h-3 w-3 text-muted-foreground" />
                                <span className="min-w-[60px]">{horario.aula}</span>
                                <Badge variant="outline" className="text-xs">
                                  {horario.turno}
                                </Badge>
                              </div>
                            ))}
                          </div>
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