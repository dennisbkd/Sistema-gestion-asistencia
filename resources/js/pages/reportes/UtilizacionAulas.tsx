// resources/js/Pages/reportes/UtilizacionAulas.tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { MenuExportar } from '@/components/MenuExportar';
import { ReportData } from '@/components/services/servicePDF';

// Interfaces mejoradas con index signature
interface Aula extends Record<string, unknown> {
    id: number;
    codigo: string;
    nombre: string;
    tipo: string;
    capacidad: number;
    ubicacion: string;
    horarios_count: number;
    horas_utilizadas: number;
    materias: Array<{
        nombre: string;
        sigla: string;
    }>;
    docentes: Array<{
        nombre: string;
        codigo: string;
    }>;
    disponibilidad: {
        [key: string]: string;
    };
}

interface Estadisticas {
    total_aulas: number;
    aulas_utilizadas: number;
    aulas_no_utilizadas: number;
    porcentaje_utilizacion: number;
    distribucion_tipos: {
        [key: string]: number;
    };
    aulas_mas_utilizadas: Aula[];
    aulas_menos_utilizadas: Array<{
        codigo: string;
        nombre: string;
        tipo: string;
        capacidad: number;
    }>;
    horarios_por_dia: {
        [key: string]: number;
    };
}

interface Periodo {
    id: number;
    nombre: string;
}

interface TipoAula {
    value: string;
    label: string;
}

interface UtilizacionAulasProps {
    aulas: Aula[];
    estadisticas: Estadisticas;
    periodos: Periodo[];
    tipos_aula: TipoAula[];
    filters: {
        idPeriodo?: string;
        tipoAula?: string;
        fechaInicio?: string;
        fechaFin?: string;
    };
    rango_fechas: {
        inicio: string;
        fin: string;
    };
}

// Interfaces para las secciones de exportación
// interface EstadisticaItem extends Record<string, unknown> {
//     metrica: string;
//     valor: string | number;
// }

// interface AulaResumen extends Record<string, unknown> {
//     codigo: string;
//     tipo: string;
//     horarios: number;
//     horas: number;
// }

// interface AulaNoUtilizada extends Record<string, unknown> {
//     codigo: string;
//     nombre: string;
//     tipo: string;
//     capacidad: number;
// }

// Componentes de iconos definidos fuera del render
const BuildingIcon = () => <div className="p-2 bg-blue-900 rounded-lg">🏫</div>;
const CheckIcon = () => <div className="p-2 bg-green-900 rounded-lg">✅</div>;
const XIcon = () => <div className="p-2 bg-gray-700 rounded-lg">❌</div>;
const ChartIcon = () => <div className="p-2 bg-purple-900 rounded-lg">📊</div>;

