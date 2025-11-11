import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { PeriodoAcademico } from '../types';
import { PeriodoActions } from './PeriodoActions';

interface PeriodoTableProps {
  periodos: PeriodoAcademico[];
  onChangeStatus: (periodo: PeriodoAcademico) => void;
}

export function PeriodoTable({ periodos, onChangeStatus }: PeriodoTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      finalizado: 'bg-blue-100 text-blue-800 border-blue-200',
      planificado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[estado as keyof typeof colors]}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Períodos Académicos</CardTitle>
        <CardDescription>
          Gestiona todos los períodos académicos del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            {periodos.length === 0
              ? 'No se encontraron períodos académicos'
              : `Lista de ${periodos.length} período(s) académico(s) encontrado(s)`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Período</TableHead>
              <TableHead>Semestre</TableHead>
              <TableHead>Fechas</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periodos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No se encontraron períodos académicos con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              periodos.map((periodo) => (
                <TableRow key={periodo.idPeriodo} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Año {periodo.año}</div>
                        <div className="text-sm text-muted-foreground">
                          {periodo.asignaciones_count || 0} asignaciones
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      Semestre {periodo.nroSemestre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Inicio: {formatDate(periodo.fechaInicio)}</div>
                      <div>Fin: {formatDate(periodo.fechaFin)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getEstadoBadge(periodo.estado)}
                  </TableCell>
                  <TableCell>
                    <PeriodoActions 
                      periodo={periodo} 
                      onChangeStatus={onChangeStatus} 
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}