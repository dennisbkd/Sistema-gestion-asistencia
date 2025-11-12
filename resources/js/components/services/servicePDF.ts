import PDFGenerator from "./generarPDF";
import { RowInput } from "jspdf-autotable";

// Tipo genérico para cualquier sección de reporte
export type ReportData<T extends Record<string, unknown>> = {
  titulo: string;       // Título de la sección
  columnas: string[];   // Nombres de las columnas
  datos: T[];           // Array de objetos con los datos
  mapearDatos?: (item: T) => RowInput; // Función opcional para mapear datos
};

// Tipo genérico para la función
export type PDFConfig<T extends Record<string, unknown>> = {
  periodo?: { año: number; nroSemestre: number };
  filters?: Record<string, string>;
  secciones: ReportData<T>[];
  opcion?: "descargar" | "imprimir";
  nombreArchivo?: string;
};

export const generarPDF = <T extends Record<string, unknown>>(config: PDFConfig<T>) => {
  const generator = new PDFGenerator();

  // Encabezado con el período si existe
  generator
    .inicializar()
    .agregarEncabezado(
      config.periodo ? `Reporte Período ${config.periodo.año}-${config.periodo.nroSemestre}` : "Reporte"
    );

  // Metadata (filtros)
  if (config.filters) {
    generator.agregarMetadata(config.filters);
  }

  // Secciones dinámicas
  config.secciones.forEach((seccion) => {
    generator.agregarSeccion({
      titulo: seccion.titulo,
      columnas: seccion.columnas,
      datos: seccion.datos,
      mapearDatos: seccion.mapearDatos,
    });
  });

  // Generar PDF
  return generator.generar(config.nombreArchivo || "reporte.pdf", config.opcion || "descargar");
};