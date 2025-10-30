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
    title: 'Nuevo Docente',
    href: '#',
  },
];

interface Usuario {
  id: number;
  name: string;
  email: string;
  estado: string;
}

interface CreateProps {
  usuarios: Usuario[];
}

export default function Create({ usuarios }: CreateProps) {
  const { props } = usePage();

  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, post, processing, errors } = useForm({
    idUsuario: '',
    codigoDocente: '',
    telefono: '',
    especialidad: '',
    estado: 'activo',
    maxHorasSemanales: 40,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/docentes', {
      onSuccess: () => {
        toast.success('Docente creado exitosamente');
      },
      onError: () => {
        toast.error('Error al crear el docente');
      },
    });
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-red-100 text-red-800',
      suspendido: 'bg-yellow-100 text-yellow-800',
    } as const;

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[estado as keyof typeof colors] || 'bg-gray-100'}`}>
        {estado}
      </span>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Nuevo Docente" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Docente</h1>
            <p className="text-muted-foreground">
              Asocia un usuario al sistema como docente
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
              Selecciona un usuario y completa los datos para crear un nuevo docente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Usuario */}
                <div className="space-y-2">
                  <Label htmlFor="idUsuario">Seleccionar Usuario *</Label>
                  <Select
                    value={data.idUsuario}
                    onValueChange={(value) => setData('idUsuario', value)}
                  >
                    <SelectTrigger className={errors.idUsuario ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {usuarios.length === 0 ? (
                        <SelectItem value="" disabled>
                          No hay usuarios disponibles
                        </SelectItem>
                      ) : (
                        usuarios.map((usuario) => (
                          <SelectItem key={usuario.id} value={usuario.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex flex-col">
                                <span className="font-medium">{usuario.name}</span>
                                <span className="text-sm text-muted-foreground">{usuario.email}</span>
                              </div>
                              {getEstadoBadge(usuario.estado)}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.idUsuario && (
                    <p className="text-sm text-red-500">{errors.idUsuario}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Selecciona cualquier usuario del sistema para asignarlo como docente
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
                  <Label htmlFor="estado">Estado del Docente *</Label>
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
                  {processing ? 'Guardando...' : 'Guardar Docente'}
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