import { Badge } from '@/components/ui/badge';
import { Building, BookOpen, Users } from 'lucide-react';
import { type HorarioAsignacion } from '../types/bloque-horario';

interface AsignacionesListProps {
  horarios: HorarioAsignacion[];
  tieneFiltros: boolean;
}

export default function AsignacionesList({ horarios, tieneFiltros }: AsignacionesListProps) {
  if (horarios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {tieneFiltros 
          ? 'No hay asignaciones que coincidan con los filtros.' 
          : 'No hay asignaciones en este horario.'
        }
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {horarios.map((horario) => (
        <div key={horario.idBloque} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              {/* Materia */}
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-lg">
                  {horario.asignacion.materia.sigla} - {horario.asignacion.materia.nombre}
                </h4>
              </div>
              
              {/* Docente */}
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-green-600" />
                <p className="text-sm text-muted-foreground">
                  {horario.asignacion.docente.usuario.name}
                </p>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {horario.asignacion.docente.codigoDocente}
                </span>
              </div>
            </div>
            
            {/* Grupo */}
            <Badge variant="secondary" className="text-sm">
              {horario.asignacion.grupo.codigoGrupo}
            </Badge>
          </div>
          
          {/* Aula e información adicional */}
          <div className="flex justify-between items-center text-sm border-t pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4 text-purple-600" />
                <span className="font-medium">{horario.aula.codigoAula}</span>
              </span>
              <span className="text-muted-foreground">
                Cap: {horario.aula.capacidad} estudiantes
              </span>
              <Badge variant="outline" className="text-xs">
                {horario.aula.tipo}
              </Badge>
            </div>
            
            {horario.aula.ubicacion && (
              <span className="text-xs text-muted-foreground">
                {horario.aula.ubicacion}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}