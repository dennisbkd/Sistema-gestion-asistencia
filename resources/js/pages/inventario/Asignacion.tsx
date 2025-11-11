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

import { ArrowLeft, Save, Package, Building } from 'lucide-react';
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

interface Props {
  inventario: Inventario;
  aulas: Aula[];
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
    title: `Asignar - ${inventario.nombre}`,
    href: '#',
  },
];

export default function AsignacionInventario({ inventario, aulas }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    idAula: '',
    cantidad: 1,
    estado: 'funcional' as 'funcional' | 'dañado' | 'mantenimiento',
    observacion: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const createPromise = new Promise((resolve, reject) => {
      post(AsignacionInventarioController.store(inventario.id).url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al asignar el item'));
        },
      });
    });

    toast.promise(createPromise, {
      loading: 'Asignando item...',
      success: () => {
        return `Item asignado exitosamente al aula`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  const aulasActivas = aulas.filter(aula => aula.activo);

  return (
    <AppLayout breadcrumbs={breadcrumbs(inventario)}>
      <Head title={`Asignar - ${inventario.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Asignar a Aula
            </h1>
            <p className="text-muted-foreground">
              Asigna {inventario.nombre} a un aula específica
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
                Detalles del item a asignar
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

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted-foreground">Stock Disponible</div>
                  <div className="text-2xl font-bold text-foreground">
                    {inventario.stockTotal}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">Estado</div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${inventario.estado === 'disponible'
                    ? 'bg-green-100 text-green-800'
                    : inventario.estado === 'agotado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {inventario.estado}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Asignación */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Asignar a Aula</CardTitle>
              <CardDescription>
                Selecciona el aula y especifica los detalles de la asignación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idAula">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Aula Destino *
                        </div>
                      </Label>
                      <Select
                        value={data.idAula}
                        onValueChange={(value) => setData('idAula', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un aula" />
                        </SelectTrigger>
                        <SelectContent>
                          {aulasActivas.map((aula) => (
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
                      <InputError message={errors.idAula} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cantidad">
                        Cantidad a Asignar *
                      </Label>
                      <Input
                        id="cantidad"
                        type="number"
                        value={data.cantidad}
                        onChange={(e) => setData('cantidad', parseInt(e.target.value) || 1)}
                        min="1"
                        max={inventario.stockTotal}
                        required
                        className="w-full"
                      />
                      <InputError message={errors.cantidad} />
                      <p className="text-xs text-muted-foreground">
                        Máximo disponible: {inventario.stockTotal} unidades
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="observacion">Observaciones</Label>
                      <Textarea
                        id="observacion"
                        value={data.observacion}
                        onChange={(e) => setData('observacion', e.target.value)}
                        placeholder="Observaciones adicionales sobre la asignación..."
                        rows={3}
                      />
                      <InputError message={errors.observacion} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={processing || !data.idAula || data.cantidad < 1}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {processing ? 'Asignando...' : 'Asignar a Aula'}
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