// pages/asignaciones/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, /*useEffect*/ } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Plus, Trash2, Calendar, Building, AlertTriangle } from 'lucide-react';
import { EditAsignacionProps } from './types/asignaciones';
import asignaciones from '@/routes/asignaciones';

interface HorarioForm {
  idBloque: number;
  idAula: number;
}

export default function Edit({ asignacion, periodos, materias, docentes, grupos, bloques, aulas }: EditAsignacionProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Asignaciones', href: asignaciones.index().url },
    { title: `Editar - ${asignacion.materia?.sigla}`, href: '#' },
  ];

  // Verificar si el período está finalizado
  const periodoFinalizado = asignacion.periodo?.estado === 'finalizado';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    idPeriodo: asignacion.idPeriodo.toString(),
    idMateria: asignacion.idMateria.toString(),
    idDocente: asignacion.idDocente.toString(),
    idGrupo: asignacion.idGrupo.toString(),
    modalidad: asignacion.modalidad,
    inscritos: asignacion.inscritos,
  });

  const [horarios, setHorarios] = useState<HorarioForm[]>(() => {
    if (asignacion.horarios) {
        return asignacion.horarios.map(horario => ({
        idBloque: horario.idBloque,
        idAula: horario.idAula
        }));
    }
    return [];
    });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar horarios existentes al inicializar
