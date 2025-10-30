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
import { index } from '@/routes/grupos';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Grupos',
    href: index().url,
  },
  {
    title: 'Nuevo Grupo',
    href: '#',
  },
];

export default function Create() {
  const { props } = usePage();

  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, post, processing, errors } = useForm({
    codigoGrupo: '',
    estado: 'activo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/grupos', {
      onError: () => {
        toast.error('Error al crear el grupo');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Nuevo Grupo" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Grupo</h1>
            <p className="text-muted-foreground">
              Agrega un nuevo grupo al sistema académico
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
            <CardTitle>Información del Grupo</CardTitle>
            <CardDescription>
              Completa todos los campos para crear un nuevo grupo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codigoGrupo">Código del Grupo *</Label>
                  <Input
                    id="codigoGrupo"
                    value={data.codigoGrupo}
                    onChange={(e) => setData('codigoGrupo', e.target.value)}
                    placeholder="Ej: GRP-2024-001"
                    className={errors.codigoGrupo ? 'border-red-500' : ''}
                  />
                  {errors.codigoGrupo && (
                    <p className="text-sm text-red-500">{errors.codigoGrupo}</p>
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
                  {processing ? 'Guardando...' : 'Guardar Grupo'}
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