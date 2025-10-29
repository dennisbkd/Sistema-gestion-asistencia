import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Edit } from 'lucide-react';
import { Link } from '@inertiajs/react';
import AulaController from '@/actions/App/Http/Controllers/AulaController';
import { Label } from '@/components/ui/label';

interface Classroom {
  id: number;
  codigoAula: string;
  capacidad: number;
  tipo: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  classroom: Classroom;
}

export default function Show({ classroom }: Props) {
  return (
    <AppLayout>
      <Head title={`Aula ${classroom.codigoAula}`} />

      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href={AulaController.index().url}>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Aula: {classroom.codigoAula}</h1>
              <p className="text-muted-foreground">Información detallada del aula</p>
            </div>
          </div>

          <Link href={AulaController.edit(classroom.id).url}>
            <Button className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalles del Aula</CardTitle>
            <CardDescription>
              Información completa del aula seleccionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 block mb-2">
                    Código del Aula
                  </Label>
                  <p className="text-2xl font-bold tracking-tight">{classroom.codigoAula}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 block mb-2">
                    Capacidad
                  </Label>
                  <p className="text-xl font-semibold">
                    {classroom.capacidad} {classroom.capacidad === 1 ? 'persona' : 'personas'}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 block mb-2">
                    Tipo de Aula
                  </Label>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {classroom.tipo}
                  </Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 block mb-2">
                    Estado
                  </Label>
                  <div>
                    <Badge
                      variant={classroom.activo ? "default" : "secondary"}
                      className="text-lg px-2 py-1"
                    >
                      {classroom.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 block mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Fecha de Registro
                  </Label>
                  <p className="text-lg font-semibold">
                    {new Date(classroom.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 block mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Última Actualización
                  </Label>
                  <p className="text-lg font-semibold">
                    {new Date(classroom.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Esta aula está configurada para uso {classroom.activo ? 'activo' : 'inactivo'} en el sistema.
                  {classroom.activo
                    ? ' Puede ser asignada para clases y actividades.'
                    : ' No está disponible para asignación hasta que se active.'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}