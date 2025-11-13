// components/AsignacionTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Asignacion } from '../types/asignaciones';
import { AsignacionActions } from './AsignacionAction';

interface AsignacionTableProps {
  asignaciones: Asignacion[];
}

export function AsignacionTable({ asignaciones }: AsignacionTableProps) {
  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      activo: 'bg-green-100 text-green-800 border-green-200',
      finalizado: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelado: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Badge variant="outline" className={colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const getModalidadBadge = (modalidad: string) => {
    const colors: Record<string, string> = {
      presencial: 'bg-purple-100 text-purple-800 border-purple-200',
      virtual: 'bg-orange-100 text-orange-800 border-orange-200',
      hibrida: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };

    return (
      <Badge variant="outline" className={colors[modalidad] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {modalidad.charAt(0).toUpperCase() + modalidad.slice(1)}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Asignaciones</CardTitle>
        <CardDescription>
          {asignaciones.length} asignación(es) encontrada(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Docente</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Grupo</TableHead>
              <TableHead>Modalidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Inscritos</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asignaciones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay asignaciones disponibles.
                </TableCell>
              </TableRow>
            ) : (
              asignaciones.map((asignacion) => (
                <TableRow key={asignacion.idAsignacion} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {asignacion.docente?.usuario.name || 'N/A'}
                    <div className="text-sm text-muted-foreground">
                      {asignacion.docente?.codigoDocente}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{asignacion.materia?.sigla}</div>
                    <div className="text-sm text-muted-foreground">
                      {asignacion.materia?.nombre}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {asignacion.grupo?.codigoGrupo || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getModalidadBadge(asignacion.modalidad)}
                  </TableCell>
                  <TableCell>
                    {getEstadoBadge(asignacion.estado)}
                  </TableCell>
                  <TableCell>
                    <div className="text-center font-medium">
                      {asignacion.inscritos}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AsignacionActions asignacion={asignacion} />
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
