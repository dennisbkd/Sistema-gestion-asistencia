import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from 'lucide-react';
import bloquesHorarios from '@/routes/bloques-horarios';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Bloques Horarios', href: bloquesHorarios.index().url },
  { title: 'Nuevo Bloque', href: '#' },
];

export default function Create() {
  const { props } = usePage();

  useEffect(() => {
    const flash = props.flash as { success?: string } | undefined;
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [props.flash]);

  const { data, setData, post, processing, errors } = useForm({
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
    turno: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(bloquesHorarios.store().url, {
      onSuccess: () => toast.success('Bloque horario creado exitosamente'),
      onError: () => toast.error('Error al crear el bloque horario'),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Nuevo Bloque Horario" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Bloque Horario</h1>
            <p className="text-muted-foreground">Define un nuevo bloque dentro del horario académico</p>
          </div>

          <Link href={bloquesHorarios.index().url}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Bloque Horario</CardTitle>
            <CardDescription>Completa todos los campos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">

                {/* Día de la semana */}
                <div className="space-y-2">
                  <Label htmlFor="diaSemana">Día de la Semana *</Label>
                  <Select
                    value={data.diaSemana.toString()}
                    onValueChange={(value) => setData('diaSemana', value)}
                  >
                    <SelectTrigger className={errors.diaSemana ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el día" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Lunes</SelectItem>
                      <SelectItem value="2">Martes</SelectItem>
                      <SelectItem value="3">Miércoles</SelectItem>
                      <SelectItem value="4">Jueves</SelectItem>
                      <SelectItem value="5">Viernes</SelectItem>
                      <SelectItem value="6">Sábado</SelectItem>
                      <SelectItem value="7">Domingo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.diaSemana && <p className="text-sm text-red-500">{errors.diaSemana}</p>}
                </div>

                {/* Turno */}
                <div className="space-y-2">
                  <Label htmlFor="turno">Turno *</Label>
                  <Select
                    value={data.turno}
                    onValueChange={(value) => setData('turno', value)}
                  >
                    <SelectTrigger className={errors.turno ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mañana">Mañana</SelectItem>
                      <SelectItem value="tarde">Tarde</SelectItem>
                      <SelectItem value="noche">Noche</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.turno && <p className="text-sm text-red-500">{errors.turno}</p>}
                </div>

                {/* Hora de inicio */}
                <div className="space-y-2">
                  <Label htmlFor="horaInicio">Hora de Inicio *</Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={data.horaInicio}
                    onChange={(e) => setData('horaInicio', e.target.value)}
                    className={errors.horaInicio ? 'border-red-500' : ''}
                  />
                  {errors.horaInicio && <p className="text-sm text-red-500">{errors.horaInicio}</p>}
                </div>

                {/* Hora de fin */}
                <div className="space-y-2">
                  <Label htmlFor="horaFin">Hora de Fin *</Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={data.horaFin}
                    onChange={(e) => setData('horaFin', e.target.value)}
                    className={errors.horaFin ? 'border-red-500' : ''}
                  />
                  {errors.horaFin && <p className="text-sm text-red-500">{errors.horaFin}</p>}
                </div>

              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={processing} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {processing ? 'Guardando...' : 'Guardar Bloque'}
                </Button>

                <Link href={bloquesHorarios.index().url}>
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
