// asignaciones/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import asignaciones from '@/routes/asignaciones';
import { AsignacionIndexProps, Asignacion } from './types/asignaciones';
import { AsignacionStats } from './components/AsignacionStats';
import { AsignacionFilters } from './components/AsignacionFilters';
import { AsignacionTable } from './components/AsignacionTable';
import { MenuExportar } from '@/components/MenuExportar';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Asignaciones',
    href: asignaciones.index().url,
  },
];

interface IndexProps extends AsignacionIndexProps {
  periodos: Array<{
    idPeriodo: number;
    nroSemestre: number;
    año: number;
    tipoPeriodo: string;
    estado: string;
  }>;
}

export default function Index({ asignaciones: asignacionesData, periodos, filters: initialFilters }: IndexProps) {
  // Inicializar estado directamente desde las props
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [selectedEstado, setSelectedEstado] = useState(initialFilters?.estado || 'all');
  const [selectedPeriodo, setSelectedPeriodo] = useState(initialFilters?.periodo || 'all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedEstado && selectedEstado !== 'all') params.append('estado', selectedEstado);
    if (selectedPeriodo && selectedPeriodo !== 'all') params.append('periodo', selectedPeriodo);

    router.get(asignaciones.index().url + `?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedEstado('all');
    setSelectedPeriodo('all');
    router.get(asignaciones.index().url);
  };

  // 🧾 Función para mostrar los filtros en texto legible
  const obtenerFiltrosLegibles = () => {
    const filtroLegible: Record<string, string> = {};

    if (search) filtroLegible["Búsqueda"] = search;
    if (selectedEstado && selectedEstado !== 'all') {
      filtroLegible["Estado"] = selectedEstado.charAt(0).toUpperCase() + selectedEstado.slice(1);
    }
    if (selectedPeriodo && selectedPeriodo !== 'all') {
      const periodo = periodos.find(p => p.idPeriodo.toString() === selectedPeriodo);
      filtroLegible["Período"] = periodo ? `${periodo.año} - Semestre ${periodo.nroSemestre}` : selectedPeriodo;
    }

    return filtroLegible;
  };

  const obtenerPeriodoActual = () => {
    if (selectedPeriodo && selectedPeriodo !== 'all') {
      const periodo = periodos.find(p => p.idPeriodo.toString() === selectedPeriodo);
      if (periodo) {
        return { año: periodo.año, nroSemestre: periodo.nroSemestre };
      }
    }
    // Si no hay período seleccionado, usar el primero o valores por defecto
    const periodoActivo = periodos.find(p => p.estado === 'activo');
    if (periodoActivo) {
      return { año: periodoActivo.año, nroSemestre: periodoActivo.nroSemestre };
    }
    return { año: new Date().getFullYear(), nroSemestre: 1 };
  };

  // 🧾 Estructura de las secciones del PDF
  const seccionesReporte = [
    {
      titulo: "Asignaciones del Sistema",
      columnas: ["Docente", "Materia", "Grupo", "Modalidad", "Estado", "Inscritos"],
      datos: asignacionesData,
      mapearDatos: (asignacion: Asignacion) => [
        asignacion.docente?.usuario.name || 'N/A',
        `${asignacion.materia?.sigla} - ${asignacion.materia?.nombre}`,
        asignacion.grupo?.codigoGrupo || 'N/A',
        asignacion.modalidad.charAt(0).toUpperCase() + asignacion.modalidad.slice(1),
        asignacion.estado.charAt(0).toUpperCase() + asignacion.estado.slice(1),
        asignacion.inscritos,
      ]
    }
  ];
  console.log("asignacionesData", asignacionesData);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Asignaciones" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Asignaciones</h1>
            <p className="text-muted-foreground">
              Administra las asignaciones de materias a docentes y grupos
            </p>
          </div>

          {/* ✅ Añadir MenuExportar aquí */}
          <div className="flex gap-2">
            <MenuExportar
              periodo={obtenerPeriodoActual()}
              filters={obtenerFiltrosLegibles()}
              secciones={seccionesReporte}
              disabled={asignacionesData.length === 0}
            />

            <Link href={asignaciones.create().url}>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Asignación
              </Button>
            </Link>
          </div>
        </div>

        <AsignacionStats asignaciones={asignacionesData} />

        <AsignacionFilters
          search={search}
          selectedEstado={selectedEstado}
          selectedPeriodo={selectedPeriodo}
          onSearchChange={setSearch}
          onEstadoChange={setSelectedEstado}
          onPeriodoChange={setSelectedPeriodo}
          onSearchSubmit={handleSearch}
          onClearFilters={handleClearFilters}
          periodos={periodos}
        />

        <AsignacionTable asignaciones={asignacionesData} />
      </div>
    </AppLayout>
  );
}