
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';

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
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { AlertDeleteUsuario } from '@/components/Alert-DeleteUsuario';

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
  estado: string;
  en_linea: boolean;
  ultima_ip: string | null;
  ultima_actividad: string | null;
  dispositivo: string | null;
}

export default function Index({ usuarios: initialUsuarios }: { usuarios: UsuarioProps[] }) {
  const [usuarios, setUsuarios] = useState<UsuarioProps[]>(initialUsuarios);
  const { processing, delete: deleteUsuario } = useForm();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo: 'default',
      inactivo: 'secondary',
      suspendido: 'destructive'
    } as const;

    return (
      <Badge variant={variants[estado as keyof typeof variants] || 'default'}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const eliminarUsuario = (usuarioId: number) => {
    deleteUsuario(UserController.destroy(usuarioId).url, {
      onSuccess: () => {
        setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioId));
      },
    });
  }

  const getOnlineStatus = (enLinea: boolean) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${enLinea ? 'bg-green-500' : 'bg-gray-300'
            }`}
        />
        <span className="text-sm">
          {enLinea ? 'En línea' : 'Desconectado'}
        </span>
      </div>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';

    const date = new Date(dateString);
    return date.toLocaleString('es-BO');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['usuarios'] });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setUsuarios(initialUsuarios);
    setLastUpdate(new Date());
  }, [initialUsuarios]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Última actualización: {lastUpdate.toLocaleTimeString('es-BO')}
          </p>
          <Link href="/usuarios/create" className="btn">
            <Button variant={'outline'}>Crear Usuario</Button>
          </Link>
        </div>

        <Table>
          <TableCaption>Lista de usuarios del sistema</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>En Línea</TableHead>
              <TableHead>Última IP</TableHead>
              <TableHead>Última Actividad</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead className="pl-10">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell className="font-medium">{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{getEstadoBadge(usuario.estado)}</TableCell>
                  <TableCell>{getOnlineStatus(usuario.en_linea)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {usuario.ultima_ip || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(usuario.ultima_actividad)}
                  </TableCell>
                  <TableCell className="text-sm max-w-[150px] truncate">
                    {usuario.dispositivo || 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2 flex">
                    <Link href={UserController.Edit(usuario.id).url}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>

                    </Link>
                    <AlertDeleteUsuario
                      eliminarUsuario={() => eliminarUsuario(usuario.id)}
                      processing={processing}
                    />
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
