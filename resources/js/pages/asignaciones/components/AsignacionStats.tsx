// components/AsignacionStats.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Asignacion } from '../types/asignaciones';

interface AsignacionStatsProps {
  asignaciones: Asignacion[];
}

export function AsignacionStats({ asignaciones }: AsignacionStatsProps) {
  const stats = {
    total: asignaciones.length,
    activas: asignaciones.filter(a => a.estado === 'activo').length,
    finalizadas: asignaciones.filter(a => a.estado === 'finalizado').length,
    canceladas: asignaciones.filter(a => a.estado === 'cancelado').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Activas</p>
              <p className="text-2xl font-bold text-green-600">{stats.activas}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Finalizadas</p>
              <p className="text-2xl font-bold text-blue-600">{stats.finalizadas}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Canceladas</p>
              <p className="text-2xl font-bold text-red-600">{stats.canceladas}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}