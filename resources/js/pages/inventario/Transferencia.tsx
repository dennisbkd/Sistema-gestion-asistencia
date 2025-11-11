import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
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
import { Textarea } from '@/components/ui/textarea';

import { ArrowLeft, Save, Package, Building, Move, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import InventarioController from '@/actions/App/Http/Controllers/InventarioController';
import AsignacionInventarioController from '@/actions/App/Http/Controllers/AsignacionInventarioController';

interface Aula {
  id: number;
  codigoAula: string;
  nombre: string;
  capacidad: number;
  tipo: string;
  activo: boolean;
}

interface Inventario {
  id: number;
  nombre: string;
  modelo: string | null;
  marca: string | null;
  stockTotal: number;
  activo: boolean;
  estado: string;
}

interface DetalleInventario {
  id: number;
  idAula: number;
  cantidad: number;
  estado: 'funcional' | 'dañado' | 'mantenimiento';
  aula: Aula;
}

interface Props {
  inventario: Inventario;
  aulas: Aula[];
  detalles: DetalleInventario[];
}

const breadcrumbs = (inventario: Inventario): BreadcrumbItem[] => [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Inventario',
    href: InventarioController.index().url,
  },
  {
    title: `Transferir - ${inventario.nombre}`,
    href: '#',
  },
];

export default function TransferenciaInventario({ inventario, aulas, detalles }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    idAulaOrigen: '',
    idAulaDestino: '',
    cantidad: 1,
    estado: 'funcional' as 'funcional' | 'dañado' | 'mantenimiento',
    observacion: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const transferPromise = new Promise((resolve, reject) => {
      post(AsignacionInventarioController.transferir(inventario.id).url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al transferir el item'));
        },
      });
    });

    toast.promise(transferPromise, {
      loading: 'Transferiendo items...',
      success: () => {
        return `Transferencia realizada exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  // Filtrar aulas que tienen este inventario
  const aulasConStock = detalles.map(detalle => detalle.aula);

  // Obtener stock disponible en el aula de origen seleccionada
  const stockDisponible = data.idAulaOrigen
    ? detalles.find(d => d.idAula === parseInt(data.idAulaOrigen) && d.estado === data.estado)?.cantidad || 0
    : 0;

  // Filtrar aulas destino (excluyendo el aula origen)
  const aulasDestino = aulas.filter(aula =>
    aula.activo && aula.id !== parseInt(data.idAulaOrigen)
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs(inventario)}>
      <Head title={`Transferir - ${inventario.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Transferir entre Aulas
            </h1>
            <p className="text-muted-foreground">
              Transfiere {inventario.nombre} de un aula a otra
            </p>
          </div>

          <Link href={`/inventario/${inventario.id}/detalle`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Detalle
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Información del Item */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Información del Item</CardTitle>
              <CardDescription>
                Detalles del item a transferir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{inventario.nombre}</div>
                  <div className="text-sm text-muted-foreground">
                    {inventario.marca} {inventario.modelo}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm text-muted-foreground">
                  Distribución Actual
                </div>
                <div className="space-y-1">
                  {detalles.slice(0, 3).map((detalle) => (
                    <div key={detalle.id} className="flex justify-between text-sm">
                      <span>{detalle.aula.codigoAula}</span>
                      <span className="font-medium">{detalle.cantidad}</span>
                    </div>
                  ))}
                  {detalles.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{detalles.length - 3} aulas más
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Transferencia */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="h-5 w-5" />
                Transferencia entre Aulas
              </CardTitle>
              <CardDescription>
                Selecciona el aula de origen y el aula de destino para la transferencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Aula Origen */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idAulaOrigen">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Aula Origen *
                        </div>
                      </Label>
                      <Select
                        value={data.idAulaOrigen}
                        onValueChange={(value) => setData('idAulaOrigen', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona aula origen" />
                        </SelectTrigger>
                        <SelectContent>
                          {aulasConStock.map((aula) => (
                            <SelectItem key={aula.id} value={aula.id.toString()}>
                              <div className="flex flex-col">
                                <span>{aula.nombre}</span>
                                <span className="text-xs text-muted-foreground">
                                  {aula.codigoAula}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <InputError message={errors.idAulaOrigen} />
                    </div>

                    {data.idAulaOrigen && (
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado del Equipo *</Label>
                        <Select
                          value={data.estado}
                          onValueChange={(value: 'funcional' | 'dañado' | 'mantenimiento') =>
                            setData('estado', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="funcional">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Funcional
                              </div>
                            </SelectItem>
                            <SelectItem value="dañado">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                Dañado
                              </div>
                            </SelectItem>
                            <SelectItem value="mantenimiento">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                En Mantenimiento
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <InputError message={errors.estado} />
                      </div>
                    )}
                  </div>

                  {/* Aula Destino */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idAulaDestino">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Aula Destino *
                        </div>
                      </Label>
                      <Select
                        value={data.idAulaDestino}
                        onValueChange={(value) => setData('idAulaDestino', value)}
                        disabled={!data.idAulaOrigen}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona aula destino" />
                        </SelectTrigger>
                        <SelectContent>
                          {aulasDestino.map((aula) => (
                            <SelectItem key={aula.id} value={aula.id.toString()}>
                              <div className="flex flex-col">
                                <span>{aula.nombre}</span>
                                <span className="text-xs text-muted-foreground">
                                  {aula.codigoAula} • Capacidad: {aula.capacidad}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <InputError message={errors.idAulaDestino} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cantidad">
                        Cantidad a Transferir *
                      </Label>
                      <Input
                        id="cantidad"
                        type="number"
                        value={data.cantidad}
                        onChange={(e) => setData('cantidad', parseInt(e.target.value) || 1)}
                        min="1"
                        max={stockDisponible}
                        disabled={!data.idAulaOrigen || !data.estado}
                        required
                        className="w-full"
                      />
                      <InputError message={errors.cantidad} />
                      {data.idAulaOrigen && data.estado && (
                        <p className="text-xs text-muted-foreground">
                          Disponible en origen: {stockDisponible} unidades
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Flecha de transferencia visual */}
                {data.idAulaOrigen && data.idAulaDestino && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-4 bg-muted/50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="font-semibold">
                          {aulasConStock.find(a => a.id === parseInt(data.idAulaOrigen))?.nombre}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Origen
                        </div>
                      </div>
                      <ArrowRight className="h-6 w-6 text-primary" />
                      <div className="text-center">
                        <div className="font-semibold">
                          {aulas.find(a => a.id === parseInt(data.idAulaDestino))?.nombre}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Destino
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="observacion">Observaciones</Label>
                  <Textarea
                    id="observacion"
                    value={data.observacion}
                    onChange={(e) => setData('observacion', e.target.value)}
                    placeholder="Observaciones adicionales sobre la transferencia..."
                    rows={3}
                  />
                  <InputError message={errors.observacion} />
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={processing || !data.idAulaOrigen || !data.idAulaDestino || data.cantidad < 1}
                    className="flex items-center gap-2"
                  >
                    <Move className="h-4 w-4" />
                    {processing ? 'Transferiendo...' : 'Realizar Transferencia'}
                  </Button>

                  <Link href={`/inventario/${inventario.id}/detalle`}>
                    <Button type="button" variant="outline" disabled={processing}>
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}