const UtilizacionAulas: React.FC<UtilizacionAulasProps> = ({
    aulas,
    estadisticas,
    periodos,
    tipos_aula,
    filters: initialFilters,
    rango_fechas
}) => {
    const { data, setData, get } = useForm({
        idPeriodo: initialFilters.idPeriodo || 'all',
        tipoAula: initialFilters.tipoAula || 'all',
        fechaInicio: initialFilters.fechaInicio || '',
        fechaFin: initialFilters.fechaFin || ''
    });

    const actualizarReporte = () => {
        get('/reportes/utilizacion-aulas', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (key: keyof typeof data, value: string) => {
        setData(key, value);
        // Actualizar automáticamente al cambiar filtros
        setTimeout(actualizarReporte, 300);
    };

    // Preparar datos para exportación
    const prepararDatosExportacion = (): ReportData<Record<string, unknown>>[] => {
        // Sección 1: Aulas con su utilización
        const seccionAulas: ReportData<Record<string, unknown>> = {
            titulo: 'Detalle de Utilización de Aulas',
            columnas: ['Código', 'Nombre', 'Tipo', 'Capacidad', 'Horarios', 'Horas Utilizadas', 'Estado'],
            datos: aulas.map(aula => ({
                ...aula,
                estado: aula.horarios_count > 0 ? 'En uso' : 'No utilizada'
            })),
            mapearDatos: (item: Record<string, unknown>) => [
                item.codigo as string,
                item.nombre as string,
                item.tipo as string,
                (item.capacidad as number).toString(),
                (item.horarios_count as number).toString(),
                (item.horas_utilizadas as number).toString() + ' horas',
                item.estado as string
            ]
        };

        // Sección 2: Estadísticas generales
        const seccionEstadisticas: ReportData<Record<string, unknown>> = {
            titulo: 'Estadísticas Generales',
            columnas: ['Métrica', 'Valor'],
            datos: [
                { metrica: 'Total de Aulas', valor: estadisticas.total_aulas },
                { metrica: 'Aulas Utilizadas', valor: estadisticas.aulas_utilizadas },
                { metrica: 'Aulas No Utilizadas', valor: estadisticas.aulas_no_utilizadas },
                { metrica: 'Porcentaje de Utilización', valor: estadisticas.porcentaje_utilizacion + '%' }
            ],
            mapearDatos: (item: Record<string, unknown>) => [
                item.metrica as string,
                (item.valor as string | number).toString()
            ]
        };

        // Sección 3: Aulas más utilizadas
        const seccionTopAulas: ReportData<Record<string, unknown>> = {
            titulo: 'Top 5 Aulas Más Utilizadas',
            columnas: ['Código', 'Tipo', 'Horarios', 'Horas Utilizadas'],
            datos: estadisticas.aulas_mas_utilizadas.map(aula => ({
                codigo: aula.codigo,
                tipo: aula.tipo,
                horarios: aula.horarios_count,
                horas: aula.horas_utilizadas
            })),
            mapearDatos: (item: Record<string, unknown>) => [
                item.codigo as string,
                item.tipo as string,
                (item.horarios as number).toString(),
                (item.horas as number).toString() + ' horas'
            ]
        };

        // Sección 4: Aulas no utilizadas
        const seccionAulasNoUtilizadas: ReportData<Record<string, unknown>> = {
            titulo: 'Aulas No Utilizadas',
            columnas: ['Código', 'Nombre', 'Tipo', 'Capacidad'],
            datos: estadisticas.aulas_menos_utilizadas.map(aula => ({
                codigo: aula.codigo,
                nombre: aula.nombre,
                tipo: aula.tipo,
                capacidad: aula.capacidad
            })),
            mapearDatos: (item: Record<string, unknown>) => [
                item.codigo as string,
                item.nombre as string,
                item.tipo as string,
                (item.capacidad as number).toString()
            ]
        };

        return [seccionAulas, seccionEstadisticas, seccionTopAulas, seccionAulasNoUtilizadas];
    };

    // Obtener información del periodo actual para el PDF
    const obtenerPeriodoActual = () => {
        const periodoSeleccionado = periodos.find(p => p.id.toString() === data.idPeriodo);
        if (periodoSeleccionado) {
            // Extraer año y semestre del nombre del periodo
            const match = periodoSeleccionado.nombre.match(/(\d+).*Semestre\s*(\d+)/);
            if (match) {
                return { año: parseInt(match[1]), nroSemestre: parseInt(match[2]) };
            }
        }
        return undefined;
    };

    // Preparar filtros para el PDF
    const prepararFiltrosPDF = () => {
        const filtros: Record<string, string> = {
            'Rango de fechas': `${rango_fechas.inicio} - ${rango_fechas.fin}`
        };

        if (data.idPeriodo && data.idPeriodo !== 'all') {
            const periodo = periodos.find(p => p.id.toString() === data.idPeriodo);
            if (periodo) {
                filtros['Periodo académico'] = periodo.nombre;
            }
        }

        if (data.tipoAula && data.tipoAula !== 'all') {
            const tipo = tipos_aula.find(t => t.value === data.tipoAula);
            if (tipo) {
                filtros['Tipo de aula'] = tipo.label;
            }
        }

        return filtros;
    };

    return (
        <>
            <Head title="Reporte de Utilización de Aulas" />
            
            {/* Fondo oscuro */}
            <div className="min-h-screen bg-gray-900 py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header con botón de exportar */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Reporte de Utilización de Aulas</h1>
                            <p className="text-gray-300">Análisis del uso y disponibilidad de las aulas</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Período: {rango_fechas.inicio} - {rango_fechas.fin}
                            </p>
                        </div>
                        
                        {/* Botón de Exportar */}
                        <MenuExportar
                            periodo={obtenerPeriodoActual()}
                            filters={prepararFiltrosPDF()}
                            secciones={prepararDatosExportacion()}
                            disabled={aulas.length === 0}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Periodo Académico
                                </label>
                                <select
                                    value={data.idPeriodo}
                                    onChange={(e) => handleFilterChange('idPeriodo', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">Todos los periodos</option>
                                    {periodos.map((periodo) => (
                                        <option key={periodo.id} value={periodo.id}>
                                            {periodo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Tipo de Aula
                                </label>
                                <select
                                    value={data.tipoAula}
                                    onChange={(e) => handleFilterChange('tipoAula', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">Todos los tipos</option>
                                    {tipos_aula.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Fecha Inicio
                                </label>
                                <input
                                    type="date"
                                    value={data.fechaInicio}
                                    onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">
                                    Fecha Fin
                                </label>
                                <input
                                    type="date"
                                    value={data.fechaFin}
                                    onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <BuildingIcon />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-300">Total Aulas</p>
                                    <p className="text-2xl font-bold text-white">
                                        {estadisticas.total_aulas}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <CheckIcon />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-300">Aulas Utilizadas</p>
                                    <p className="text-2xl font-bold text-white">
                                        {estadisticas.aulas_utilizadas}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <XIcon />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-300">Aulas No Utilizadas</p>
                                    <p className="text-2xl font-bold text-white">
                                        {estadisticas.aulas_no_utilizadas}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <ChartIcon />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-300">% Utilización</p>
                                    <p className="text-2xl font-bold text-white">
                                        {estadisticas.porcentaje_utilizacion}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aulas Más Utilizadas */}
                    {estadisticas.aulas_mas_utilizadas.length > 0 && (
                        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Aulas Más Utilizadas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {estadisticas.aulas_mas_utilizadas.map((aula) => (
                                    <div key={aula.id} className="text-center p-4 border border-gray-700 rounded-lg bg-gray-750">
                                        <div className="font-bold text-lg text-white">
                                            {aula.codigo}
                                        </div>
                                        <div className="text-sm text-gray-300 capitalize">
                                            {aula.tipo}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {aula.horarios_count} horarios
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tabla de Aulas */}
                    <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white">Detalle de Utilización por Aula</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-750">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Aula
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Tipo / Capacidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Horarios
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Horas Utilizadas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Materias
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Disponibilidad
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-800 divide-y divide-gray-700">
                                    {aulas.map((aula) => (
                                        <tr key={aula.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-white">
                                                    {aula.codigo}
                                                </div>
                                                <div className="text-sm text-gray-300">
                                                    {aula.nombre}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white capitalize">
                                                    {aula.tipo}
                                                </div>
                                                <div className="text-sm text-gray-300">
                                                    Capacidad: {aula.capacidad}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    aula.horarios_count > 0 
                                                        ? 'bg-blue-900 text-blue-200'
                                                        : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                    {aula.horarios_count} horarios
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {aula.horas_utilizadas} horas
                                            </td>
                                            <td className="px-6 py-4 text-sm text-white">
                                                {aula.materias.slice(0, 2).map((materia) => (
                                                    <div key={materia.sigla} className="mb-1">
                                                        {materia.sigla}
                                                    </div>
                                                ))}
                                                {aula.materias.length > 2 && (
                                                    <span className="text-xs text-gray-400">
                                                        +{aula.materias.length - 2} más
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                <div className="flex space-x-1">
                                                    {Object.entries(aula.disponibilidad).map(([dia, estado]) => (
                                                        <span
                                                            key={dia}
                                                            className={`px-1 text-xs rounded ${
                                                                estado === 'Disponible'
                                                                    ? 'bg-green-900 text-green-200'
                                                                    : 'bg-red-900 text-red-200'
                                                            }`}
                                                            title={`${dia}: ${estado}`}
                                                        >
                                                            {dia.substring(0, 1)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Estado vacío */}
                        {aulas.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400">No se encontraron aulas con los filtros seleccionados</div>
                            </div>
                        )}
                    </div>

                    {/* Aulas No Utilizadas */}
                    {estadisticas.aulas_menos_utilizadas.length > 0 && (
                        <div className="bg-gray-800 rounded-lg shadow p-6 mt-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Aulas No Utilizadas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {estadisticas.aulas_menos_utilizadas.map((aula, index) => (
                                    <div key={index} className="p-3 border border-gray-700 rounded-lg bg-gray-750">
                                        <div className="font-medium text-white">
                                            {aula.codigo}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            {aula.nombre}
                                        </div>
                                        <div className="text-xs text-gray-400 capitalize">
                                            {aula.tipo} • Capacidad: {aula.capacidad}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UtilizacionAulas;