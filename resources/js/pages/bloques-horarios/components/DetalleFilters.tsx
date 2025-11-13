import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { /*Filter*/ X } from 'lucide-react';

interface DetalleFiltersProps {
  filters: {
    materia: string;
    docente: string;
    grupo: string;
    aula: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  materiasOcupadas: Array<{ idMateria: number; sigla: string; nombre: string }>;
  docentesOcupados: Array<{ idDocente: number; usuario: { name: string } }>;
  gruposOcupados: Array<{ idGrupo: number; codigoGrupo: string }>;
  aulasOcupadas: Array<{ id: number; codigoAula: string }>;
}

export default function DetalleFilters({
  filters,
  onFilterChange,
  onClearFilters,
  materiasOcupadas,
  docentesOcupados,
  gruposOcupados,
  aulasOcupadas,
}: DetalleFiltersProps) {
  const tieneFiltros = Object.values(filters).some(value => value !== '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Materia */}
      <Select
        value={filters.materia}
        onValueChange={(value) => onFilterChange('materia', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas las materias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas las materias</SelectItem>
          {materiasOcupadas.map((materia) => (
            <SelectItem key={materia.idMateria} value={materia.idMateria.toString()}>
              {materia.sigla} - {materia.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Docente */}
      <Select
        value={filters.docente}
        onValueChange={(value) => onFilterChange('docente', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los docentes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos los docentes</SelectItem>
          {docentesOcupados.map((docente) => (
            <SelectItem key={docente.idDocente} value={docente.idDocente.toString()}>
              {docente.usuario.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Grupo */}
      <Select
        value={filters.grupo}
        onValueChange={(value) => onFilterChange('grupo', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todos los grupos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos los grupos</SelectItem>
          {gruposOcupados.map((grupo) => (
            <SelectItem key={grupo.idGrupo} value={grupo.idGrupo.toString()}>
              {grupo.codigoGrupo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Aula */}
      <Select
        value={filters.aula}
        onValueChange={(value) => onFilterChange('aula', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas las aulas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas las aulas</SelectItem>
          {aulasOcupadas.map((aula) => (
            <SelectItem key={aula.id} value={aula.id.toString()}>
              {aula.codigoAula}
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