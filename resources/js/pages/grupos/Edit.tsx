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
    title: 'Editar Grupo',
    href: '#',
  },
];

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
  estado: string;
}

interface EditProps {
  grupo: Grupo;
}

export default function Edit({ grupo }: EditProps) {
  const { props } = usePage();
  
  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, put, processing, errors } = useForm({
    codigoGrupo: grupo.codigoGrupo || '',
    estado: grupo.estado || 'activo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/grupos/${grupo.idGrupo}`, {
      onError: () => {
        toast.error('Error al actualizar el grupo');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar ${grupo.codigoGrupo}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Grupo</h1>
            <p className="text-muted-foreground">
              Modifica la información del grupo {grupo.codigoGrupo}
            </p>
          </div>

          <Link href={index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Grupos
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Grupo</CardTitle>
            <CardDescription>
              Modifica los campos que necesites actualizar
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
                  {processing ? 'Guardando...' : 'Actualizar Grupo'}
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