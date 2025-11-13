import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Users } from 'lucide-react';

interface Aula {
  id: number;
  codigoAula: string;
  capacidad: number;
  tipo: string;
  ubicacion?: string;
}

interface AulasLibresListProps {
  aulas: Aula[];
}

export default function AulasLibresList({ aulas }: AulasLibresListProps) {
  if (aulas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay aulas libres en este horario.
      </div>
    );
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      'Aula Normal': 'bg-blue-50 text-blue-700 border-blue-200',
      'Laboratorio': 'bg-green-50 text-green-700 border-green-200',
      'Taller': 'bg-orange-50 text-orange-700 border-orange-200',
      'Auditorio': 'bg-purple-50 text-purple-700 border-purple-200',
    } as const;

    return colors[tipo as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="space-y-3">
      {aulas.map((aula) => (
        <div key={aula.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-green-50 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold">{aula.codigoAula}</h4>
              <Badge variant="outline" className={getTipoColor(aula.tipo)}>
                {aula.tipo}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Capacidad: {aula.capacidad}
              </span>
              
              {aula.ubicacion && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {aula.ubicacion}
                </span>
              )}
            </div>
          </div>
          
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Disponible
          </Badge>
        </div>
      ))}
    </div>
  );
}