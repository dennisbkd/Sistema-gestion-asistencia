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
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Save, Package, Smartphone, Building, Hash, Calendar, User } from 'lucide-react';
import inventario from '@/routes/inventario';
import InventarioController from '@/actions/App/Http/Controllers/InventarioController';
import { toast } from 'sonner';

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
  registrado_por?: {
    id: number;
    name: string;
    email: string;
  };
}

interface EditProps {
  inventario: Inventario;
}

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
    title: 'Editar Item',
    href: '#',
  },
];

const getEstadoBadge = (estado: string) => {
  const colors = {
    disponible: 'bg-green-100 text-green-800 border-green-200',
    agotado: 'bg-red-100 text-red-800 border-red-200',
    mantenimiento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  } as const;

  return (
    <Badge variant="outline" className={colors[estado as keyof typeof colors]}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </Badge>
  );
};

export default function InventarioEdit({ inventario }: EditProps) {
  const { auth } = usePage().props;

  const { data, setData, put, processing, errors } = useForm({
    nombre: inventario.nombre,
    modelo: inventario.modelo || '',
    marca: inventario.marca || '',
    stockTotal: inventario.stockTotal,
    activo: inventario.activo,
    estado: inventario.estado,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatePromise = new Promise((resolve, reject) => {
      try {
        put(InventarioController.update(inventario.id).url, {
          onSuccess: () => {
            resolve('success');
          },
          onError: (errors) => {
            // Construir mensaje de error detallado
            const errorMessages = Object.values(errors).join(', ');
            reject(new Error(errorMessages || 'Error al actualizar el Docente'));
          },
        });
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(updatePromise, {
      loading: 'Guardando cambios del Inventario...',
      success: () => {
        return `Inventario "${data.nombre}" actualizado correctamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar: ${inventario.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Item</h1>
            <p className="text-muted-foreground">
              Actualiza la información del item: {inventario.nombre}
            </p>
          </div>

          <Link href="/inventario">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inventario
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulario de Edición */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Item</CardTitle>
                <CardDescription>
                  Modifica los campos que deseas actualizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Información Básica */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Información Básica
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="nombre">
                          Nombre del Item *
                        </Label>
                        <Input
                          id="nombre"
                          value={data.nombre}
                          onChange={(e) => setData('nombre', e.target.value)}
                          required
                          placeholder="Ej: Proyector, Computadora, Silla..."
                          className="w-full"
                        />
                        <InputError message={errors.nombre} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="modelo">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Modelo
                          </div>
                        </Label>
                        <Input
                          id="modelo"
                          value={data.modelo}
                          onChange={(e) => setData('modelo', e.target.value)}
                          placeholder="Ej: Epson EB-X41, Dell Optiplex..."
                          className="w-full"
                        />
                        <InputError message={errors.modelo} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="marca">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Marca
                          </div>
                        </Label>
                        <Input
                          id="marca"
                          value={data.marca}
                          onChange={(e) => setData('marca', e.target.value)}
                          placeholder="Ej: Epson, Dell, HP..."
                          className="w-full"
                        />
                        <InputError message={errors.marca} />
                      </div>
                    </div>

                    {/* Stock y Estado */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        Stock y Estado
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="stockTotal">
                          Stock Actual *
                        </Label>
                        <Input
                          id="stockTotal"
                          type="number"
                          value={data.stockTotal}
                          onChange={(e) => setData('stockTotal', parseInt(e.target.value) || 0)}
                          required
                          min="0"
                          className="w-full"
                        />
                        <InputError message={errors.stockTotal} />
                        <p className="text-xs text-muted-foreground">
                          Cantidad actual en el inventario general
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select
                          value={data.estado}
                          onValueChange={(value: 'disponible' | 'agotado' | 'mantenimiento') =>
                            setData('estado', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disponible">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Disponible
                              </div>
                            </SelectItem>
                            <SelectItem value="agotado">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                Agotado
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
                        <Label htmlFor="activo">Estado del Registro</Label>
                        <Select
                          value={data.activo ? 'true' : 'false'}
                          onValueChange={(value) => setData('activo', value === 'true')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                Activo
                              </div>
                            </SelectItem>
                            <SelectItem value="false">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                Inactivo
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <InputError message={errors.activo} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={processing}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {processing ? 'Actualizando...' : 'Actualizar Item'}
                    </Button>

                    <Link href="/inventario">
                      <Button type="button" variant="outline" disabled={processing}>
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información de Auditoría */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
                <CardDescription>
                  Datos de auditoría y registro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      Registrado por
                    </div>
                  </Label>
                  <div className="text-sm">
                    {inventario.registrado_por?.name || 'Usuario del sistema'}
                  </div>
                  {inventario.registrado_por?.email && (
                    <div className="text-xs text-muted-foreground">
                      {inventario.registrado_por.email}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      Fecha de Creación
                    </div>
                  </Label>
                  <div className="text-sm">
                    {new Date(inventario.created_at).toLocaleString('es-ES')}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4" />
                      Última Actualización
                    </div>
                  </Label>
                  <div className="text-sm">
                    {new Date(inventario.updated_at).toLocaleString('es-ES')}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Estado Actual
                  </Label>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Registro:</span>
                      {inventario.activo ? (
                        <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Inventario:</span>
                      {getEstadoBadge(inventario.estado)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stock:</span>
                      <span className="text-sm font-medium">{inventario.stockTotal} unidades</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/inventario/${inventario.id}/movimiento`} className="w-full">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Registrar Movimiento
                  </Button>
                </Link>
                <Link href={`/inventario/${inventario.id}/detalle`} className="w-full">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Ver en Aulas
                  </Button>
                </Link>
                <Link href={`/inventario/${inventario.id}`} className="w-full">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Ver Detalles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}