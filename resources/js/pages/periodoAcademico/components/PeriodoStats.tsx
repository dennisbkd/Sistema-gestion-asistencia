import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { PeriodoAcademico } from '../types';

interface PeriodoStatsProps {
  periodos: PeriodoAcademico[];
}

export function PeriodoStats({ periodos }: PeriodoStatsProps) {
  const totalPeriodos = periodos.length;
  const periodosActivos = periodos.filter(p => p.estado === 'activo').length;
  const periodosFinalizados = periodos.filter(p => p.estado === 'finalizado').length;
  const periodosPlanificados = periodos.filter(p => p.estado === 'planificado').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Períodos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPeriodos}</div>
          <p className="text-xs text-muted-foreground">Períodos en el sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Períodos Activos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{periodosActivos}</div>
          <p className="text-xs text-muted-foreground">Períodos en curso</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Períodos Finalizados</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{periodosFinalizados}</div>
          <p className="text-xs text-muted-foreground">Períodos completados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Planificados</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{periodosPlanificados}</div>
          <p className="text-xs text-muted-foreground">Períodos futuros</p>
        </CardContent>
      </Card>
    </div>
  );
}