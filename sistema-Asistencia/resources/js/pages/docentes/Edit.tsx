import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { toast } from 'sonner';

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
  usuario: Usuario;
}

interface EditProps {
  docente: Docente;
  usuarios: Usuario[];
}

export default function Edit({ docente, usuarios }: EditProps) {
  const { props } = usePage();
  
  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, put, processing, errors } = useForm({
    idUsuario: docente.idUsuario.toString(),
    codigoDocente: docente.codigoDocente || '',
    telefono: docente.telefono || '',
    especialidad: docente.especialidad || '',
    estado: docente.estado || 'activo',
    maxHorasSemanales: docente.maxHorasSemanales || 40,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/docentes/${docente.idDocente}`, {
      onError: () => {
        toast.error('Error al actualizar el docente');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar ${docente.codigoDocente}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Docente</h1>
            <p className="text-muted-foreground">
              Modifica la información del docente {docente.usuario.name}
            </p>
          </div>

          <Link href={index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Docentes
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Docente</CardTitle>
            <CardDescription>
              Modifica los campos que necesites actualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Información del Usuario (solo lectura) */}
                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuario Asociado</Label>
                  <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{docente.usuario.name}</div>
                      <div className="text-sm text-muted-foreground">{docente.usuario.email}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    El usuario no puede ser cambiado una vez asignado
                  </p>
                </div>

                {/* Código Docente */}
                <div className="space-y-2">
                  <Label htmlFor="codigoDocente">Código del Docente *</Label>
                  <Input
                    id="codigoDocente"
                    value={data.codigoDocente}
                    onChange={(e) => setData('codigoDocente', e.target.value)}
                    placeholder="Ej: DOC-2024-001"
                    className={errors.codigoDocente ? 'border-red-500' : ''}
                  />
                  {errors.codigoDocente && (
                    <p className="text-sm text-red-500">{errors.codigoDocente}</p>
                  )}
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
                    className={errors.telefono ? 'border-red-500' : ''}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-red-500">{errors.telefono}</p>
                  )}
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
                    className={errors.especialidad ? 'border-red-500' : ''}
                  />
                  {errors.especialidad && (
                    <p className="text-sm text-red-500">{errors.especialidad}</p>
                  )}
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
                    min="1"
                    max="60"
                    value={data.maxHorasSemanales}
                    onChange={(e) => setData('maxHorasSemanales', parseInt(e.target.value))}
                    className={errors.maxHorasSemanales ? 'border-red-500' : ''}
                  />
                  {errors.maxHorasSemanales && (
                    <p className="text-sm text-red-500">{errors.maxHorasSemanales}</p>
                  )}
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={data.estado}
                    onValueChange={(value) => setData('estado', value)}
                  >
                    <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                      <SelectItem value="licencia">Licencia</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estado && (
                    <p className="text-sm text-red-500">{errors.estado}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Guardando...' : 'Actualizar Docente'}
                </Button>
                
                <Link href={index().url}>
                  <Button type="button" variant="outline">
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