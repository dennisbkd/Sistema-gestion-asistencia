import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type BloqueHorario } from '../types/bloque-horario';

interface BloqueHorarioFormProps {
  bloque?: BloqueHorario;
  isEditing?: boolean;
}

const diasSemana = [
  { id: 1, nombre: 'Lunes' },
  { id: 2, nombre: 'Martes' },
  { id: 3, nombre: 'Miércoles' },
  { id: 4, nombre: 'Jueves' },
  { id: 5, nombre: 'Viernes' },
  { id: 6, nombre: 'Sábado' },
  { id: 7, nombre: 'Domingo' },
];

const turnos = [
  { id: 'mañana', nombre: 'Mañana' },
  { id: 'tarde', nombre: 'Tarde' },
  { id: 'noche', nombre: 'Noche' },
];

export default function BloqueHorarioForm({ bloque, isEditing = false }: BloqueHorarioFormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    diaSemana: bloque?.diaSemana.toString() || '',
    horaInicio: bloque?.horaInicio || '',
    horaFin: bloque?.horaFin || '',
    turno: bloque?.turno || 'mañana',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && bloque) {
      put(`/bloque-horario/${bloque.idBloque}`);
    } else {
      post('/bloque-horario');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Día de la semana */}
        <div className="space-y-2">
          <Label htmlFor="diaSemana">Día de la semana *</Label>
          <Select
            value={data.diaSemana}
            onValueChange={(value) => setData('diaSemana', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar día" />
            </SelectTrigger>
            <SelectContent>
              {diasSemana.map((dia) => (
                <SelectItem key={dia.id} value={dia.id.toString()}>
                  {dia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.diaSemana && (
            <p className="text-sm text-red-600">{errors.diaSemana}</p>
          )}
        </div>

        {/* Turno */}
        <div className="space-y-2">
          <Label htmlFor="turno">Turno</Label>
          <Select
            value={data.turno}
            onValueChange={(value) => setData('turno', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar turno" />
            </SelectTrigger>
            <Select
              value={data.turno}
              onValueChange={(value) => setData('turno', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar turno" />
              </SelectTrigger>
              <SelectContent>
                {turnos.map((turno) => (
                  <SelectItem key={turno.id} value={turno.id}>
                    {turno.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Select>
          {errors.turno && (
            <p className="text-sm text-red-600">{errors.turno}</p>
          )}
        </div>

        {/* Hora de inicio */}
        <div className="space-y-2">
          <Label htmlFor="horaInicio">Hora de inicio *</Label>
          <Input
            id="horaInicio"
            type="time"
            value={data.horaInicio}
            onChange={(e) => setData('horaInicio', e.target.value)}
          />
          {errors.horaInicio && (
            <p className="text-sm text-red-600">{errors.horaInicio}</p>
          )}
        </div>

        {/* Hora de fin */}
        <div className="space-y-2">
          <Label htmlFor="horaFin">Hora de fin *</Label>
          <Input
            id="horaFin"
            type="time"
            value={data.horaFin}
            onChange={(e) => setData('horaFin', e.target.value)}
          />
          {errors.horaFin && (
            <p className="text-sm text-red-600">{errors.horaFin}</p>
          )}
        </div>
      </div>

      {/* Información del horario */}
      {data.horaInicio && data.horaFin && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900">Vista previa del horario:</h4>
          <p className="text-blue-700">
            {diasSemana.find(d => d.id.toString() === data.diaSemana)?.nombre || 'Día'} • 
            {data.horaInicio} - {data.horaFin}
            {data.turno && ` • Turno ${data.turno}`}
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={processing}>
          {processing ? 'Guardando...' : isEditing ? 'Actualizar Bloque' : 'Crear Bloque'}
        </Button>
      </div>
    </form>
  );
}