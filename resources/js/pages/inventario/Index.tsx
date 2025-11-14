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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  MoreHorizontal,
  BarChart3,
  Move,
  History,
  ArrowRight
} from 'lucide-react';
import inventario from '@/routes/inventario';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Gestión de Inventario',
    href: inventario.index().url,
  },
];

interface Inventario {
  id: number;
  nombre: string;
  modelo: string | null;
  marca: string | null;
  stockTotal: number;
  activo: boolean;
  estado: string;
  registradoPor: number | null;
  created_at: string;
  updated_at: string;
}

interface IndexProps {
  inventario: Inventario[];
  filters: {
    search: string;
    estado: string;
    activo: string;
  };
}

export default function Index({ inventario: inventarioData, filters }: IndexProps) {
  const [search, setSearch] = useState(filters?.search || '');
  const [selectedEstado, setSelectedEstado] = useState(filters?.estado || '');
  const [selectedActivo, setSelectedActivo] = useState(filters?.activo || '');

  const { processing, get } = useForm();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedEstado) params.append('estado', selectedEstado);
    if (selectedActivo) params.append('activo', selectedActivo);

    get('/inventario' + `?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedEstado('');
    setSelectedActivo('');
    router.get('/inventario');
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      disponible: 'default',
      agotado: 'destructive',
      mantenimiento: 'secondary',
    } as const;

    const colors = {
      disponible: 'bg-green-100 text-green-800 border-green-200',
      agotado: 'bg-red-100 text-red-800 border-red-200',
      mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    } as const;

    return (
      <Badge
        variant={variants[estado as keyof typeof variants] || 'outline'}
        className={colors[estado as keyof typeof colors]}
      >
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getStockBadge = (stock: number, estado: string) => {
    if (estado === 'agotado') {
      return <Badge variant="destructive">Agotado</Badge>;
    }

    if (stock === 0) {
      return <Badge variant="destructive">Sin stock</Badge>;
    } else if (stock < 10) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Bajo: {stock}
      </Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Stock: {stock}
      </Badge>;
    }
  };

  const getActivoBadge = (activo: boolean) => {
    return activo ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary">Inactivo</Badge>
    );
  };

  // Estadísticas
  const totalItems = inventarioData.length;
  const itemsActivos = inventarioData.filter(item => item.activo).length;
  const itemsDisponibles = inventarioData.filter(item => item.estado === 'disponible').length;
  const stockTotal = inventarioData.reduce((acc, item) => acc + item.stockTotal, 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Inventario" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Inventario</h1>
            <p className="text-muted-foreground">
              Administra el inventario de equipos y recursos del sistema
            </p>
          </div>

          <div className="flex gap-2">
            {can('view movimientos') && (
              <Link href={inventario.movimientos.index().url}>
                <Button variant="outline" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Movimientos
                </Button>
              </Link>
            )}
            {can('create inventario') && (
              <Link href={inventario.create().url}>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Item
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                Items en inventario
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Activos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{itemsActivos}</div>
              <p className="text-xs text-muted-foreground">
                {((itemsActivos / totalItems) * 100).toFixed(1)}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{itemsDisponibles}</div>
              <p className="text-xs text-muted-foreground">
                Items disponibles para uso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockTotal}</div>
              <p className="text-xs text-muted-foreground">
                Unidades en inventario
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros y Búsqueda</CardTitle>
            <CardDescription>
              Busca y filtra los items del inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, modelo o marca..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="flex h-10 w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="agotado">Agotado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>

                <select
                  value={selectedActivo}
                  onChange={(e) => setSelectedActivo(e.target.value)}
                  className="flex h-10 w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>

                {(search || selectedEstado || selectedActivo) && (
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

        {/* Lista de Inventario */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Inventario</CardTitle>
            <CardDescription>
              Gestiona todos los items del inventario del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                {inventarioData.length === 0
                  ? 'No se encontraron items en el inventario'
                  : `Lista de ${inventarioData.length} item(s) encontrado(s)`
                }
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Modelo/Marca</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventarioData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron items con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventarioData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{item.nombre}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {item.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {item.modelo && (
                            <div className="text-sm">
                              <span className="font-medium">Modelo:</span> {item.modelo}
                            </div>
                          )}
                          {item.marca && (
                            <div className="text-sm">
                              <span className="font-medium">Marca:</span> {item.marca}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStockBadge(item.stockTotal, item.estado)}
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(item.estado)}
                      </TableCell>
                      <TableCell>
                        {getActivoBadge(item.activo)}
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={inventario.edit(item.id).url} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={inventario.asignar.store(item.id).url} className="flex items-center gap-2">
                                <Move className="h-4 w-4" />
                                Asignar a Aula
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={inventario.detalle.show(item.id).url} className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Ver en Aulas
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={inventario.transferir.create(item.id).url} className="flex items-center gap-2">
                                <ArrowRight className="h-4 w-4" />
                                Transferir entre Aulas
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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