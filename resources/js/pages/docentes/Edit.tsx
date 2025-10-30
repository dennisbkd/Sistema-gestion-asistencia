import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

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

import { ArrowLeft, Save, Phone, Briefcase, Clock, User } from 'lucide-react';
import { index } from '@/routes/docentes';
import DocenteController from '@/actions/App/Http/Controllers/DocenteController';
import { toast } from 'sonner';

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface Docente {
  idDocente: number;
  idUsuario: number;
  codigoDocente: string;
  telefono: string;
  especialidad: string;
  estado: string;
  maxHorasSemanales: number;
  created_at: string;
  updated_at: string;
  usuario: Usuario;
}

interface EditProps {
  docente: Docente;
  usuarios: Usuario[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Docentes',
    href: index().url,
  },
  {
    title: 'Editar Docente',
    href: '#',
  },
];

export default function Edit({ docente, usuarios }: EditProps) {
  const { data, setData, put, processing, errors } = useForm({
    idUsuario: docente.idUsuario.toString(),
    codigoDocente: docente.codigoDocente,
    telefono: docente.telefono || '',
    especialidad: docente.especialidad || '',
    estado: docente.estado,
    maxHorasSemanales: docente.maxHorasSemanales,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatePromise = new Promise((resolve, reject) => {
      try {
        put(DocenteController.update(docente.idDocente).url, {
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
      loading: 'Guardando cambios del Docente...',
      success: () => {
        return `Docente "${data.idUsuario}" actualizado correctamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Docente" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Docente</h1>
            <p className="text-muted-foreground">
              Actualiza la información del docente seleccionado
            </p>
          </div>

          <Link href={index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Docente</CardTitle>
            <CardDescription>
              Modifica los campos que deseas actualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="idUsuario">Usuario Docente *</Label>
                  <Select
                    value={data.idUsuario}
                    onValueChange={(value) => setData('idUsuario', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un usuario docente" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.map((usuario) => (
                        <SelectItem key={usuario.id} value={usuario.id.toString()}>
                          <div className="flex gap-x-2">
                            <span className="font-medium">{usuario.name}</span>
                            <span className="text-sm text-muted-foreground">{usuario.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputError message={errors.idUsuario} />
                </div>

                {/* Código Docente */}
                <div className="space-y-2">
                  <Label htmlFor="codigoDocente">Código del Docente *</Label>
                  <Input
                    id="codigoDocente"
                    value={data.codigoDocente}
                    onChange={(e) => setData('codigoDocente', e.target.value)}
                    placeholder="Ej: DOC-2024-001"
                  />
                  <InputError message={errors.codigoDocente} />
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </div>
                  </Label>
                  <Input
                    id="telefono"
                    value={data.telefono}
                    onChange={(e) => setData('telefono', e.target.value)}
                    placeholder="Ej: +591 12345678"
                  />
                  <InputError message={errors.telefono} />
                </div>

                {/* Especialidad */}
                <div className="space-y-2">
                  <Label htmlFor="especialidad">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Especialidad
                    </div>
                  </Label>
                  <Input
                    id="especialidad"
                    value={data.especialidad}
                    onChange={(e) => setData('especialidad', e.target.value)}
                    placeholder="Ej: Matemáticas, Física, Programación..."
                  />
                  <InputError message={errors.especialidad} />
                </div>

                {/* Horas Máximas Semanales */}
                <div className="space-y-2">
                  <Label htmlFor="maxHorasSemanales">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Horas Máximas Semanales *
                    </div>
                  </Label>
                  <Input
                    id="maxHorasSemanales"
                    type="number"
                    value={data.maxHorasSemanales}
                    onChange={(e) => setData('maxHorasSemanales', parseInt(e.target.value) || 0)}
                    min="1"
                    max="60"
                  />
                  <InputError message={errors.maxHorasSemanales} />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={data.estado}
                    onValueChange={(value: 'activo' | 'inactivo' | 'licencia') => setData('estado', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="licencia">Licencia</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputError message={errors.estado} />
                </div>
              </div>

              {/* Información de auditoría */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-3">Información de Auditoría</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Creado:</span>{' '}
                    {new Date(docente.created_at).toLocaleString('es-ES')}
                  </div>
                  <div>
                    <span className="font-medium">Última actualización:</span>{' '}
                    {new Date(docente.updated_at).toLocaleString('es-ES')}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={processing} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {processing ? 'Actualizando...' : 'Actualizar Docente'}
                </Button>

                <Link href={index().url}>
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