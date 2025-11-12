import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Filter } from 'lucide-react';

interface PeriodoFiltersProps {
  search: string;
  selectedEstado: string;
  onSearchChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearFilters: () => void;
}

export function PeriodoFilters({
  search,
  selectedEstado,
  onSearchChange,
  onEstadoChange,
  onSearchSubmit,
  onClearFilters
}: PeriodoFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros y Búsqueda</CardTitle>
        <CardDescription>Busca y filtra los períodos académicos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSearchSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por año, semestre..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedEstado}
            onChange={(e) => onEstadoChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="finalizado">Finalizado</option>
            <option value="planificado">Planificado</option>
          </select>

          <Button type="submit" variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
          
          {(search || selectedEstado) && (
            <Button type="button" variant="ghost" onClick={onClearFilters}>
              Limpiar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}