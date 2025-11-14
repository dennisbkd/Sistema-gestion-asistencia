// components/BloqueHorarioTable.tsx
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
  // ✅ CORREGIDO: Función segura para getTurnoBadge
  const getTurnoBadge = (turno: string | null | undefined) => {
    // Manejar valores null/undefined/vacíos
    if (!turno) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          No definido
        </Badge>
      );
    }

    const colors = {
      mañana: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tarde: 'bg-orange-100 text-orange-800 border-orange-200',
      noche: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    // ✅ CORREGIDO: Usar optional chaining y fallback
    const turnoCapitalizado = turno?.charAt(0)?.toUpperCase() + turno?.slice(1) || 'No definido';

    return (
      <Badge
        variant="outline"
        className={colors[turno as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}
      >
        {turnoCapitalizado}
      </Badge>
    );
  };

  // ✅ CORREGIDO: Función segura para getNombreDia
  const getNombreDia = (diaSemana: number | null | undefined) => {
    if (!diaSemana) return 'No definido';
    return diasSemana.find(dia => dia.id === diaSemana)?.nombre || 'Desconocido';
  };

  // ✅ CORREGIDO: Función segura para formatFecha
  const formatFecha = (fecha: string | null | undefined) => {
    if (!fecha) return '-';

    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  // ✅ CORREGIDO: Función segura para formatHora
  const formatHora = (hora: string | null | undefined) => {
    if (!hora) return '-';

    try {
      // Extraer solo la parte de la hora si viene en formato completo
      const match = hora.match(/(\d{2}:\d{2})/);
      return match ? match[1] : hora;
    } catch (error) {
      return '-';
    }
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
                  {/* ✅ CORREGIDO: Usar función segura */}
                  {getNombreDia(bloque.diaSemana)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {/* ✅ CORREGIDO: Usar funciones seguras para horas */}
                  {formatHora(bloque.horaInicio)} - {formatHora(bloque.horaFin)}
                </div>
              </TableCell>
              <TableCell>
                {/* ✅ CORREGIDO: Usar función segura que maneja null/undefined */}
                {getTurnoBadge(bloque.turno)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {/* ✅ CORREGIDO: Usar el nombre correcto de la propiedad */}
                  {bloque.horarios_asignacion_count || 0} asignaciones
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {/* ✅ CORREGIDO: Usar función segura */}
                {formatFecha(bloque.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={bloquesHorarios.detalle(bloque.idBloque).url}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="sm" asChild>
                    <Link href={bloquesHorarios.edit(bloque.idBloque).url}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>

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