export interface BloqueHorario {
  idBloque: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  turno: string;
  horarios_asignacion_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface HorarioAsignacion {
  idHorarioAsignacion: number; // ✅ Agregado
  idAsignacion: number;
  idBloque: number;
  idAula: number;
  estado: string; // ✅ Agregado
  asignacion: {
    materia: {
      idMateria: number;
      sigla: string;
      nombre: string;
    };
    docente: {
      idDocente: number;
      codigoDocente: string;
      usuario: {
        name: string;
        email: string;
      };
    };
    grupo: {
      idGrupo: number;
      codigoGrupo: string;
    };
  };
  aula: {
    id: number;
    codigoAula: string;
    capacidad: number;
    tipo: string;
    ubicacion?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface DetalleBloqueHorarioProps {
  bloque: BloqueHorario;
  horarios: HorarioAsignacion[];
  materias: Array<{
    idMateria: number;
    sigla: string;
    nombre: string;
  }>;
  docentes: Array<{
    idDocente: number;
    codigoDocente: string;
    usuario: {
      name: string;
      email: string;
    };
  }>;
  grupos: Array<{
    idGrupo: number;
    codigoGrupo: string;
  }>;
  aulas: Array<{
    id: number;
    codigoAula: string;
    capacidad: number;
    tipo: string;
  }>;
  aulasLibres: Array<{
    id: number;
    codigoAula: string;
    capacidad: number;
    tipo: string;
  }>;
}

export interface BloqueHorarioIndexProps {
  bloques: BloqueHorario[];
  filters: {
    search?: string;
    diaSemana?: string;
    turno?: string;
  };
}