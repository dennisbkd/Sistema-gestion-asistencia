import { useState, useRef, useEffect } from "react";
import { Download, Printer, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generarPDF, ReportData } from "@/components/services/servicePDF";

interface MenuExportarProps<T extends Record<string, unknown>> {
  periodo?: { año: number; nroSemestre: number };
  filters?: Record<string, string>;
  secciones: ReportData<T>[];
  disabled?: boolean;
}

export const MenuExportar = <T extends Record<string, unknown>>({ 
  periodo, 
  filters, 
  secciones, 
  disabled = false 
}: MenuExportarProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDescargar = () => {
    generarPDF<T>({ periodo, filters, secciones, opcion: "descargar" });
    setIsOpen(false);
  };

  const handleImprimir = () => {
    generarPDF<T>({ periodo, filters, secciones, opcion: "imprimir" });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        <Download size={16} />
        Exportar
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]">
          <button
            onClick={handleDescargar}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Download size={16} />
            Descargar PDF
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={handleImprimir}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Printer size={16} />
            Imprimir
          </button>
        </div>
      )}
    </div>
  );
};
