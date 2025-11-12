import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

// Interfaz para el objeto autoTable extendido
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

export default class PDFGenerator {
  private doc: jsPDFWithAutoTable | null = null;
  private yPos = 0;

  private config = {
    empresa: {
      nombre: "Sistema Academico",
      colorPrimario: [41, 128, 185] as [number, number, number],
    },
  };

  inicializar(orientacion: "portrait" | "landscape" = "portrait", formato: string | [number, number] = "a4") {
    this.doc = new jsPDF({
      orientation: orientacion,
      unit: "mm",
      format: formato,
    }) as jsPDFWithAutoTable;
    this.yPos = 20;
    return this;
  }

  agregarEncabezado(subtitulo = "") {
    if (!this.doc) throw new Error("Debe inicializar el documento primero");

    // Nombre de empresa
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(18);
    this.doc.text(this.config.empresa.nombre, 105, this.yPos, { align: "center" });
    this.yPos += 10;

    // Subtítulo
    if (subtitulo) {
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(14);
      this.doc.text(subtitulo, 105, this.yPos, { align: "center" });
      this.yPos += 8;
    }

    // Línea decorativa
    this.doc.setDrawColor(...this.config.empresa.colorPrimario);
    this.doc.setLineWidth(0.5);
    this.doc.line(10, this.yPos, 200, this.yPos);
    this.yPos += 15;

    return this;
  }

  agregarMetadata(metadata: Record<string, string | number>) {
    if (!this.doc) throw new Error("Debe inicializar el documento primero");

    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(80);

    Object.entries(metadata).forEach(([key, value], index) => {
      this.doc!.text(`${key}: ${value}`, 15, this.yPos + index * 6);
    });

    this.yPos += Object.keys(metadata).length * 6 + 10;
    return this;
  }

  agregarSeccion<T extends Record<string, unknown>>({
    titulo,
    columnas,
    datos,
    mapearDatos,
  }: {
    titulo: string;
    columnas: string[];
    datos: T[];
    mapearDatos?: (item: T) => RowInput;
  }) {
    if (!this.doc) throw new Error("Debe inicializar el documento primero");

    // Título de la sección
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(titulo.toUpperCase(), 15, this.yPos);
    this.yPos += 8;

    // Si no hay datos
    if (!datos || datos.length === 0) {
      this._agregarTexto("No hay datos disponibles");
      this.yPos += 10;
      return this;
    }

    // Procesar los datos
    const body = mapearDatos
      ? datos.map(mapearDatos)
      : datos.map((item) => columnas.map((col) => this._obtenerValor(item, col)));

    autoTable(this.doc, {
      head: [columnas],
      body,
      startY: this.yPos,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: {
        fillColor: this.config.empresa.colorPrimario,
        textColor: 255,
        halign: "center",
        fontSize: 9,
      },
    });

    this.yPos = this.doc.lastAutoTable?.finalY ? this.doc.lastAutoTable.finalY + 10 : this.yPos + 100;
    return this;
  }

  private _agregarTexto(texto: string) {
    if (!this.doc) return;
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(80);
    const lineas = this.doc.splitTextToSize(texto, 180);
    lineas.forEach((linea: string) => {
      this.doc!.text(linea, 20, this.yPos);
      this.yPos += 5;
    });
  }

  private _obtenerValor(obj: Record<string, unknown>, key: string): string {
    const claveNormalizada = key
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[áéíóú]/g, (m) => "aeiou"["áéíóú".indexOf(m)]);

    const encontrado = Object.keys(obj).find(
      (k) => k.toLowerCase().replace(/\s/g, "") === claveNormalizada
    );

    let valor = encontrado ? obj[encontrado] : "-";
    if (valor == null || valor === "") valor = "-";
    if (typeof valor === "boolean") valor = valor ? "Sí" : "No";
    if (valor instanceof Date) valor = valor.toLocaleDateString("es-ES");

    return String(valor);
  }

  agregarPiePagina() {
    if (!this.doc) throw new Error("Debe inicializar el documento primero");

    const totalPages = this.doc.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(150);
      this.doc.text(
        `Página ${i} de ${totalPages} - Generado el ${new Date().toLocaleString()}`,
        105,
        290,
        { align: "center" }
      );
    }
    return this;
  }

  generar(nombreArchivo = "reporte.pdf", opcion: "descargar" | "imprimir" = "descargar") {
    if (!this.doc) throw new Error("Debe inicializar el documento primero");

    this.agregarPiePagina();

    if (opcion === "imprimir") {
      this.doc.autoPrint();
      window.open(this.doc.output("bloburl"));
    } else {
      this.doc.save(nombreArchivo);
    }

    return this.doc;
  }
}