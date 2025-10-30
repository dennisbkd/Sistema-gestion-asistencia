import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

import { ArrowLeft, Phone, Briefcase, Clock, User, Mail, Calendar } from 'lucide-react';
import { index, edit } from '@/routes/docentes';

interface Usuario {
  id: number;
  name: string;
  email: string;
}

interface Docente {
  idDocente: number;
  idUsuario: number;
  codigoDocente: string;
  telefono: string;
  especialidad: string;
  estado: string;
  maxHorasSemanales: number;
  created_at: string;
  updated_at: string;
  usuario: Usuario;
}

interface ShowProps {
  docente: Docente;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Docentes',
    href: index().url,
  },
  {
    title: 'Detalles del Docente',
    href: '#',
  },
];

const getEstadoBadge = (estado: string) => {
  const variants = {
    activo: 'default',
    inactivo: 'secondary',
    licencia: 'outline',
  } as const;

  const colors = {
    activo: 'bg-green-100 text-green-800 border-green-200',
    inactivo: 'bg-red-100 text-red-800 border-red-200',
    licencia: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  } as const;

  return (
    <Badge variant={variants[estado as keyof typeof variants] || 'outline'}
      className={colors[estado as keyof typeof colors]}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </Badge>
  );
};

export default function Show({ docente }: ShowProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Docente: ${docente.usuario.name}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalles del Docente</h1>
            <p className="text-muted-foreground">
              Información completa del docente seleccionado
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={edit(docente.idDocente).url}>
              <Button variant="outline">
                Editar Docente
              </Button>
            </Link>
            <Link href={index().url}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Información Principal */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información del Docente</CardTitle>
              <CardDescription>
                Datos personales y profesionales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Información Básica */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Código</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono font-medium">{docente.codigoDocente}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Nombre Completo</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{docente.usuario.name}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{docente.usuario.email}</span>
                    </div>
                  </div>
                </div>

                {/* Información Profesional */}
                <div className="space-y-4">
                  {docente.telefono && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{docente.telefono}</span>
                      </div>
                    </div>
                  )}

                  {docente.especialidad && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Especialidad</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{docente.especialidad}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Horas Máximas Semanales</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{docente.maxHorasSemanales} horas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                <div className="mt-2">
                  {getEstadoBadge(docente.estado)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Auditoría */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
              <CardDescription>
                Datos de auditoría y registro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Fecha de Creación</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(docente.created_at).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Última Actualización</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(docente.updated_at).toLocaleString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="text-sm font-medium text-muted-foreground">ID del Registro</Label>
                <div className="mt-1">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {docente.idDocente}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

// Componente Label para consistencia
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  );
}