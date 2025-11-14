// components/AsignacionFilters.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface AsignacionFiltersProps {
  search: string;
  selectedEstado: string;
  selectedPeriodo: string;
  onSearchChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onPeriodoChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearFilters: () => void;
  periodos: Array<{
    idPeriodo: number;
    nroSemestre: number;
    año: number;
    tipoPeriodo: string;
  }>;
}

export function AsignacionFilters({
  search,
  selectedEstado,
  selectedPeriodo,
  onSearchChange,
  onEstadoChange,
  onPeriodoChange,
  onSearchSubmit,
  onClearFilters,
  periodos,
}: AsignacionFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Filtra las asignaciones por período, estado, docente, materia o grupo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSearchSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Período Académico
              </label>
              <Select value={selectedPeriodo} onValueChange={onPeriodoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los períodos</SelectItem>
                  {periodos.map((periodo) => (
                    <SelectItem key={periodo.idPeriodo} value={periodo.idPeriodo.toString()}>
                      {periodo.año} - Semestre {periodo.nroSemestre} ({periodo.tipoPeriodo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Estado
              </label>
              <Select value={selectedEstado} onValueChange={onEstadoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Buscar
              </label>
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Docente, materia o grupo"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}