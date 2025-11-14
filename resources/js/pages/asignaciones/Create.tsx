// pages/asignaciones/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Calendar, Clock, Building, AlertCircle } from 'lucide-react';
import { CreateAsignacionProps } from './types/asignaciones';
import asignaciones from '@/routes/asignaciones';
import { toast } from 'sonner';

interface HorarioForm {
  idBloque: number;
  idAula: number;
}

export default function Create({ periodos, materias, docentes, grupos, bloques, aulas }: CreateAsignacionProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Asignaciones', href: asignaciones.index().url },
    { title: 'Nueva Asignación', href: '#' },
  ];

  const [formData, setFormData] = useState({
    idPeriodo: '',
    idMateria: '',
    idDocente: '',
    idGrupo: '',
    modalidad: 'presencial',
    inscritos: '',
  });

  const [horarios, setHorarios] = useState<HorarioForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ CORREGIDO: Función segura para getNombreDia
  const getNombreDia = (diaSemana: number | null | undefined) => {
    const dias = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    if (!diaSemana || diaSemana < 1 || diaSemana > 7) {
      return "No definido";
    }
    return dias[diaSemana] || "No definido";
  };

  // ✅ CORREGIDO: Función segura para formatHora
  const formatHora = (horaString: string | null | undefined) => {
    if (!horaString) return '-';

    try {
      const match = horaString.match(/(\d{2}:\d{2})/);
      return match ? match[1] : horaString;
    } catch (error) {
      return '-';
    }
  };

  const getTurnoBadge = (turno: string | null | undefined) => {
    // Manejar valores null/undefined/vacíos
    if (!turno) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          No definido
        </Badge>
      );
    }

    const colors = {
      mañana: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tarde: 'bg-orange-100 text-orange-800 border-orange-200',
      noche: 'bg-blue-100 text-blue-800 border-blue-200',
    } as const;

    // ✅ CORREGIDO: Usar optional chaining y fallback
    const turnoCapitalizado = turno?.charAt(0)?.toUpperCase() + turno?.slice(1) || 'No definido';

    return (
      <Badge variant="outline" className={colors[turno as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {turnoCapitalizado}
      </Badge>
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'inscritos' ? parseInt(value) || 0 : value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddHorario = () => {
    setHorarios(prev => [...prev, { idBloque: 0, idAula: 0 }]);
  };

  const handleRemoveHorario = (index: number) => {
    setHorarios(prev => prev.filter((_, i) => i !== index));
  };

  const handleHorarioChange = (index: number, field: keyof HorarioForm, value: string) => {
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

    // Validar que todos los horarios tengan bloque y aula seleccionados
    horarios.forEach((horario, index) => {
      if (!horario.idBloque) newErrors[`horario_${index}_bloque`] = 'El bloque es requerido';
      if (!horario.idAula) newErrors[`horario_${index}_aula`] = 'El aula es requerida';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMateriaNombre = () => {
    const materia = materias.find(m => m.idMateria.toString() === formData.idMateria);
    return materia ? `${materia.sigla} - ${materia.nombre}` : 'Asignación';
  };

  const getDocenteNombre = () => {
    const docente = docentes.find(d => d.idDocente.toString() === formData.idDocente);
    return docente ? docente.usuario.name : 'Docente';
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Mostrar toast de error de validación
      toast.error('Por favor complete todos los campos requeridos', {
        description: 'Revise los campos marcados en rojo'
      });
      return;
    }

    const submitData = {
      ...formData,
      idPeriodo: parseInt(formData.idPeriodo),
      idMateria: parseInt(formData.idMateria),
      idDocente: parseInt(formData.idDocente),
      idGrupo: parseInt(formData.idGrupo),
      inscritos: parseInt(formData.inscritos.toString()) || 0,
      horarios: horarios.map(h => ({
        idBloque: h.idBloque,
        idAula: h.idAula
      }))
    };

    setIsSubmitting(true);

    const createPromise = new Promise((resolve, reject) => {
      router.post(asignaciones.store().url, submitData, {
        onSuccess: () => {
          resolve('success');
          // Resetear formulario después de éxito
          setFormData({
            idPeriodo: '',
            idMateria: '',
            idDocente: '',
            idGrupo: '',
            modalidad: 'presencial',
            inscritos: '',
          });
          setHorarios([]);
          setErrors({});
        },
        onError: (errors) => {
          // Manejar errores específicos del backend
          if (errors.error) {
            reject(new Error(errors.error));
          } else {
            const errorMessages = Object.values(errors).join(', ');
            reject(new Error(errorMessages || 'Error al crear la asignación'));
          }
        },
        onFinish: () => {
          setIsSubmitting(false);
        }
      });
    });

    toast.promise(createPromise, {
      loading: 'Creando asignación...',
      success: () => {
        return `Asignación "${getMateriaNombre()}" creada exitosamente para ${getDocenteNombre()}`;
      },
      error: (error) => {
        return `${error.message}`;
      },
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
      <Head title="Nueva Asignación" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nueva Asignación</h1>
            <p className="text-muted-foreground">
              Crear una nueva asignación de materia a docente y grupo
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Seleccione el período, materia, docente y grupo para la asignación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Período */}
                <div className="space-y-2">
                  <Label htmlFor="idPeriodo">Período Académico *</Label>
                  <Select
                    value={formData.idPeriodo}
                    onValueChange={(value) => handleInputChange('idPeriodo', value)}
                    disabled={isSubmitting}
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
                  {errors.idPeriodo && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.idPeriodo}
                    </p>
                  )}
                </div>

                {/* Materia */}
                <div className="space-y-2">
                  <Label htmlFor="idMateria">Materia *</Label>
                  <Select
                    value={formData.idMateria}
                    onValueChange={(value) => handleInputChange('idMateria', value)}
                    disabled={isSubmitting}
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
                  {errors.idMateria && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.idMateria}
                    </p>
                  )}
                </div>

                {/* Docente */}
                <div className="space-y-2">
                  <Label htmlFor="idDocente">Docente *</Label>
                  <Select
                    value={formData.idDocente}
                    onValueChange={(value) => handleInputChange('idDocente', value)}
                    disabled={isSubmitting}
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
                  {errors.idDocente && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.idDocente}
                    </p>
                  )}
                </div>

                {/* Grupo */}
                <div className="space-y-2">
                  <Label htmlFor="idGrupo">Grupo *</Label>
                  <Select
                    value={formData.idGrupo}
                    onValueChange={(value) => handleInputChange('idGrupo', value)}
                    disabled={isSubmitting}
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
                  {errors.idGrupo && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.idGrupo}
                    </p>
                  )}
                </div>

                {/* Modalidad */}
                <div className="space-y-2">
                  <Label htmlFor="modalidad">Modalidad</Label>
                  <Select
                    value={formData.modalidad}
                    onValueChange={(value) => handleInputChange('modalidad', value)}
                    disabled={isSubmitting}
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
                </div>

                {/* Inscritos */}
                <div className="space-y-2">
                  <Label htmlFor="inscritos">Estudiantes Inscritos</Label>
                  <Input
                    id="inscritos"
                    type="number"
                    min="0"
                    value={formData.inscritos}
                    onChange={(e) => handleInputChange('inscritos', e.target.value)}
                    placeholder=""
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horarios */}
          <Card>
            <CardHeader>
              <CardTitle>Horarios</CardTitle>
              <CardDescription>
                Agregue los horarios y aulas para esta asignación
              </CardDescription>
              {errors.horarios && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.horarios}
                </p>
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveHorario(index)}
                          className="text-red-600 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Bloque Horario */}
                        <div className="space-y-2">
                          <Label htmlFor={`bloque-${index}`}>Bloque Horario *</Label>
                          <Select
                            value={horario.idBloque.toString()}
                            onValueChange={(value) => handleHorarioChange(index, 'idBloque', value)}
                            disabled={isSubmitting}
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
                          {errors[`horario_${index}_bloque`] && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors[`horario_${index}_bloque`]}
                            </p>
                          )}
                        </div>

                        {/* Aula */}
                        <div className="space-y-2">
                          <Label htmlFor={`aula-${index}`}>Aula *</Label>
                          <Select
                            value={horario.idAula.toString()}
                            onValueChange={(value) => handleHorarioChange(index, 'idAula', value)}
                            disabled={isSubmitting}
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
                          {errors[`horario_${index}_aula`] && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors[`horario_${index}_aula`]}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Vista previa del horario seleccionado */}
                      {(bloqueSeleccionado || aulaSeleccionada) && (
                        <div className="mt-3 p-3 bg-background border rounded">
                          <p className="text-sm font-medium">Vista previa:</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {bloqueSeleccionado && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{getNombreDia(bloqueSeleccionado.diaSemana)}</span>
                                <Clock className="h-4 w-4 ml-2" />
                                <span>{formatHora(bloqueSeleccionado.horaInicio)}-{formatHora(bloqueSeleccionado.horaFin)}</span>
                                {getTurnoBadge(bloqueSeleccionado.turno)}
                              </div>
                            )}
                            {aulaSeleccionada && (
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                <span>{aulaSeleccionada.codigoAula}</span>
                                <Badge variant="outline" className="ml-2">
                                  {aulaSeleccionada.tipo}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Botón agregar horario */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddHorario}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" />
                  Agregar Horario
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4 justify-end">
            <Link href={asignaciones.index().url}>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Asignación'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}