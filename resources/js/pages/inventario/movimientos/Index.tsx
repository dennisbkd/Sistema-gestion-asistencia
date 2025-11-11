import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Package,
  User,
  Building
} from 'lucide-react';
import inventario from '@/routes/inventario';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Inventario',
    href: inventario.index().url,
  },
  {
    title: 'Movimientos',
    href: inventario.movimientos.index().url,
  },
];

interface MovimientoInventario {
  id: number;
  tipoMovimiento: 'entrada' | 'salida' | 'transferencia' | 'mantenimiento';
  cantidad: number;
  fechaMovimiento: string;
  observacion: string | null;
  realizadoPor: number;
  idAulaOrigen: number | null;
  idAulaDestino: number | null;
  created_at: string;
  inventario: {
    id: number;
    nombre: string;
    modelo: string | null;
    marca: string | null;
  };
  realizado_por?: {
    id: number;
    name: string;
    email: string;
  };
  aula_origen?: {
    id: number;
    codigoAula: string;
  } | null;
  aula_destino?: {
    id: number;
    codigoAula: string;
  } | null;
}

interface IndexProps {
  movimientos: MovimientoInventario[];
  filters: {
    search: string;
    tipoMovimiento: string;
    fechaDesde: string;
    fechaHasta: string;
  };
  estadisticas: {
    totalMovimientos: number;
    totalEntradas: number;
    totalSalidas: number;
    totalTransferencias: number;
    totalMantenimientos: number;
  };
}

export default function Index({ movimientos: movimientosData, filters, estadisticas }: IndexProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedTipo, setSelectedTipo] = useState(filters?.tipoMovimiento || '');
  const [fechaDesde, setFechaDesde] = useState(filters?.fechaDesde || '');
  const [fechaHasta, setFechaHasta] = useState(filters?.fechaHasta || '');

  const { processing, get } = useForm();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedTipo) params.append('tipoMovimiento', selectedTipo);
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);

    get('/inventario/movimientos' + `?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedTipo('');
    setFechaDesde('');
    setFechaHasta('');
    router.get('/inventario/movimientos');
  };

  const getTipoMovimientoBadge = (tipo: string) => {
    const variants = {
      entrada: 'default',
      salida: 'destructive',
      transferencia: 'secondary',
      mantenimiento: 'outline',
    } as const;

    const colors = {
      entrada: 'bg-green-100 text-green-800 border-green-200',
      salida: 'bg-red-100 text-red-800 border-red-200',
      transferencia: 'bg-blue-100 text-blue-800 border-blue-200',
      mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    } as const;

    const icons = {
      entrada: <ArrowDown className="h-3 w-3" />,
      salida: <ArrowUp className="h-3 w-3" />,
      transferencia: <RefreshCw className="h-3 w-3" />,
      mantenimiento: <Package className="h-3 w-3" />,
    };

    return (
      <Badge
        variant={variants[tipo as keyof typeof variants] || 'outline'}
        className={`flex items-center gap-1 ${colors[tipo as keyof typeof colors]}`}
      >
        {icons[tipo as keyof typeof icons]}
        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Badge>
    );
  };

  const getCantidadDisplay = (movimiento: MovimientoInventario) => {
    const esEntrada = movimiento.tipoMovimiento === 'entrada';
    const esTransferencia = movimiento.tipoMovimiento === 'transferencia';

    return (
      <div className="flex items-center gap-2">
        {esEntrada ? (
          <ArrowDown className="h-4 w-4 text-green-600" />
        ) : movimiento.tipoMovimiento === 'salida' ? (
          <ArrowUp className="h-4 w-4 text-red-600" />
        ) : (
          <RefreshCw className="h-4 w-4 text-blue-600" />
        )}
        <span className={`font-medium ${esEntrada ? 'text-green-700' :
          movimiento.tipoMovimiento === 'salida' ? 'text-red-700' :
            'text-blue-700'
          }`}>
          {movimiento.cantidad} {movimiento.cantidad === 1 ? 'unidad' : 'unidades'}
        </span>
      </div>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-ES');
  };

  const exportarReporte = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedTipo) params.append('tipoMovimiento', selectedTipo);
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);
    params.append('export', 'pdf');

    window.open('/inventario/movimientos/export' + `?${params.toString()}`, '_blank');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Movimientos de Inventario" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Movimientos de Inventario</h1>
            <p className="text-muted-foreground">
              Historial completo de entradas, salidas y transferencias
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={exportarReporte}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Link href={inventario.movimientos.create().url}>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Movimiento
              </Button>
            </Link>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Movimientos</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.totalMovimientos}</div>
              <p className="text-xs text-muted-foreground">
                Movimientos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entradas</CardTitle>
              <ArrowDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estadisticas.totalEntradas}</div>
              <p className="text-xs text-muted-foreground">
                {estadisticas.totalMovimientos > 0 ?
                  ((estadisticas.totalEntradas / estadisticas.totalMovimientos) * 100).toFixed(1) : 0
                }% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salidas</CardTitle>
              <ArrowUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estadisticas.totalSalidas}</div>
              <p className="text-xs text-muted-foreground">
                {estadisticas.totalMovimientos > 0 ?
                  ((estadisticas.totalSalidas / estadisticas.totalMovimientos) * 100).toFixed(1) : 0
                }% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transferencias</CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estadisticas.totalTransferencias}</div>
              <p className="text-xs text-muted-foreground">
                Movimientos entre aulas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mantenimientos</CardTitle>
              <Package className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{estadisticas.totalMantenimientos}</div>
              <p className="text-xs text-muted-foreground">
                Items en mantenimiento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Filtra los movimientos por tipo, fecha o item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger>
                    <SelectValue placeholder={"Todos los tipos"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'0'}>Todos los tipos</SelectItem>
                    <SelectItem value="entrada">Entradas</SelectItem>
                    <SelectItem value="salida">Salidas</SelectItem>
                    <SelectItem value="transferencia">Transferencias</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimientos</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  placeholder="Desde"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />

                <Input
                  type="date"
                  placeholder="Hasta"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Aplicar Filtros
                </Button>

                {(search || selectedTipo || fechaDesde || fechaHasta) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClearFilters}
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Movimientos */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Movimientos</CardTitle>
            <CardDescription>
              Lista completa de todos los movimientos registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {movimientosData.length === 0
                  ? 'No se encontraron movimientos'
                  : `Mostrando ${movimientosData.length} movimiento(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Origen/Destino</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimientosData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron movimientos con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  movimientosData.map((movimiento) => (
                    <TableRow key={movimiento.id} className="hover:bg-muted/50">
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {formatFecha(movimiento.fechaMovimiento)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{movimiento.inventario.nombre}</div>
                          {movimiento.inventario.modelo && (
                            <div className="text-xs text-muted-foreground">
                              {movimiento.inventario.modelo}
                              {movimiento.inventario.marca && ` • ${movimiento.inventario.marca}`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTipoMovimientoBadge(movimiento.tipoMovimiento)}
                      </TableCell>
                      <TableCell>
                        {getCantidadDisplay(movimiento)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {movimiento.tipoMovimiento === 'transferencia' ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">De: {movimiento.aula_origen?.codigoAula || 'N/A'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">A: {movimiento.aula_destino?.codigoAula || 'N/A'}</span>
                              </div>
                            </>
                          ) : movimiento.tipoMovimiento === 'entrada' ? (
                            <div className="text-xs text-muted-foreground">
                              Entrada al almacén
                            </div>
                          ) : movimiento.tipoMovimiento === 'salida' ? (
                            <div className="text-xs text-muted-foreground">
                              Salida del almacén
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              Mantenimiento
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            {movimiento.realizado_por?.name || 'Sistema'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {movimiento.observacion ? (
                            <p className="text-sm text-muted-foreground truncate">
                              {movimiento.observacion}
                            </p>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin observaciones</span>
                          )}
                        </div>
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