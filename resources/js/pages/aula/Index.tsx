import { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BreadcrumbItem, type SharedData } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import AulaController, { create, index } from '@/actions/App/Http/Controllers/AulaController';
import { AlertDelete } from '@/components/AlertDelete';
import { toast } from 'sonner';
import { can } from '@/lib/can';

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
  classrooms: Classroom[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Aulas',
    href: index().url,
  }
];

export default function Index({ classrooms }: Props) {
  // const { auth } = usePage<SharedData>().props;
  const [searchTerm, setSearchTerm] = useState('');
  const { processing, delete: DeleteAula } = useForm();

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.codigoAula.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classroom.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (aula: Classroom) => {
    const deletePromise = new Promise((resolve, reject) => {
      try {
        DeleteAula(AulaController.destroy(aula.id).url, {
          onSuccess: () => {
            resolve('success');
          },
          onError: (errors) => {
            // ConstruirS mensaje de error detallado
            const errorMessages = Object.values(errors).join(', ');
            reject(new Error(errorMessages || 'Error al eliminar el aula'));
          },
        });
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(deletePromise, {
      loading: 'Eliminando aula...',
      success: () => {
        return `Aula "${aula.codigoAula}" eliminada exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Aulas" />

      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Aulas</h1>
            <p className="text-muted-foreground">
              Gestiona las aulas disponibles en el sistema
            </p>
          </div>

          {can('create aulas') && (<Link href={create().url}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Registrar nueva Aula
            </Button>
          </Link>)}
        </div>

        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Lista de Aulas</CardTitle>
            <CardDescription>
              Busca y gestiona las aulas del sistema
            </CardDescription>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassrooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {classrooms.length === 0
                        ? 'No hay aulas registradas'
                        : 'No se encontraron aulas que coincidan con la búsqueda'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClassrooms.map((classroom) => (
                    <TableRow key={classroom.id}>
                      <TableCell className="font-medium">{classroom.codigoAula}</TableCell>
                      <TableCell>{classroom.capacidad} personas</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{classroom.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={classroom.activo ? "default" : "secondary"}>
                          {classroom.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(classroom.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="space-x-2 flex justify-center ">
                        <Link href={AulaController.show(classroom.id).url}>
                          <Button variant="secondary" size="sm" className="flex items-center gap-2">
                            <Eye className="h-4 w-4 mr-2" />
                            Consultar
                          </Button>
                        </Link>
                        {can('edit aulas') && (<Link href={AulaController.edit(classroom.id).url}>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                        </Link>)}
                        {can('delete aulas') && (<AlertDelete
                          onConfirm={() => handleDelete(classroom)}
                          processing={processing}
                          triggerLabel="Eliminar"
                          title="¿Eliminar este aula?"
                          description="Se eliminará junto con todos sus datos y permisos."
                        />)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}