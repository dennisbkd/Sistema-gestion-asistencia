
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Usuarios',
    href: '/usuarios',
  },
];

interface UsuarioProps {
  id: number;
  name: string;
  email: string;
}

export default function Index({ usuarios }: { usuarios: UsuarioProps[] }) {
  console.log(usuarios);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <Link href="/usuarios/create" className="btn">
          <Button variant={'outline'}>Crear Usuario</Button>
        </Link>
        <Table>
          <TableCaption>Lista de Usuarios</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>correo Electrónico</TableHead>
              <TableHead className="pl-10">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            ) : (

              usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell>{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell className='space-x-2'>
                    <Button variant={'outline'}>Editar</Button>{' '}
                    <Button variant={'destructive'}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
