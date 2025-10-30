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

import { ArrowLeft, Save } from 'lucide-react';
import { index } from '@/routes/materias';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Materias',
    href: index().url,
  },
  {
    title: 'Editar Materia',
    href: '#',
  },
];

interface Materia {
  idMateria: number;
  sigla: string;
  nombre: string;
  semestre: number;
  horasSemanales: number;
  estado: string;
}

interface EditProps {
  materia: Materia;
}

export default function Edit({ materia }: EditProps) {
  const { props } = usePage();
  
  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, put, processing, errors } = useForm({
    sigla: materia.sigla || '',
    nombre: materia.nombre || '',
    semestre: materia.semestre || 1,
    horasSemanales: materia.horasSemanales || 4,
    estado: materia.estado || 'activo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/materias/${materia.idMateria}`, { // ← CORREGIDO: ruta directa
      onError: () => {
        toast.error('Error al actualizar la materia');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar ${materia.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Materia</h1>
            <p className="text-muted-foreground">
              Modifica la información de {materia.nombre}
            </p>
          </div>

          <Link href={index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Materias
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Materia</CardTitle>
            <CardDescription>
              Modifica los campos que necesites actualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sigla">Sigla *</Label>
                  <Input
                    id="sigla"
                    value={data.sigla}
                    onChange={(e) => setData('sigla', e.target.value)}
                    placeholder="Ej: MAT101"
                    className={errors.sigla ? 'border-red-500' : ''}
                  />
                  {errors.sigla && (
                    <p className="text-sm text-red-500">{errors.sigla}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={data.nombre}
                    onChange={(e) => setData('nombre', e.target.value)}
                    placeholder="Ej: Matemáticas I"
                    className={errors.nombre ? 'border-red-500' : ''}
                  />
                  {errors.nombre && (
                    <p className="text-sm text-red-500">{errors.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semestre">Semestre *</Label>
                  <Select
                    value={data.semestre.toString()}
                    onValueChange={(value) => setData('semestre', parseInt(value))}
                  >
                    <SelectTrigger className={errors.semestre ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semestre {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semestre && (
                    <p className="text-sm text-red-500">{errors.semestre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horasSemanales">Horas Semanales *</Label>
                  <Input
                    id="horasSemanales"
                    type="number"
                    min="1"
                    max="20"
                    value={data.horasSemanales}
                    onChange={(e) => setData('horasSemanales', parseInt(e.target.value))}
                    className={errors.horasSemanales ? 'border-red-500' : ''}
                  />
                  {errors.horasSemanales && (
                    <p className="text-sm text-red-500">{errors.horasSemanales}</p>
                  )}
                </div>

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
                  {processing ? 'Guardando...' : 'Actualizar Materia'}
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