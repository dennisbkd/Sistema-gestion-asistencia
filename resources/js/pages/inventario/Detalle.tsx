import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Building, BarChart3, CheckCircle, XCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InventarioController from '@/actions/App/Http/Controllers/InventarioController';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Aula {
  id: number;
  codigoAula: string;
  tipo: string;
  ubicacion?: string;
}

interface DetalleInventario {
  id: number;
  idAula: number;
  idInventario: number;
  cantidad: number;
  estado: 'funcional' | 'dañado' | 'mantenimiento';
  created_at: string;
  updated_at: string;
  aula?: Aula;
}

interface Inventario {
  id: number;
  nombre: string;
  modelo: string | null;
  marca: string | null;
  stockTotal: number;
  activo: boolean;
  estado: string;
  registradoPor: number;
  created_at: string;
  updated_at: string;
  detalles: DetalleInventario[];
  registrado_por?: User;
}

interface DistribucionAula {
  idAula: number;
  total: number;
  estado: 'funcional' | 'dañado' | 'mantenimiento';
  aula?: Aula;
}

interface Estadisticas {
  total_funcional: number;
  total_danado: number;
  total_mantenimiento: number;
  total_general: number;
}

interface Props {
  inventario: Inventario;
  aulas: Aula[];
  distribucionAulas: { [aulaId: string]: DistribucionAula[] };
  estadisticas: Estadisticas;
  detalles: DetalleInventario[];
}

const breadcrumbs = (inventario: Inventario): BreadcrumbItem[] => [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Gestión de Inventario',
    href: '/inventario',
  },
  {
    title: `Detalle - ${inventario.nombre}`,
    href: '#',
  },
];

export default function InventarioDetalle({
  inventario,
  aulas,
  distribucionAulas,
  estadisticas,
  detalles
}: Props) {

  const getEstadoStyles = (estado: string) => {
    switch (estado) {
      case 'funcional':
        return 'bg-green-100 text-green-800';
      case 'dañado':
        return 'bg-red-100 text-red-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'funcional':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'dañado':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'mantenimiento':
        return <Wrench className="h-5 w-5 text-yellow-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs(inventario)}>
      <Head title={`Detalle - ${inventario.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {inventario.nombre}
            </h1>
            <p className="text-muted-foreground">
              Distribución en aulas - {inventario.marca} {inventario.modelo}
            </p>
          </div>

          <Link href={InventarioController.index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inventario
            </Button>
          </Link>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Funcionales</p>
                  <p className="text-2xl font-bold text-foreground">
                    {estadisticas.total_funcional}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dañados</p>
                  <p className="text-2xl font-bold text-foreground">
                    {estadisticas.total_danado}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Wrench className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Mantenimiento</p>
                  <p className="text-2xl font-bold text-foreground">
                    {estadisticas.total_mantenimiento}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total en Aulas</p>
                  <p className="text-2xl font-bold text-foreground">
                    {estadisticas.total_general}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribución por Aulas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Distribución por Aulas
            </CardTitle>
            <CardDescription>
              Distribución detallada del item en las diferentes aulas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(distribucionAulas).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(distribucionAulas).map(([aulaId, detallesAula]) => {
                  const aula = aulas.find(a => a.id === parseInt(aulaId));
                  const totalAula = detallesAula.reduce((sum, detalle) => sum + detalle.total, 0);

                  return (
                    <div key={aulaId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {aula?.tipo || 'Aula No Encontrada'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {aula?.codigoAula || 'Sin código'} • Total: {totalAula} unidades
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {totalAula} unidades
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {detallesAula.map((detalle) => (
                          <div key={detalle.estado} className="flex items-center justify-between p-3 bg-muted rounded">
                            <span className="capitalize text-sm text-foreground">
                              {detalle.estado}
                            </span>
                            <span className={`font-semibold ${detalle.estado === 'funcional' ? 'text-green-600' :
                              detalle.estado === 'dañado' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                              {detalle.total}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay distribución en aulas
                </h3>
                <p className="text-muted-foreground">
                  Este item no está asignado a ninguna aula actualmente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalles Completos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detalles Completos
            </CardTitle>
            <CardDescription>
              Lista completa de todos los registros de distribución
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detalles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Aula
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Última Actualización
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {detalles.map((detalle) => (
                      <tr key={detalle.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {detalle.aula?.codigoAula}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {detalle.aula?.tipo}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoStyles(detalle.estado)}`}>
                            {getEstadoIcon(detalle.estado)}
                            {detalle.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {detalle.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(detalle.updated_at).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay registros de distribución detallada.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}