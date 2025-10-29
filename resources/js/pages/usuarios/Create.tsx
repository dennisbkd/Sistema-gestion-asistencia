import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Index, Create as crear, store } from '@/routes/usuarios';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftSquare, CheckCircle2, KeyRound, Mail, User, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Usuarios',
    href: Index().url,
  },
  {
    title: 'Crear Usuario',
    href: crear().url,
  }
];

interface Role {
  id: number;
  name: string;
  guard_name: string;
}

interface CreateProps {
  allRoles: Role[]; // Todos los roles disponibles
}

export default function Create({ allRoles }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    estado: 'activo',
    roles: [] as number[], // Array de IDs de roles
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
    const createPromise = new Promise((resolve, reject) => {
      post(store().url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al crear el Usuario'));
        },
      });
    });

    toast.promise(createPromise, {
      loading: 'Creando usuario...',
      success: () => {
        return `Usuario "${data.name}" creado exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  }

  const handleRoleToggle = (roleId: number) => {
    const newRoles = data.roles.includes(roleId)
      ? data.roles.filter(id => id !== roleId)
      : [...data.roles, roleId];

    setData('roles', newRoles);
  }

  const getRoleBadge = (role: Role) => {
    const roleColors: Record<string, string> = {
      'administrador': 'bg-red-100 text-red-800 border-red-200',
      'editor': 'bg-blue-100 text-blue-800 border-blue-200',
      'supervisor': 'bg-green-100 text-green-800 border-green-200',
      'usuario': 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const baseClasses = "text-xs font-medium px-2.5 py-0.5 rounded border";
    const colorClasses = roleColors[role.name] || 'bg-purple-100 text-purple-800 border-purple-200';

    return (
      <span className={`${baseClasses} ${colorClasses}`}>
        {role.name}
      </span>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Usuario" />

      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-col lg:flex-row gap-4">
          <div className="flex items-center lg:gap-3 lg:mb-4 flex-col lg:flex-row p-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div className='text-center lg:text-left'>
              <h1 className="lg:text-3xl font-bold text-2xl">Crear Nuevo Usuario</h1>
              <p className="text-muted-foreground">
                Agregar nuevo usuario al sistema de gestión de asistencia
              </p>
            </div>
          </div>
          <Link href={Index().url}>
            <Button variant="outline" className="gap-2">
              <ArrowLeftSquare className="h-4 w-4" />
              Volver a la lista
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Usuario</CardTitle>
                <CardDescription>
                  Complete la información básica del nuevo usuario del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre Completo */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nombre Completo *
                    </Label>
                    <Input
                      id="nombre"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Ej: Juan Pérez García"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Correo Electrónico */}
                  <div className="space-y-2">
                    <Label htmlFor="correo" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico *
                    </Label>
                    <Input
                      id="correo"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="Ej: juan.perez@escuela.edu"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        Contraseña *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                        className={errors.password ? 'border-destructive' : ''}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmarPassword" className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Confirmar Contraseña *
                      </Label>
                      <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Repita la contraseña"
                      />
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado del Usuario</Label>
                    <Select value={data.estado} onValueChange={(value) => setData('estado', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Activo
                          </div>
                        </SelectItem>
                        <SelectItem value="inactivo">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                            Inactivo
                          </div>
                        </SelectItem>
                        <SelectItem value="suspendido">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Suspendido
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Roles */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Roles Asignados
                    </Label>
                    <div className="space-y-2">
                      {allRoles?.map((role) => (
                        <div key={role.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`role-${role.id}`}
                            checked={data.roles.includes(role.id)}
                            onChange={() => handleRoleToggle(role.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <Label
                            htmlFor={`role-${role.id}`}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            {getRoleBadge(role)}
                            <span className="text-xs text-muted-foreground">
                              ({role.guard_name})
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                    {data.roles.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Selecciona al menos un rol para el usuario
                      </p>
                    )}
                    <div className="p-2 bg-muted rounded">
                      <p className="text-sm text-muted-foreground">
                        <strong>{data.roles.length}</strong> rol(es) seleccionado(s)
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={processing || data.roles.length === 0}
                      className="gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      {processing ? 'Creando...' : 'Crear Usuario'}
                    </Button>
                    <Link href={Index().url}>
                      <Button type="button" variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral - Información y Guías */}
          <div className="space-y-6">
            {/* Resumen de Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Roles Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {allRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRoleBadge(role)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {role.guard_name}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tarjeta de Información */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información Importante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                    <Mail className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Correo Único</p>
                    <p className="text-xs text-muted-foreground">
                      Cada usuario debe tener un correo electrónico único en el sistema
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded-full mt-0.5">
                    <KeyRound className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contraseña Segura</p>
                    <p className="text-xs text-muted-foreground">
                      La contraseña debe tener al menos 8 caracteres
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-amber-100 rounded-full mt-0.5">
                    <Shield className="h-3 w-3 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Roles Obligatorios</p>
                    <p className="text-xs text-muted-foreground">
                      Cada usuario debe tener al menos un rol asignado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}