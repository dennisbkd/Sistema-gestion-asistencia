import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  User,
  Clock,
  Monitor,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface Bitacora {
  id: number;
  accion: string;
  modulo: string;
  submodulo: string | null;
  descripcion: string;
  ip: string | null;
  user_agent: string | null;
  metodo_http: string | null;
  ruta: string | null;
  datos_antes: any;
  datos_despues: any;
  parametros: any;
  referencia_id: string | null;
  estado: string;
  error: string | null;
  created_at: string;
  usuario: Usuario | null;
}

interface Props {
  bitacoras: {
    data: Bitacora[];
    links: any[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filtros: {
    modulo?: string;
    accion?: string;
    estado?: string;
    fecha_desde?: string;
    fecha_hasta?: string;
    usuario_id?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Bitácora del Sistema',
    href: '/bitacora',
  },
];

const modulos = [
  'ASISTENCIA',
  'USUARIO',
  'DOCENTE',
  'MATERIA',
  'GRUPO',
  'AULA',
  'HORARIO',
  'PERIODO'
];

const acciones = [
  'CREAR',
  'ACTUALIZAR',
  'ELIMINAR',
  'GENERAR_QR',
  'ESCANEAR_QR',
  'JUSTIFICAR_FALTA',
  'LOGIN',
  'LOGOUT'
];

const estados = [
  'exitoso',
  'fallido'
];

export default function BitacoraIndex({ bitacoras, filtros: initialFiltros }: Props) {
  const [filtros, setFiltros] = useState({
    modulo: initialFiltros.modulo || '',
    accion: initialFiltros.accion || '',
    estado: initialFiltros.estado || '',
    fecha_desde: initialFiltros.fecha_desde || '',
    fecha_hasta: initialFiltros.fecha_hasta || '',
    usuario_id: initialFiltros.usuario_id || '',
    search: ''
  });

  const [detalleVisible, setDetalleVisible] = useState<number | null>(null);

  const aplicarFiltros = () => {
    router.get('/bitacora', filtros, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = {
      modulo: '',
      accion: '',
      estado: '',
      fecha_desde: '',
      fecha_hasta: '',
      usuario_id: '',
      search: ''
    };
    setFiltros(filtrosLimpios);
    router.get('/bitacora', filtrosLimpios, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const getEstadoBadge = (estado: string) => {
    const config = {
      exitoso: {
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-3 w-3" />
      },
      fallido: {
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-3 w-3" />
      }
    };

    const configEstado = config[estado as keyof typeof config] || {
      variant: 'outline' as const,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <AlertCircle className="h-3 w-3" />
    };

    return (
      <Badge
        variant={configEstado.variant}
        className={`flex items-center gap-1 ${configEstado.className}`}
      >
        {configEstado.icon}
        {estado.toUpperCase()}
      </Badge>
    );
  };

  console.log(bitacoras);

  const getAccionColor = (accion: string) => {
    const colores: { [key: string]: string } = {
      CREAR: 'bg-blue-100 text-blue-800 border-blue-200',
      ACTUALIZAR: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ELIMINAR: 'bg-red-100 text-red-800 border-red-200',
      GENERAR_QR: 'bg-purple-100 text-purple-800 border-purple-200',
      ESCANEAR_QR: 'bg-green-100 text-green-800 border-green-200',
      JUSTIFICAR_FALTA: 'bg-orange-100 text-orange-800 border-orange-200',
      LOGIN: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      LOGOUT: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return colores[accion] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const exportarBitacora = () => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    window.open(`/bitacora/exportar?${params.toString()}`, '_blank');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Bitácora del Sistema" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bitácora del Sistema</h1>
            <p className="text-muted-foreground">
              Registro completo de todas las actividades del sistema
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={exportarBitacora}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button
              onClick={() => router.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Módulo */}
              <div className="space-y-2">
                <Label htmlFor="modulo">Módulo</Label>
                <Select
                  value={filtros.modulo}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, modulo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los módulos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos los módulos</SelectItem>
                    {modulos.map(modulo => (
                      <SelectItem key={modulo} value={modulo}>
                        {modulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Acción */}
              <div className="space-y-2">
                <Label htmlFor="accion">Acción</Label>
                <Select
                  value={filtros.accion}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, accion: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las acciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todas las acciones</SelectItem>
                    {acciones.map(accion => (
                      <SelectItem key={accion} value={accion}>
                        {accion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={filtros.estado}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, estado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todos los estados</SelectItem>
                    {estados.map(estado => (
                      <SelectItem key={estado} value={estado}>
                        {estado.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Búsqueda */}
              <div className="space-y-2">
                <Label htmlFor="search">Búsqueda</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Buscar en descripción..."
                    value={filtros.search}
                    onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_desde">Fecha desde</Label>
                <Input
                  id="fecha_desde"
                  type="date"
                  value={filtros.fecha_desde}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fecha_desde: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_hasta">Fecha hasta</Label>
                <Input
                  id="fecha_hasta"
                  type="date"
                  value={filtros.fecha_hasta}
                  onChange={(e) => setFiltros(prev => ({ ...prev, fecha_hasta: e.target.value }))}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={aplicarFiltros} className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
                <Button onClick={limpiarFiltros} variant="outline">
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Registros</p>
                  <p className="text-2xl font-bold">{bitacoras.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exitosos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bitacoras.data.filter(b => b.estado === 'exitoso').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fallidos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {bitacoras.data.filter(b => b.estado === 'fallido').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Página Actual</p>
                  <p className="text-2xl font-bold">
                    {bitacoras.current_page} / {bitacoras.last_page}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Bitácora */}
        <Card>
          <CardHeader>
            <CardTitle>Registros de Actividad</CardTitle>
            <CardDescription>
              {bitacoras.data.length} registros encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bitacoras.data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No se encontraron registros de bitácora
                      </TableCell>
                    </TableRow>
                  ) : (
                    bitacoras.data.map((bitacora) => (
                      <TableRow key={bitacora.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatFecha(bitacora.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {bitacora.usuario ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{bitacora.usuario.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {bitacora.usuario.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Sistema</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{bitacora.modulo}</p>
                            {bitacora.submodulo && (
                              <p className="text-sm text-muted-foreground">
                                {bitacora.submodulo}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAccionColor(bitacora.accion)}>
                            {bitacora.accion}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate" title={bitacora.descripcion}>
                            {bitacora.descripcion}
                          </p>
                          {bitacora.referencia_id && (
                            <p className="text-sm text-muted-foreground">
                              Ref: {bitacora.referencia_id}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          {getEstadoBadge(bitacora.estado)}
                        </TableCell>
                        <TableCell>
                          {bitacora.ip ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {bitacora.ip}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDetalleVisible(
                              detalleVisible === bitacora.id ? null : bitacora.id
                            )}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Detalles Expandibles */}
            {bitacoras.data.map((bitacora) => (
              detalleVisible === bitacora.id && (
                <Card key={`detalle-${bitacora.id}`} className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Detalles del Registro #{bitacora.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Información General */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Información General</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Método HTTP:</span>
                            <Badge variant="outline">
                              {bitacora.metodo_http || 'N/A'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ruta:</span>
                            <span className="font-mono text-sm">
                              {bitacora.ruta || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">User Agent:</span>
                            <span className="text-sm">
                              {bitacora.user_agent || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Datos de la Operación */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Datos de la Operación</h4>
                        {bitacora.error && (
                          <div>
                            <p className="text-sm font-medium text-red-600">Error:</p>
                            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                              {bitacora.error}
                            </p>
                          </div>
                        )}
                        {bitacora.datos_antes && (
                          <div>
                            <p className="text-sm font-medium">Datos Antes:</p>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                              {JSON.stringify(bitacora.datos_antes, null, 2)}
                            </pre>
                          </div>
                        )}
                        {bitacora.datos_despues && (
                          <div>
                            <p className="text-sm font-medium">Datos Después:</p>
                            <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                              {JSON.stringify(bitacora.datos_despues, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}

            {/* Paginación */}
            {bitacoras.data.length > 0 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando página {bitacoras.current_page} de {bitacoras.last_page}
                </p>
                <nav className="flex gap-1">
                  {bitacoras.links.map((link, index) => (
                    <Button
                      key={index}
                      variant={link.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => link.url && router.get(link.url)}
                      disabled={!link.url || link.active}
                    >
                      {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </Button>
                  ))}
                </nav>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}