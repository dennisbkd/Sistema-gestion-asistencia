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
import bloquesHorarios from '@/routes/bloques-horarios';
import { toast } from 'sonner';
import { PageProps } from '@inertiajs/core';

// 🧠 Tipado de props y BloqueHorario
interface BloqueHorario {
  idBloque: number;
  diaSemana: number; // ✅ CAMBIADO: ahora es number
  horaInicio: string;
  horaFin: string;
  turno: string;
}

interface Props extends PageProps {
  bloque: BloqueHorario;
  flash?: {
    success?: string;
  };
}

// Días de la semana como array de objetos con id y nombre
const diasSemana = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' },
];

export default function Edit() {
  const { props } = usePage<Props>();
  const bloque = props.bloque;

  // Función para obtener el nombre del día basado en el ID
  const getNombreDia = (id: number) => {
    const dia = diasSemana.find(d => d.id === id);
    return dia ? dia.nombre : 'Día no encontrado';
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bloques Horarios', href: bloquesHorarios.index().url },
    { title: `Editar Bloque ${getNombreDia(bloque.diaSemana)}`, href: '#' },
  ];

  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success);
    }
  }, [props.flash]);

  const { data, setData, put, processing, errors } = useForm({
    diaSemana: bloque.diaSemana.toString(), // ✅ Convertir a string para el Select
    horaInicio: bloque.horaInicio,
    horaFin: bloque.horaFin,
    turno: bloque.turno,
  });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ CORRECTO: Usar setData para actualizar y luego hacer put sin datos adicionales
    setData('diaSemana', parseInt(data.diaSemana).toString());
    
    put(bloquesHorarios.update(bloque.idBloque).url, {
        onSuccess: () => {
        toast.success('Bloque horario actualizado correctamente');
        },
        onError: () => {
        toast.error('Error al actualizar el bloque horario');
        },
    });
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Bloque ${getNombreDia(bloque.diaSemana)}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Editar Bloque Horario
            </h1>
            <p className="text-muted-foreground">
              Modifica la información del bloque horario
            </p>
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
            <CardTitle>Información del Bloque</CardTitle>
            <CardDescription>
              Actualiza los datos del bloque horario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Día de la Semana */}
                <div className="space-y-2">
                  <Label htmlFor="diaSemana">Día de la Semana *</Label>
                  <Select
                    value={data.diaSemana}
                    onValueChange={(value) => setData('diaSemana', value)}
                  >
                    <SelectTrigger className={errors.diaSemana ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona el día" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.id} value={dia.id.toString()}>
                          {dia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.diaSemana && <p className="text-sm text-red-500">{errors.diaSemana}</p>}
                </div>

                {/* Hora Inicio */}
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

                {/* Hora Fin */}
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
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Guardando...' : 'Actualizar Bloque'}
                </Button>

                <Link href={bloquesHorarios.index().url}>
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