//   useEffect(() => {
//     if (asignacion.horarios) {
//       const horariosIniciales = asignacion.horarios.map(horario => ({
//         idBloque: horario.idBloque,
//         idAula: horario.idAula
//       }));
//       setHorarios(horariosIniciales);
//     }
//   }, [asignacion.horarios]);

  const getNombreDia = (diaSemana: number) => {
    const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return dias[diaSemana] || "No definido";
  };

  const formatHora = (horaString: string) => {
    if (!horaString) return '-';
    const match = horaString.match(/(\d{2}:\d{2})/);
    return match ? match[1] : horaString;
  };

  const getTurnoBadge = (turno: string) => {
    const colors = {
      mañana: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tarde: 'bg-orange-100 text-orange-800 border-orange-200',
      noche: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    return (
      <Badge variant="outline" className={colors[turno as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {turno.charAt(0).toUpperCase() + turno.slice(1)}
      </Badge>
    );
  };

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

  const handleInputChange = (field: string, value: string) => {
    if (periodoFinalizado) return; // Bloquear cambios si el período está finalizado
    
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'inscritos' ? parseInt(value) || 0 : value 
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddHorario = () => {
    if (periodoFinalizado) return;
    setHorarios(prev => [...prev, { idBloque: 0, idAula: 0 }]);
  };

  const handleRemoveHorario = (index: number) => {
    if (periodoFinalizado) return;
    setHorarios(prev => prev.filter((_, i) => i !== index));
  };

  const handleHorarioChange = (index: number, field: keyof HorarioForm, value: string) => {
    if (periodoFinalizado) return;
    setHorarios(prev => prev.map((horario, i) => 
      i === index ? { ...horario, [field]: parseInt(value) || 0 } : horario
    ));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.idPeriodo) newErrors.idPeriodo = 'El período es requerido';
    if (!formData.idMateria) newErrors.idMateria = 'La materia es requerida';
    if (!formData.idDocente) newErrors.idDocente = 'El docente es requerido';
    if (!formData.idGrupo) newErrors.idGrupo = 'El grupo es requerido';
    if (horarios.length === 0) newErrors.horarios = 'Debe agregar al menos un horario';

    horarios.forEach((horario, index) => {
      if (!horario.idBloque || horario.idBloque === 0) {
        newErrors[`horario_${index}_bloque`] = 'El bloque es requerido';
      }
      if (!horario.idAula || horario.idAula === 0) {
        newErrors[`horario_${index}_aula`] = 'El aula es requerida';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (periodoFinalizado) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = {
      ...formData,
      idPeriodo: parseInt(formData.idPeriodo),
      idMateria: parseInt(formData.idMateria),
      idDocente: parseInt(formData.idDocente),
      idGrupo: parseInt(formData.idGrupo),
      inscritos: formData.inscritos,
      horarios: horarios.map(h => ({
        idBloque: h.idBloque,
        idAula: h.idAula
      }))
    };

    console.log('📤 Datos enviados al servidor:', submitData);
    console.log('📝 Inscritos value:', formData.inscritos);
    console.log('📝 Tipo de inscritos:', typeof formData.inscritos);

    router.put(asignaciones.update(asignacion.idAsignacion).url, submitData, {
      onSuccess: () => {
        // Redirigirá automáticamente al index con mensaje de éxito
      },
      onError: (errors) => {
        setErrors(errors as Record<string, string>);
        setIsSubmitting(false);
      }
    });
  };

  const getBloqueById = (idBloque: number) => {
    return bloques.find(bloque => bloque.idBloque === idBloque);
  };

  const getAulaById = (idAula: number) => {
    return aulas.find(aula => aula.id === idAula);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Asignación - ${asignacion.materia?.sigla}`} />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {periodoFinalizado ? 'Ver Asignación' : 'Editar Asignación'}
            </h1>
            <p className="text-muted-foreground">
              {asignacion.materia?.sigla} - {asignacion.materia?.nombre}
            </p>
          </div>

          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Alerta si el período está finalizado */}
        {periodoFinalizado && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Esta asignación no puede ser editada</strong> porque pertenece a un período académico finalizado. 
              Solo puede visualizar la información.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                {periodoFinalizado ? 'Información de la asignación' : 'Edite la información de la asignación'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Período (solo lectura si está finalizado) */}
                <div className="space-y-2">
                  <Label htmlFor="idPeriodo">Período Académico</Label>
                  {periodoFinalizado ? (
                    <div className="p-2 border rounded-md bg-muted">
                      <p className="font-medium">
                        {asignacion.periodo?.año} - Semestre {asignacion.periodo?.nroSemestre}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {asignacion.periodo?.tipoPeriodo} • {getEstadoBadge(asignacion.periodo?.estado || '')}
                      </p>
                    </div>
                  ) : (
                    <Select
                      value={formData.idPeriodo}
                      onValueChange={(value) => handleInputChange('idPeriodo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un período" />
                      </SelectTrigger>
                      <SelectContent>
                        {periodos.map((periodo) => (
                          <SelectItem key={periodo.idPeriodo} value={periodo.idPeriodo.toString()}>
                            {periodo.año} - Semestre {periodo.nroSemestre} ({periodo.tipoPeriodo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.idPeriodo && (
                    <p className="text-sm text-red-600">{errors.idPeriodo}</p>
                  )}
                </div>

                {/* Materia */}
                <div className="space-y-2">
                  <Label htmlFor="idMateria">Materia *</Label>
                  {periodoFinalizado ? (
                    <div className="p-2 border rounded-md bg-muted">
                      <p className="font-medium">{asignacion.materia?.sigla}</p>
                      <p className="text-sm text-muted-foreground">{asignacion.materia?.nombre}</p>
                    </div>
                  ) : (
                    <Select
                      value={formData.idMateria}
                      onValueChange={(value) => handleInputChange('idMateria', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una materia" />
                      </SelectTrigger>
                      <SelectContent>
                        {materias.map((materia) => (
                          <SelectItem key={materia.idMateria} value={materia.idMateria.toString()}>
                            {materia.sigla} - {materia.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.idMateria && (
                    <p className="text-sm text-red-600">{errors.idMateria}</p>
                  )}
                </div>

                {/* Docente */}
                <div className="space-y-2">
                  <Label htmlFor="idDocente">Docente *</Label>
                  {periodoFinalizado ? (
                    <div className="p-2 border rounded-md bg-muted">
                      <p className="font-medium">{asignacion.docente?.usuario.name}</p>
                      <p className="text-sm text-muted-foreground">{asignacion.docente?.codigoDocente}</p>
                    </div>
                  ) : (
                    <Select
                      value={formData.idDocente}
                      onValueChange={(value) => handleInputChange('idDocente', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un docente" />
                      </SelectTrigger>
                      <SelectContent>
                        {docentes.map((docente) => (
                          <SelectItem key={docente.idDocente} value={docente.idDocente.toString()}>
                            {docente.usuario.name} ({docente.codigoDocente})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.idDocente && (
                    <p className="text-sm text-red-600">{errors.idDocente}</p>
                  )}
                </div>

                {/* Grupo */}
                <div className="space-y-2">
                  <Label htmlFor="idGrupo">Grupo *</Label>
                  {periodoFinalizado ? (
                    <div className="p-2 border rounded-md bg-muted">
                      <p className="font-medium">{asignacion.grupo?.codigoGrupo}</p>
                      <p className="text-sm text-muted-foreground">
                        {getEstadoBadge(asignacion.grupo?.estado || '')}
                      </p>
                    </div>
                  ) : (
                    <Select
                      value={formData.idGrupo}
                      onValueChange={(value) => handleInputChange('idGrupo', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {grupos.map((grupo) => (
                          <SelectItem key={grupo.idGrupo} value={grupo.idGrupo.toString()}>
                            {grupo.codigoGrupo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.idGrupo && (
                    <p className="text-sm text-red-600">{errors.idGrupo}</p>
                  )}
                </div>

                {/* Modalidad */}
                <div className="space-y-2">
                  <Label htmlFor="modalidad">Modalidad</Label>
                  {periodoFinalizado ? (
                    <div className="p-2 border rounded-md bg-muted">
                      <p className="font-medium capitalize">{asignacion.modalidad}</p>
                    </div>
                  ) : (
                    <Select
                      value={formData.modalidad}
                      onValueChange={(value) => handleInputChange('modalidad', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="hibrida">Híbrida</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Inscritos */}
                <div className="space-y-2">
                  <Label htmlFor="inscritos">Estudiantes Inscritos</Label>
                  {periodoFinalizado ? (
                    <div className="p-2 border rounded-md bg-muted">
                      <p className="font-medium">{asignacion.inscritos}</p>
                    </div>
                  ) : (
                    <Input
                      id="inscritos"
                      type="number"
                      min=""
                      value={formData.inscritos}
                      onChange={(e) => handleInputChange('inscritos', e.target.value)}
                      placeholder=""
                    />
                  )}
                </div>
              </div>

              {/* Estado de la asignación (solo lectura) */}
              <div className="mt-6 pt-6 border-t">
                <Label>Estado de la Asignación</Label>
                <div className="mt-2">
                  {getEstadoBadge(asignacion.estado)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horarios */}
          <Card>
            <CardHeader>
              <CardTitle>Horarios</CardTitle>
              <CardDescription>
                {periodoFinalizado ? 'Horarios asignados' : 'Edite los horarios y aulas para esta asignación'}
              </CardDescription>
              {errors.horarios && (
                <p className="text-sm text-red-600">{errors.horarios}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lista de horarios */}
                {horarios.map((horario, index) => {
                  const bloqueSeleccionado = getBloqueById(horario.idBloque);
                  const aulaSeleccionada = getAulaById(horario.idAula);

                  return (
                    <div key={index} className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Horario {index + 1}</h4>
                        {!periodoFinalizado && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveHorario(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Bloque Horario */}
                        <div className="space-y-2">
                          <Label htmlFor={`bloque-${index}`}>Bloque Horario *</Label>
                          {periodoFinalizado ? (
                            <div className="p-2 border rounded-md bg-muted">
                              {bloqueSeleccionado ? (
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {getNombreDia(bloqueSeleccionado.diaSemana)} {formatHora(bloqueSeleccionado.horaInicio)}-{formatHora(bloqueSeleccionado.horaFin)}
                                  </span>
                                  {getTurnoBadge(bloqueSeleccionado.turno)}
                                </div>
                              ) : (
                                <p className="text-muted-foreground">No seleccionado</p>
                              )}
                            </div>
                          ) : (
                            <Select
                              value={horario.idBloque.toString()}
                              onValueChange={(value) => handleHorarioChange(index, 'idBloque', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un bloque" />
                              </SelectTrigger>
                              <SelectContent>
                                {bloques.map((bloque) => (
                                  <SelectItem key={bloque.idBloque} value={bloque.idBloque.toString()}>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {getNombreDia(bloque.diaSemana)} {formatHora(bloque.horaInicio)}-{formatHora(bloque.horaFin)}
                                      </span>
                                      {getTurnoBadge(bloque.turno)}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {errors[`horario_${index}_bloque`] && (
                            <p className="text-sm text-red-600">{errors[`horario_${index}_bloque`]}</p>
                          )}
                        </div>

                        {/* Aula */}
                        <div className="space-y-2">
                          <Label htmlFor={`aula-${index}`}>Aula *</Label>
                          {periodoFinalizado ? (
                            <div className="p-2 border rounded-md bg-muted">
                              {aulaSeleccionada ? (
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  <span>{aulaSeleccionada.codigoAula}</span>
                                  <Badge variant="outline">{aulaSeleccionada.tipo}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    ({aulaSeleccionada.capacidad} est.)
                                  </span>
                                </div>
                              ) : (
                                <p className="text-muted-foreground">No seleccionada</p>
                              )}
                            </div>
                          ) : (
                            <Select
                              value={horario.idAula.toString()}
                              onValueChange={(value) => handleHorarioChange(index, 'idAula', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione un aula" />
                              </SelectTrigger>
                              <SelectContent>
                                {aulas.filter(aula => aula.activo).map((aula) => (
                                  <SelectItem key={aula.id} value={aula.id.toString()}>
                                    <div className="flex items-center gap-2">
                                      <Building className="h-4 w-4" />
                                      <span>{aula.codigoAula}</span>
                                      <Badge variant="outline">{aula.tipo}</Badge>
                                      <span className="text-xs text-muted-foreground">
                                        ({aula.capacidad} est.)
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {errors[`horario_${index}_aula`] && (
                            <p className="text-sm text-red-600">{errors[`horario_${index}_aula`]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Botón agregar horario (solo si no está finalizado) */}
                {!periodoFinalizado && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddHorario}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Horario
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-end">
            <Link href={asignaciones.index().url}>
              <Button type="button" variant="outline">
                {periodoFinalizado ? 'Volver' : 'Cancelar'}
              </Button>
            </Link>
            
            {!periodoFinalizado && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Actualizar Asignación'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}