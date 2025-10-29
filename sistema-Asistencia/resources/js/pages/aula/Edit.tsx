import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { ArrowLeftSquare, EditIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AulaController from '@/actions/App/Http/Controllers/AulaController';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';

interface Classroom {
  id: number;
  codigoAula: string;
  capacidad: number;
  tipo: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  classroom: Classroom;
}


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Aulas',
    href: AulaController.index().url,
  },
  {
    title: 'Editar Aula',
    href: '#',
  }
];

export default function Edit({ classroom }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    codigoAula: classroom.codigoAula,
    capacidad: classroom.capacidad,
    tipo: classroom.tipo,
    activo: classroom.activo,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatePromise = new Promise((resolve, reject) => {
      put(AulaController.update(classroom.id).url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al actualizar el permiso'));
        },
      });
    });

    toast.promise(updatePromise, {
      loading: 'Actualizando aula...',
      success: () => {
        return `Aula "${data.codigoAula}" actualizada exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Modificar Aula" />

      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
          <div className="flex items-center lg:gap-3 lg:mb-4 flex-col lg:flex-row p-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <EditIcon className="h-6 w-6 text-primary" />
            </div>
            <div className='text-center lg:text-left'>
              <h1 className="lg:text-3xl font-bold text-2xl">Editar Aula</h1>
              <p className="text-muted-foreground">
                Modificar la información del aula en el sistema de gestión de asistencia
              </p>
            </div>
          </div>
          <Link href={AulaController.index().url}>
            <Button variant="outline" className="gap-2 mb-2">
              <ArrowLeftSquare className="h-4 w-4" />
              Volver a la lista
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Datos del Aula</CardTitle>
            <CardDescription>
              Modifique los campos que desea actualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigoAula" className="text-sm font-medium">
                    Código del Aula *
                  </Label>
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
                  <Label htmlFor="capacidad" className="text-sm font-medium">
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
                  <Label className="text-sm font-medium">Estado</Label>
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
                <Link href={AulaController.index().url}>
                  <Button type="button" variant="outline" disabled={processing}>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  {processing ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}