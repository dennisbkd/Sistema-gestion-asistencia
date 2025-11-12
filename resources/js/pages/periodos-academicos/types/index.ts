export interface PeriodoAcademico {
  idPeriodo: number;
  nroSemestre: number;
  año: number;
  tipoPeriodo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  created_at: string;
  asignaciones_count?: number;
}

export interface IndexProps {
  periodos: PeriodoAcademico[];
  filters: {
    search: string;
    estado: string;
  };
}