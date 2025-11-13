// components/AsignacionActions.tsx
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Asignacion } from '../types/asignaciones';
import asignaciones from '@/routes/asignaciones';

interface AsignacionActionsProps {
  asignacion: Asignacion;
}

export function AsignacionActions({ asignacion }: AsignacionActionsProps) {
  return (
    <div className="flex gap-2 justify-center">
      <Link href={asignaciones.edit(asignacion.idAsignacion).url}>
        <Button size="sm" variant="outline">
          Editar
        </Button>
      </Link>
      <Link href={asignaciones.show(asignacion.idAsignacion).url}>
        <Button size="sm" variant="outline">
          Detalle
        </Button>
      </Link>
    </div>
  );
}