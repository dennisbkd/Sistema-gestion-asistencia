import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, /*Filter,*/ X } from 'lucide-react';

interface FiltersProps {
  filters: {
    search: string;
    diaSemana: string;
    turno: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
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

export default function Filters({ filters, onFilterChange, onClearFilters }: FiltersProps) {
  const tieneFiltros = Object.values(filters).some(value => value !== '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por horario..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Día de la semana */}
      <Select
        value={filters.diaSemana || 'todos'}
        onValueChange={(value) => onFilterChange('diaSemana', value === 'todos' ? '' : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los días" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los días</SelectItem>
          {diasSemana.map((dia) => (
            <SelectItem key={dia.id} value={dia.id.toString()}>
              {dia.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.turno || 'todos'}
        onValueChange={(value) => onFilterChange('turno', value === 'todos' ? '' : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los turnos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los turnos</SelectItem>
          {turnos.map((turno) => (
            <SelectItem key={turno.id} value={turno.id}>
              {turno.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>


      {/* Botón Limpiar */}
      <Button 
        variant="outline" 
        onClick={onClearFilters}
        disabled={!tieneFiltros}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Limpiar
      </Button>
    </div>
  );
}