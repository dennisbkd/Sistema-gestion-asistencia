import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { create as crearAula, index, store } from '@/actions/App/Http/Controllers/AulaController';
import { toast } from 'sonner';
import { Index } from '@/routes/aula';
import { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Aulas',
    href: Index().url,
  },
  {
    title: 'Crear Aula',
    href: crearAula().url,
  }
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    codigoAula: '',
    capacidad: 0,
    tipo: '',
    activo: true,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const createPromise = new Promise((resolve, reject) => {
      post(store().url, {
        onSuccess: () => {
          resolve(true);
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al crear el Aula'));
        },
      });
    });
    toast.promise(createPromise, {
      loading: 'Creando aula...',
      success: () => {
        return `Aula "${data.codigoAula}" creada exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrar Nueva Aula" />

      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href={index().url}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrar Nueva Aula</h1>
            <p className="text-muted-foreground">Complete los datos para registrar una nueva aula</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos del Aula</CardTitle>
            <CardDescription>
              Ingrese la información requerida para el nuevo aula
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="codigoAula" className="text-sm font-medium">
                    Código del Aula *
                  </label>
                  <Input
                    id="codigoAula"
                    value={data.codigoAula}
                    onChange={(e) => setData('codigoAula', e.target.value)}
                    required
                    placeholder="Ej: A-101, LAB-201"
                    className="w-full"
                  />
                  <InputError message={errors.codigoAula} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidad">
                    Capacidad *
                  </Label>
                  <Input
                    id="capacidad"
                    type="number"
                    value={data.capacidad}
                    onChange={(e) => setData('capacidad', parseInt(e.target.value) || 0)}
                    required
                    min="1"
                    placeholder="Ej: 30, 50, 100"
                    className="w-full"
                  />
                  <InputError message={errors.capacidad} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">
                    Tipo de Aula *
                  </Label>
                  <Input
                    id="tipo"
                    value={data.tipo}
                    onChange={(e) => setData('tipo', e.target.value)}
                    placeholder="Ej: Teórica, Laboratorio, Multimedia"
                    className={errors.tipo ? 'border-destructive' : ''}
                    required
                  />
                  <InputError message={errors.tipo} />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <div className="flex items-center space-x-4 pt-2">
                    <Label className="flex items-center">
                      <Input
                        type="radio"
                        name="activo"
                        checked={data.activo}
                        onChange={() => setData('activo', true)}
                        className="mr-2"
                      />
                      Activo
                    </Label>
                    <Label className="flex items-center">
                      <Input
                        type="radio"
                        name="activo"
                        checked={!data.activo}
                        onChange={() => setData('activo', false)}
                        className="mr-2"
                      />
                      Inactivo
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-6">
                <Link href={Index().url}>
                  <Button type="button" variant="outline" disabled={processing}>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  {processing ? 'Registrando...' : 'Registrar Aula'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}