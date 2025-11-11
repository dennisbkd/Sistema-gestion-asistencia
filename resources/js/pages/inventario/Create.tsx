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

import { ArrowLeft, Save, Package, Smartphone, Building, Hash } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import inventario from '@/routes/inventario';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Inventario',
    href: '/inventario',
  },
  {
    title: 'Nuevo Item',
    href: '#',
  },
];

export default function InventarioCreate() {
  const { auth } = usePage<{ auth: { user: { id: number; name: string } } }>().props;

  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    modelo: '',
    marca: '',
    stockTotal: 0,
    activo: true,
    estado: 'disponible',
    registradoPor: auth.user.id,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const createPromise = new Promise((resolve, reject) => {
      post(inventario.store().url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al crear el Material'));
        },
      });
    });

    toast.promise(createPromise, {
      loading: 'Creando Material...',
      success: () => {
        return `Material "${data.nombre}" creado exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrar Nuevo Item" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrar Nuevo Item</h1>
            <p className="text-muted-foreground">
              Agrega un nuevo item al inventario del sistema
            </p>
          </div>

          <Link href="/inventario">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Inventario
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Item</CardTitle>
            <CardDescription>
              Completa todos los campos requeridos para registrar el nuevo item
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
                      Stock Inicial *
                    </Label>
                    <Input
                      id="stockTotal"
                      type="number"
                      value={data.stockTotal}
                      onChange={(e) => setData('stockTotal', parseInt(e.target.value) || 0)}
                      required
                      min="0"
                      placeholder="Cantidad inicial en inventario"
                      className="w-full"
                    />
                    <InputError message={errors.stockTotal} />
                    <p className="text-xs text-muted-foreground">
                      Cantidad inicial disponible en el inventario general
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
                        <SelectValue placeholder="Selecciona el estado" />
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
                    <p className="text-xs text-muted-foreground">
                      Los items inactivos no estarán disponibles para asignación
                    </p>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Información Adicional</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Registrado por</Label>
                    <Input
                      value={auth.user.name}
                      disabled
                      className="w-full bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Usuario que realiza el registro
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Fecha de registro</Label>
                    <Input
                      value={new Date().toLocaleDateString('es-ES')}
                      disabled
                      className="w-full bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Fecha automática del sistema
                    </p>
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
                  {processing ? 'Registrando...' : 'Registrar Item'}
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
    </AppLayout>
  );
}