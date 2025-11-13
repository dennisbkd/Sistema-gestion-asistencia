import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import { type BloqueHorario } from '../types/bloque-horario';
import bloquesHorarios from '@/routes/bloques-horarios';

interface BloqueHorarioTableProps {
  bloques: BloqueHorario[];
  tieneFiltros: boolean;
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

export default function BloqueHorarioTable({ bloques, tieneFiltros }: BloqueHorarioTableProps) {
  const getTurnoBadge = (turno: string) => {
    const colors = {
      mañana: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tarde: 'bg-orange-100 text-orange-800 border-orange-200',
      noche: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[turno as keyof typeof colors]}>
        {turno.charAt(0).toUpperCase() + turno.slice(1)}
      </Badge>
    );
  };

  const getNombreDia = (diaSemana: number) => {
    return diasSemana.find(dia => dia.id === diaSemana)?.nombre || 'Desconocido';
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Día</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead>Turno</TableHead>
          <TableHead>Asignaciones</TableHead>
          <TableHead>Creado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bloques.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              {tieneFiltros 
                ? 'No hay bloques horarios que coincidan con los filtros.' 
                : 'No hay bloques horarios registrados.'
              }
            </TableCell>
          </TableRow>
        ) : (
          bloques.map((bloque) => (
            <TableRow key={bloque.idBloque}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {getNombreDia(bloque.diaSemana)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {/* ✅ CORREGIDO: Usar horaInicio y horaFin en lugar de horarioFormateado */}
                  {bloque.horaInicio} - {bloque.horaFin}
                </div>
              </TableCell>
              <TableCell>{getTurnoBadge(bloque.turno)}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {bloque.hoarios_asignacion_count || 0} asignaciones
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {bloque.created_at ? formatFecha(bloque.created_at) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Ver detalle */}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={bloquesHorarios.detalle(bloque.idBloque).url}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  {/* Editar */}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={bloquesHorarios.edit(bloque.idBloque).url}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  {/* Eliminar */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                  >
                    <Link 
                      href={bloquesHorarios.destroy(bloque.idBloque).url}
                      method="delete"
                      as="button"
                      preserveScroll
                    >
                      <Trash2 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
