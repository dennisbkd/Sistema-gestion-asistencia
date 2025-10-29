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
import UserController, { create } from '@/actions/App/Http/Controllers/UserController';
import { AlertDeleteUsuario } from '@/components/Alert-DeleteUsuario';
import { toast } from 'sonner';
import { can } from '@/lib/can';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
  {
    title: 'Usuarios',
    href: UserController.Index().url,
  }
];

interface Role {
  id: number;
  name: string;
  guard_name: string;
}

interface UsuarioProps {
  id: number;
  name: string;
  email: string;
  estado: string;
  en_linea: boolean;
  ultima_ip: string | null;
  ultima_actividad: string | null;
  dispositivo: string | null;
  roles: Role[]; // Nuevo campo para roles
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

  const getRoleBadge = (role: Role) => {
    const roleColors: Record<string, string> = {
      'administrador': 'bg-red-100 text-red-800 border-red-200',
      'editor': 'bg-blue-100 text-blue-800 border-blue-200',
      'supervisor': 'bg-green-100 text-green-800 border-green-200',
      'usuario': 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const baseClasses = "text-xs font-medium me-2 px-2.5 py-0.5 rounded border";
    const colorClasses = roleColors[role.name] || 'bg-purple-100 text-purple-800 border-purple-200';

    return (
      <span className={`${baseClasses} ${colorClasses}`}>
        {role.name}
      </span>
    );
  };

  const eliminarUsuario = (usuarioId: number) => {
    const eliminarPromise = new Promise((resolve, reject) => {
      try {
        deleteUsuario(UserController.destroy(usuarioId).url, {
          onSuccess: () => {
            resolve('success');
          },
          onError: (errors) => {
            // Construir mensaje de error detallado
            const errorMessages = Object.values(errors).join(', ');
            reject(new Error(errorMessages || 'Error al actualizar el rol'));
          },
        });
      } catch (error) {
        reject(error);
      }
    });
    toast.promise(eliminarPromise, {
      loading: 'Eliminando Usuario...',
      success: () => {
        return `Usuario "${usuarioId}" Eliminado correctamente`;
      },
      error: (error) => {
        return `${error.message}`;
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
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 m-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-sm text-muted-foreground">
              Última actualización: {lastUpdate.toLocaleTimeString('es-BO')}
            </p>
          </div>
          {can('create usuarios') && (<Link href={create().url} className="btn">
            <Button variant={'outline'}>Crear Usuario</Button>
          </Link>)}
        </div>

        <Table>
          <TableCaption>Lista de usuarios del sistema</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo Electrónico</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>En Línea</TableHead>
              <TableHead>Última IP</TableHead>
              <TableHead>Última Actividad</TableHead>
              <TableHead>Dispositivo</TableHead>
              <TableHead className="w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No hay usuarios disponibles.
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{usuario.id}</TableCell>
                  <TableCell className="font-medium">{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {usuario.roles && usuario.roles.length > 0 ? (
                        usuario.roles.map((role) => (
                          <div key={role.id}>
                            {getRoleBadge(role)}
                          </div>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Sin roles
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(usuario.estado)}</TableCell>
                  <TableCell>{getOnlineStatus(usuario.en_linea)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {usuario.ultima_ip || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(usuario.ultima_actividad)}
                  </TableCell>
                  <TableCell className="text-sm max-w-[120px] truncate">
                    {usuario.dispositivo || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {can('edit usuarios') && <Link href={UserController.Edit(usuario.id).url}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>}
                      {can('delete usuarios') && <AlertDeleteUsuario
                        eliminarUsuario={() => eliminarUsuario(usuario.id)}
                        processing={processing}
                      />}
                    </div>
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