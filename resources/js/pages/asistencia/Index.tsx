import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Calendar, Clock, Building, Users, BookOpen, QrCode, History, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import asistencia from '@/routes/asistencia';

// ... (mantén todas las interfaces existentes)
interface Docente {
  id: number;
  codigoDocente: string;
  especialidad: string;
  usuario: {
    nombre: string;
    correo: string;
  };
}

interface Materia {
  idMateria: number;
  codigoMateria: string;
  nombre: string;
}

interface Grupo {
  idGrupo: number;
  codigoGrupo: string;
}

interface BloqueHorario {
  idBloque: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  horario_formateado: string;
  nombre_dia: string;
}

interface Aula {
  id: number;
  codigoAula: string;
  tipo: string;
}

interface HorarioAsignacion {
  idHorarioAsignacion: number;
  bloque: BloqueHorario;
  aula: Aula;
  asignacion: {
    materia: Materia;
    grupo: Grupo;
  };
}

interface Asistencia {
  idAsistencia: number;
  estado: string;
  horaRegistro: string;
  minutosRetraso: number;
  justificacion?: string;
  token_qr?: string;
  qr_expiracion_at?: string;
}

interface ClaseHoy {
  horario: HorarioAsignacion;
  asistencia?: Asistencia;
  hora_inicio: string;
  hora_fin: string;
  puede_registrar: boolean;
}

interface QRData {
  qr_content: string;
  token: string;
  qr_expira_en: string;
  asistencia_id: number;
  horario_id: number;
}

interface Props {
  docente: Docente;
  clasesHoy: ClaseHoy[];
  fechaActual: string;
  flash?: {
    qr_data?: QRData;
    success?: string;
    error?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Registro de Asistencia',
    href: '/asistencia',
  },
];

