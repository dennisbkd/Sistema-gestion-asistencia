import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, BookOpen, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  mensaje: string;
  estado: string;
  minutos_retraso: number;
  clase: string;
  grupo: string;
  hora_registro: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Asistencia',
    href: '/asistencia',
  },
  {
    title: 'Registro Exitoso',
    href: '/asistencia/qr/success',
  },
];

export default function QrSuccess({
  mensaje,
  estado,
  minutos_retraso,
  clase,
  grupo,
  hora_registro
}: Props) {
  const getEstadoBadge = () => {
    const variants = {
      presente: 'bg-green-100 text-green-800 border-green-200',
      tardanza: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ausente: 'bg-red-100 text-red-800 border-red-200',
      justificado: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const textos = {
      presente: 'Presente',
      tardanza: 'Tardanza',
      ausente: 'Ausente',
      justificado: 'Justificado',
    };

    return (
      <Badge className={`flex items-center gap-1 text-sm px-3 py-1 ${variants[estado as keyof typeof variants]}`}>
        <CheckCircle className="h-3 w-3" />
        {textos[estado as keyof typeof textos]}
      </Badge>
    );
  };

  const getIconoEstado = () => {
    if (estado === 'presente') {
      return <CheckCircle className="h-16 w-16 text-green-500" />;
    } else if (estado === 'tardanza') {
      return <Clock className="h-16 w-16 text-yellow-500" />;
    } else {
      return <CheckCircle className="h-16 w-16 text-blue-500" />;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Asistencia Registrada - Éxito" />

      <div className="flex h-full flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getIconoEstado()}
            </div>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {getEstadoBadge()}
            </CardTitle>
            <CardDescription className="text-lg">
              {mensaje}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Información de la clase */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">Clase</p>
                  <p className="text-sm text-muted-foreground">{clase}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">Grupo</p>
                  <p className="text-sm text-muted-foreground">{grupo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">Hora de registro</p>
                  <p className="text-sm text-muted-foreground">{hora_registro}</p>
                </div>
              </div>

              {minutos_retraso > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-800">Minutos de retraso</p>
                    <p className="text-sm text-yellow-700">{minutos_retraso} minutos</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje adicional basado en el estado */}
            <div className="text-center">
              {estado === 'presente' && (
                <p className="text-sm text-green-600">
                  ¡Perfecto! Has llegado puntualmente a tu clase.
                </p>
              )}
              {estado === 'tardanza' && (
                <p className="text-sm text-yellow-600">
                  Recuerda intentar llegar puntualmente a tus próximas clases.
                </p>
              )}
              {estado === 'ausente' && (
                <p className="text-sm text-red-600">
                  Has superado el tiempo permitido para el registro.
                </p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-2">
              <Link href="/asistencia">
                <Button className="w-full">
                  Volver al Registro de Asistencia
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Ir al Dashboard
                </Button>
              </Link>
            </div>

            {/* Información adicional */}
            <div className="text-center text-xs text-muted-foreground">
              <p>Tu asistencia ha sido registrada en el sistema.</p>
              <p>IP de registro: {window.location.hostname}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}