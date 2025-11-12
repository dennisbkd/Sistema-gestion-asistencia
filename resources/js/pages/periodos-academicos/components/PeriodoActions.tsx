import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { PeriodoAcademico } from '../types';
import periodosAcademicos from '@/routes/periodos-academicos';

interface PeriodoActionsProps {
  periodo: PeriodoAcademico;
}

export function PeriodoActions({ periodo }: PeriodoActionsProps) {
  const handleChangeStatus = () => {
    const nuevoEstado = periodo.estado === 'activo' ? 'finalizado' : 'activo';
    
    router.patch(periodosAcademicos.changeStatus(periodo.idPeriodo).url, {}, {
      onSuccess: () => {
        toast.success(`Período académico ${nuevoEstado === 'activo' ? 'activado' : 'finalizado'} exitosamente`);
      },
      onError: () => {
        toast.error('Error al cambiar el estado del período académico');
      },
    });
  };

  const isDisabled =
    periodo.estado === 'finalizado';

  return (
    <div className="flex items-center gap-2 justify-center">
      <Link href={`/periodos-academicos/${periodo.idPeriodo}/detalle`}>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          Detalle
        </Button>
      </Link>

      <Link href={periodosAcademicos.edit(periodo.idPeriodo).url}>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Edit className="h-3 w-3" />
          Editar
        </Button>
      </Link>

      <Button
        variant="outline"
        size="sm"
        onClick={handleChangeStatus}
        className={
          periodo.estado === 'activo'
            ? 'text-red-600 border-red-200 hover:bg-red-50'
            : 'text-green-600 border-green-200 hover:bg-green-50'
        }
        disabled={isDisabled}
      >
        {periodo.estado === 'activo'
          ? 'Finalizar'
          : periodo.estado === 'finalizado'
          ? 'Finalizado'
          : 'Activar'}
      </Button>
    </div>
  );
}