export default function AsistenciaIndex({ docente, clasesHoy, fechaActual, flash }: Props) {
  const [qrGenerando, setQrGenerando] = useState<number | null>(null);
  const [justificando, setJustificando] = useState<number | null>(null);
  const [justificacion, setJustificacion] = useState('');
  const [qrData, setQrData] = useState<{ [key: number]: QRData }>({});
  const { props } = usePage();

  // Procesar datos flash cuando el componente se monta o actualiza
  useEffect(() => {
    console.log('Flash data recibida:', flash);

    if (flash) {
      if (flash.qr_data) {
        console.log('QR Data encontrado en flash:', flash.qr_data);
        setQrData(prev => ({
          ...prev,
          [flash.qr_data.horario_id]: flash.qr_data
        }));
      }

      if (flash.success) {
        toast.success(flash.success);
      }

      if (flash.error) {
        toast.error(flash.error);
      }
    }
  }, [flash]);



  const getEstadoBadge = (estado: string) => {
    const variants = {
      presente: 'default',
      tardanza: 'secondary',
      ausente: 'destructive',
      justificado: 'outline',
    } as const;

    const colors = {
      presente: 'bg-green-100 text-green-800 border-green-200',
      tardanza: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ausente: 'bg-red-100 text-red-800 border-red-200',
      justificado: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    const icons = {
      presente: <CheckCircle className="h-3 w-3" />,
      tardanza: <AlertCircle className="h-3 w-3" />,
      ausente: <XCircle className="h-3 w-3" />,
      justificado: <CheckCircle className="h-3 w-3" />,
    } as const;

    return (
      <Badge
        variant={variants[estado as keyof typeof variants] || 'outline'}
        className={`flex items-center gap-1 ${colors[estado as keyof typeof colors]}`}
      >
        {icons[estado as keyof typeof icons]}
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  const generarQR = (horarioId: number) => {
    setQrGenerando(horarioId);

    router.post(`/asistencia/generar-qr/${horarioId}`, {}, {
      preserveScroll: true,
      onSuccess: (response) => {
        const nuevaData: QRData = response.props.qr_data;
        setQrData(prev => ({
          ...prev,
          [horarioId]: nuevaData
        }));
        toast.success('QR generado exitosamente');
      },
      onError: (errors) => {
        console.error('Error al generar QR:', errors);
        toast.error('Error al generar QR');
      },
      onFinish: () => {
        setQrGenerando(null);
      }
    });
  };

  const justificarFalta = (horarioId: number) => {
    if (!justificacion.trim()) {
      toast.error('Por favor ingresa una justificación');
      return;
    }

    router.post(asistencia.justificar(horarioId).url, {
      justificacion: justificacion,
      fecha: fechaActual,
    }, {
      onSuccess: () => {
        toast.success('Falta justificada correctamente');
        setJustificando(null);
        setJustificacion('');
      },
      onError: () => {
        toast.error('Error al justificar la falta');
      }
    });
  };

  function formatHora(fechaISO: string) {
    const date = new Date(fechaISO);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  console.log('clasesHoy', clasesHoy, 'docente', docente, 'fechaActual', fechaActual);

  const descargarQR = (horarioId: number, materiaNombre: string) => {
    const svgElement = document.getElementById(`qr-svg-${horarioId}`) as unknown as SVGSVGElement;
    if (svgElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `qr-asistencia-${materiaNombre.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registro de Asistencia" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registro de Asistencia</h1>
            <p className="text-muted-foreground">
              Registra tu asistencia usando códigos QR - {docente.codigoDocente}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={asistencia.historial().url}>
              <Button variant="outline" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historial
              </Button>
            </Link>
          </div>
        </div>

        {/* Información del Día */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {new Date(fechaActual).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <p className="text-muted-foreground">
                    Clases programadas para hoy
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {clasesHoy.length} {clasesHoy.length === 1 ? 'clase' : 'clases'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clases del Día */}
        <div className="grid gap-6">
          {clasesHoy.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay clases programadas para hoy
                </h3>
                <p className="text-muted-foreground">
                  No tienes clases asignadas para el día de hoy.
                </p>
              </CardContent>
            </Card>
          ) : (
            clasesHoy.map((clase) => {
              const qrInfo = qrData[clase.horario.idHorarioAsignacion];
              const tieneQR = qrInfo || clase.asistencia?.token_qr;
              const qrContent = qrInfo?.qr_content ||
                (clase.asistencia?.token_qr ?
                  `${window.location.origin}/asistencia/qr/${clase.asistencia.token_qr}` :
                  null
                );

              return (
                <Card key={clase.horario.idHorarioAsignacion}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {clase.horario.asignacion.materia.nombre}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Grupo: {clase.horario.asignacion.grupo.codigoGrupo}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatHora(clase.horario.bloque.horaInicio)} - {formatHora(clase.horario.bloque.horaFin)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {clase.horario.aula.codigoAula}
                          </span>
                        </CardDescription>
                      </div>
                      {clase.asistencia && getEstadoBadge(clase.asistencia.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        {clase.asistencia ? (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>Registrado a las:</strong>{' '}
                              {clase.asistencia.horaRegistro ?
                                formatHora(clase.asistencia.horaRegistro) : 'No registrado'
                              }
                            </p>
                            {/* Mostrar minutos de retraso para todos los estados, no solo tardanza */}
                            {clase.asistencia.minutosRetraso > 0 && (
                              <p className="text-sm text-yellow-600">
                                <strong>Retraso:</strong> {clase.asistencia.minutosRetraso} minutos
                              </p>
                            )}

                            {/* Mostrar justificación si existe */}
                            {clase.asistencia.justificacion && (
                              <p className="text-sm text-blue-600">
                                <strong>Justificación:</strong> {clase.asistencia.justificacion}
                              </p>
                            )}

                            {/* Mostrar información adicional para justificados */}
                            {clase.asistencia.estado === 'justificado' && (
                              <p className="text-sm text-blue-600">
                                <strong>Estado:</strong> Falta justificada
                                {clase.asistencia.minutosRetraso > 0 &&
                                  ` con ${clase.asistencia.minutosRetraso} minutos de retraso`
                                }
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Asistencia no registrada
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {/* Botón Generar QR */}
                        {!clase.asistencia && clase.puede_registrar && (
                          <Button
                            onClick={() => generarQR(clase.horario.idHorarioAsignacion)}
                            disabled={qrGenerando === clase.horario.idHorarioAsignacion}
                            className="flex items-center gap-2"
                          >
                            <QrCode className="h-4 w-4" />
                            {qrGenerando === clase.horario.idHorarioAsignacion ? 'Generando...' : 'Generar QR'}
                          </Button>
                        )}

                        {/* Mostrar QR si está generado */}
                        {tieneQR && qrContent && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex items-center gap-2">
                                <QrCode className="h-4 w-4" />
                                Ver QR
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Código QR de Asistencia</DialogTitle>
                                <DialogDescription>
                                  Escanea este código QR para registrar tu asistencia
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col items-center gap-4">
                                <div className="border rounded-lg p-4 bg-white">
                                  <QRCodeSVG
                                    id={`qr-svg-${clase.horario.idHorarioAsignacion}`}
                                    value={qrContent}
                                    size={256}
                                    level="H"
                                  />
                                </div>
                                <div className="text-center space-y-2">
                                  <p className="text-sm font-medium">
                                    {clase.horario.asignacion.materia.nombre}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Grupo: {clase.horario.asignacion.grupo.codigoGrupo}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {qrInfo?.qr_expira_en || 'Expira en 15 minutos'}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => descargarQR(clase.horario.idHorarioAsignacion, clase.horario.asignacion.materia.nombre)}
                                  variant="outline"
                                  className="flex items-center gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  Descargar QR
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Botón Justificar Falta */}
                        {!clase.asistencia && (
                          <Dialog open={justificando === clase.horario.idHorarioAsignacion}
                            onOpenChange={(open) => {
                              setJustificando(open ? clase.horario.idHorarioAsignacion : null);
                              if (!open) setJustificacion('');
                            }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Justificar Falta
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Justificar Falta</DialogTitle>
                                <DialogDescription>
                                  Ingresa el motivo de tu falta para {clase.horario.asignacion.materia.nombre}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="justificacion">Justificación</Label>
                                  <Textarea
                                    id="justificacion"
                                    value={justificacion}
                                    onChange={(e) => setJustificacion(e.target.value)}
                                    placeholder="Describe el motivo de tu falta..."
                                    rows={4}
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setJustificando(null);
                                      setJustificacion('');
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                  <Button
                                    onClick={() => justificarFalta(clase.horario.idHorarioAsignacion)}
                                  >
                                    Enviar Justificación
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Información del Sistema */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">Cómo funciona el sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                  <QrCode className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <strong>Genera el QR</strong>
                  <p>Haz clic en "Generar QR" para crear un código único para tu clase</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                  <Clock className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <strong>Escanea el código</strong>
                  <p>Usa tu teléfono para escanear el QR dentro del tiempo permitido</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <strong>Registro automático</strong>
                  <p>Tu asistencia se registra automáticamente con la hora exacta</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}