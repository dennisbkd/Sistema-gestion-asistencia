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
import periodosAcademicos from '@/routes/periodos-academicos';
import { toast } from 'sonner';
import { PageProps } from '@inertiajs/core';

// 🧠 Tipado de los props y del período
interface PeriodoAcademico {
  idPeriodo: number;
  año: number;
  tipoPeriodo: string;
  nroSemestre: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface Props extends PageProps {
  periodo: PeriodoAcademico;
  flash?: {
    success?: string;
  };
}

export default function Edit() {
  const { props } = usePage<Props>();
  const periodo = props.periodo;


  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Períodos Académicos', href: periodosAcademicos.index().url },
    { title: `Editar Período ${periodo.año}-${periodo.nroSemestre}`, href: '#' },
  ];

  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, put, processing, errors } = useForm({
    año: periodo.año,
    nroSemestre: periodo.nroSemestre,
    tipoPeriodo: periodo.tipoPeriodo,
    fechaInicio: periodo.fechaInicio,
    fechaFin: periodo.fechaFin,
    estado: periodo.estado,
  });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(periodosAcademicos.update(periodo.idPeriodo).url, {
        onSuccess: () => toast.success('Período académico actualizado correctamente'),
        onError: () => toast.error('Error al actualizar el período académico'),
    });
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Período ${periodo.año}-${periodo.nroSemestre}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Editar Período Académico
            </h1>
            <p className="text-muted-foreground">
              Modifica la información del período académico
            </p>
          </div>

          <Link href={periodosAcademicos.index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Período</CardTitle>
            <CardDescription>
              Actualiza los datos del período académico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="año">Año *</Label>
                  <Input
                    id="año"
                    type="number"
                    min={2000}
                    max={2030}
                    value={data.año}
                    onChange={(e) => setData('año', parseInt(e.target.value))}
                    className={errors.año ? 'border-red-500' : ''}
                  />
                  {errors.año && <p className="text-sm text-red-500">{errors.año}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nroSemestre">Semestre *</Label>
                  <Select
                    value={data.nroSemestre.toString()}
                    onValueChange={(value) => setData('nroSemestre', parseInt(value))}
                  >
                    <SelectTrigger className={errors.nroSemestre ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el semestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semestre {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nroSemestre && (
                    <p className="text-sm text-red-500">{errors.nroSemestre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoPeriodo">Tipo de Período *</Label>
                  <Select
                    value={data.tipoPeriodo}
                    onValueChange={(value) => setData('tipoPeriodo', value)}
                  >
                    <SelectTrigger className={errors.tipoPeriodo ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el tipo de período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="mesa">Mesa</SelectItem>
                      <SelectItem value="verano">Verano</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoPeriodo && (
                    <p className="text-sm text-red-500">{errors.tipoPeriodo}</p>
                  )}
                </div>

                <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                <Input
                    id="fechaInicio"
                    type="date"
                    value={data.fechaInicio}
                    onChange={(e) => {
                    const value = e.target.value;
                    setData('fechaInicio', value);
                    const year = new Date(value).getFullYear();
                    if (year !== data.año) setData('año', year);
                    }}
                    className={errors.fechaInicio ? 'border-red-500' : ''}
                />
                {errors.fechaInicio && (
                    <p className="text-sm text-red-500">{errors.fechaInicio}</p>
                )}
                </div>


                <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin *</Label>
                <Input
                    id="fechaFin"
                    type="date"
                    value={data.fechaFin}
                    onChange={(e) => {
                    const value = e.target.value;
                    setData('fechaFin', value);
                    const year = new Date(value).getFullYear();
                    if (year !== data.año) setData('año', year);
                    }}
                    className={errors.fechaFin ? 'border-red-500' : ''}
                />
                {errors.fechaFin && (
                    <p className="text-sm text-red-500">{errors.fechaFin}</p>
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
                      <SelectItem value="planificado">Planificado</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
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
                  {processing ? 'Guardando...' : 'Actualizar Período'}
                </Button>

                <Link href={periodosAcademicos.index().url}>
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
