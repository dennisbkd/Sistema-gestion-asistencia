// types/asignaciones.ts
export interface HorarioAsignacion {
  idHorarioAsignacion: number;
  idAsignacion: number;
  idBloque: number;
  idAula: number;
  estado: string;
  bloque?: {
    idBloque: number;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    turno: string;
  };
  aula?: {
    id: number;
    codigoAula: string;
    capacidad: number;
    tipo: string;
  };
}

export interface Asignacion {
  idAsignacion: number;
  idPeriodo: number;
  idMateria: number;
  idDocente: number;
  idGrupo: number;
  modalidad: string;
  estado: string;
  inscritos: number;
  created_at?: string;
  updated_at?: string;
  
  // Relaciones cargadas
  periodo?: {
    idPeriodo: number;
    nroSemestre: number;
    año: number;
    tipoPeriodo: string;
    fechaInicio: string;
    fechaFin: string;
    estado: string;
  };
  materia?: {
    idMateria: number;
    sigla: string;
    nombre: string;
    semestre: number;
    horasSemanales: number;
    estado: string;
  };
  docente?: {
    idDocente: number;
    codigoDocente: string;
    usuario: {
      name: string;
      email: string;
    };
    telefono?: string;
    especialidad?: string;
    estado: string;
  };
  grupo?: {
    idGrupo: number;
    codigoGrupo: string;
    estado: string;
  };
  horarios?: HorarioAsignacion[];
}

  // types/asignaciones.ts
  export interface AsignacionIndexProps {
    asignaciones: Asignacion[];
    periodos: Array<{
      idPeriodo: number;
      nroSemestre: number;
      año: number;
      tipoPeriodo: string;
    }>;
    filters?: {
      search?: string;
      estado?: string;
      periodo?: string;
    };
}

export interface AsignacionDetailProps {
  asignacion: Asignacion;
}

export interface HorarioDetalle {
  idHorarioAsignacion: number;
  idBloque: number;
  idAula: number;
  estado: string;
  bloque: {
    idBloque: number;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    turno: string;
  };
  aula: {
    id: number;
    codigoAula: string;
    capacidad: number;
    tipo: string;
  };
}

export interface CreateAsignacionData {
  idPeriodo: number;
  idMateria: number;
  idDocente: number;
  idGrupo: number;
  modalidad: string;
  inscritos: number;
  horarios: Array<{
    idBloque: number;
    idAula: number;
  }>;
}

export interface CreateAsignacionProps {
  periodos: Array<{
    idPeriodo: number;
    nroSemestre: number;
    año: number;
    tipoPeriodo: string;
    estado: string;
  }>;
  materias: Array<{
    idMateria: number;
    sigla: string;
    nombre: string;
    semestre: number;
    horasSemanales: number;
    estado: string;
  }>;
  docentes: Array<{
    idDocente: number;
    codigoDocente: string;
    usuario: {
      name: string;
      email: string;
    };
    estado: string;
  }>;
  grupos: Array<{
    idGrupo: number;
    codigoGrupo: string;
    estado: string;
  }>;
  bloques: Array<{
    idBloque: number;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    turno: string;
  }>;
  aulas: Array<{
    id: number;
    codigoAula: string;
    capacidad: number;
    tipo: string;
    activo: boolean;
  }>;
}

  export interface EditAsignacionProps {
    asignacion: Asignacion;
    periodos: Array<{
      idPeriodo: number;
      nroSemestre: number;
      año: number;
      tipoPeriodo: string;
      estado: string;
      fechaFin: string;
    }>;
    materias: Array<{
      idMateria: number;
      sigla: string;
      nombre: string;
      semestre: number;
      horasSemanales: number;
      estado: string;
    }>;
    docentes: Array<{
      idDocente: number;
      codigoDocente: string;
      usuario: {
        name: string;
        email: string;
      };
      estado: string;
    }>;
    grupos: Array<{
      idGrupo: number;
      codigoGrupo: string;
      estado: string;
    }>;
    bloques: Array<{
      idBloque: number;
      diaSemana: number;
      horaInicio: string;
      horaFin: string;
      turno: string;
    }>;
    aulas: Array<{
      id: number;
      codigoAula: string;
      capacidad: number;
      tipo: string;
      activo: boolean;
    }>;
  }

  export interface UpdateAsignacionData {
    idPeriodo: number;
    idMateria: number;
    idDocente: number;
    idGrupo: number;
    modalidad: string;
    inscritos: number;
    horarios: Array<{
      idBloque: number;
      idAula: number;
    }>;
  }