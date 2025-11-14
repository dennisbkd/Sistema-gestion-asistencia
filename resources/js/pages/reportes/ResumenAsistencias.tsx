// resources/js/Pages/reportes/ResumenAsistencias.tsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { MenuExportar } from '@/components/MenuExportar';
import { ReportData } from '@/components/services/servicePDF';

interface Estadisticas {
    total: number;
    presentes: number;
    tardanzas: number;
    ausentes: number;
    justificados: number;
    porcentaje_asistencia: number;
}

interface ResumenAsistencia extends Record<string, unknown> {
    asignacion_id: number;
    periodo: string;
    materia: string;
    sigla: string;
    docente: string;
    grupo: string;
    estadisticas: Estadisticas;
}

interface Props {
    resumen: ResumenAsistencia[];
    periodos: Array<{ id: number; nombre: string }>;
    materias: Array<{ id: number; nombre: string }>;
    docentes: Array<{ id: number; nombre: string }>;
    filters: {
        idPeriodo?: string;
        idMateria?: string;
        idDocente?: string;
    };
    total: number;
}

// Componentes de iconos
const ChartIcon = () => <div className="p-2 bg-purple-900 rounded-lg">📊</div>;
const TargetIcon = () => <div className="p-2 bg-blue-900 rounded-lg">🎯</div>;
const FilterIcon = () => <div className="p-2 bg-gray-700 rounded-lg">🔍</div>;
const RefreshIcon = () => <div className="p-2 bg-green-900 rounded-lg">🔄</div>;

const ResumenAsistencias: React.FC<Props> = ({ 
    resumen, 
    periodos, 
    materias, 
    docentes, 
    filters: initialFilters, 
    total 
}) => {
    const { data, setData, get } = useForm({
        idPeriodo: initialFilters.idPeriodo || 'all',
        idMateria: initialFilters.idMateria || 'all',
        idDocente: initialFilters.idDocente || 'all'
    });

    const [loading, setLoading] = useState(false);

    const handleFilterChange = (key: keyof typeof data, value: string) => {
        setData(key, value);
    };

    const aplicarFiltros = () => {
        setLoading(true);
        get('/reportes/resumen-asistencias', {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    const limpiarFiltros = () => {
        setData({
            idPeriodo: 'all',
            idMateria: 'all',
            idDocente: 'all'
        });
        get('/reportes/resumen-asistencias');
    };

    // Preparar datos para exportación
    const prepararDatosExportacion = (): ReportData<Record<string, unknown>>[] => {
        // Sección 1: Resumen detallado por asignación
        const seccionDetalle: ReportData<Record<string, unknown>> = {
            titulo: 'Resumen Detallado por Asignación',
            columnas: ['Periodo', 'Materia', 'Sigla', 'Docente', 'Grupo', 'Total', 'Presentes', 'Tardanzas', 'Ausentes', 'Justificados', '% Asistencia'],
            datos: resumen.map(item => ({
                ...item,
                porcentaje: item.estadisticas.porcentaje_asistencia
            })),
            mapearDatos: (item: Record<string, unknown>) => [
                item.periodo as string,
                item.materia as string,
                item.sigla as string,
                item.docente as string,
                item.grupo as string,
                (item.estadisticas as Estadisticas).total.toString(),
                (item.estadisticas as Estadisticas).presentes.toString(),
                (item.estadisticas as Estadisticas).tardanzas.toString(),
                (item.estadisticas as Estadisticas).ausentes.toString(),
                (item.estadisticas as Estadisticas).justificados.toString(),
                (item.estadisticas as Estadisticas).porcentaje_asistencia.toString() + '%'
            ]
        };

        // Sección 2: Estadísticas generales
        const estadisticasGenerales = getEstadisticasGenerales();
        if (estadisticasGenerales) {
            const seccionEstadisticas: ReportData<Record<string, unknown>> = {
                titulo: 'Estadísticas Generales',
                columnas: ['Métrica', 'Valor'],
                datos: [
                    { metrica: 'Total de Registros', valor: estadisticasGenerales.totalAsistencias },
                    { metrica: 'Total Presentes', valor: estadisticasGenerales.totalPresentes },
                    { metrica: 'Total Tardanzas', valor: estadisticasGenerales.totalTardanzas },
                    { metrica: 'Total Ausentes', valor: estadisticasGenerales.totalAusentes },
                    { metrica: 'Total Justificados', valor: estadisticasGenerales.totalJustificados },
                    { metrica: 'Porcentaje General de Asistencia', valor: estadisticasGenerales.porcentajeGeneral + '%' }
                ],
                mapearDatos: (item: Record<string, unknown>) => [
                    item.metrica as string,
                    (item.valor as string | number).toString()
                ]
            };
            return [seccionDetalle, seccionEstadisticas];
        }

        return [seccionDetalle];
    };

    // Preparar filtros para el PDF
    const prepararFiltrosPDF = () => {
        const filtros: Record<string, string> = {};

        if (data.idPeriodo && data.idPeriodo !== 'all') {
            const periodo = periodos.find(p => p.id.toString() === data.idPeriodo);
            if (periodo) {
                filtros['Periodo académico'] = periodo.nombre;
            }
        }

        if (data.idMateria && data.idMateria !== 'all') {
            const materia = materias.find(m => m.id.toString() === data.idMateria);
            if (materia) {
                filtros['Materia'] = materia.nombre;
            }
        }

        if (data.idDocente && data.idDocente !== 'all') {
            const docente = docentes.find(d => d.id.toString() === data.idDocente);
            if (docente) {
                filtros['Docente'] = docente.nombre;
            }
        }

        return filtros;
    };

    const getPorcentajeBadge = (porcentaje: number) => {
        let color = 'bg-red-900 text-red-200';
        if (porcentaje >= 90) color = 'bg-green-900 text-green-200';
        else if (porcentaje >= 70) color = 'bg-yellow-900 text-yellow-200';
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {porcentaje}%
            </span>
        );
    };

    const getEstadisticasGenerales = () => {
        if (resumen.length === 0) return null;

        const totalAsistencias = resumen.reduce((sum, item) => sum + item.estadisticas.total, 0);
        const totalPresentes = resumen.reduce((sum, item) => sum + item.estadisticas.presentes, 0);
        const totalTardanzas = resumen.reduce((sum, item) => sum + item.estadisticas.tardanzas, 0);
        const totalAusentes = resumen.reduce((sum, item) => sum + item.estadisticas.ausentes, 0);
        const totalJustificados = resumen.reduce((sum, item) => sum + item.estadisticas.justificados, 0);
        
        const porcentajeGeneral = totalAsistencias > 0 
            ? Math.round(((totalPresentes + totalJustificados) / totalAsistencias) * 100) 
            : 0;

        return {
            totalAsistencias,
            totalPresentes,
            totalTardanzas,
            totalAusentes,
            totalJustificados,
            porcentajeGeneral
        };
    };

    const estadisticasGenerales = getEstadisticasGenerales();

    return (
        <>
            <Head title="Resumen de Asistencias" />
            
            {/* Fondo oscuro */}
            <div className="min-h-screen bg-gray-900 py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header con botón de exportar */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Resumen de Asistencias</h1>
                            <p className="text-gray-300">Estadísticas y porcentajes de asistencia por asignación</p>
                        </div>
                        
                        {/* Botón de Exportar */}
                        <MenuExportar
                            filters={prepararFiltrosPDF()}
                            secciones={prepararDatosExportacion()}
                            disabled={resumen.length === 0}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FilterIcon />
                            Filtros del Reporte
                        </h2>
                        <p className="text-gray-400 mb-4">Selecciona los criterios para filtrar el reporte</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Filtro Periodo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Periodo Académico
                                </label>
                                <select
                                    value={data.idPeriodo}
                                    onChange={(e) => handleFilterChange('idPeriodo', e.target.value)}
                                    className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">Todos los periodos</option>
                                    {periodos.map((periodo) => (
                                        <option key={periodo.id} value={periodo.id.toString()}>
                                            {periodo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro Materia */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Materia
                                </label>
                                <select
                                    value={data.idMateria}
                                    onChange={(e) => handleFilterChange('idMateria', e.target.value)}
                                    className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">Todas las materias</option>
                                    {materias.map((materia) => (
                                        <option key={materia.id} value={materia.id.toString()}>
                                            {materia.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtro Docente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Docente
                                </label>
                                <select
                                    value={data.idDocente}
                                    onChange={(e) => handleFilterChange('idDocente', e.target.value)}
                                    className="w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="all">Todos los docentes</option>
                                    {docentes.map((docente) => (
                                        <option key={docente.id} value={docente.id.toString()}>
                                            {docente.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botones */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 invisible">
                                    &nbsp;
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={aplicarFiltros}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <RefreshIcon />
                                        ) : (
                                            <FilterIcon />
                                        )}
                                        {loading ? 'Aplicando...' : 'Aplicar Filtros'}
                                    </button>
                                    
                                    <button
                                        onClick={limpiarFiltros}
                                        disabled={loading}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas Generales */}
                    {estadisticasGenerales && (
                        <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <ChartIcon />
                                Resumen General
                            </h2>
                            <p className="text-gray-400 mb-4">Estadísticas consolidadas de todas las asignaciones</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                                <div className="text-center p-4 bg-blue-900 rounded-lg">
                                    <div className="text-2xl font-bold text-white">{estadisticasGenerales.totalAsistencias}</div>
                                    <div className="text-sm text-blue-200">Total Registros</div>
                                </div>
                                <div className="text-center p-4 bg-green-900 rounded-lg">
                                    <div className="text-2xl font-bold text-white">{estadisticasGenerales.totalPresentes}</div>
                                    <div className="text-sm text-green-200">Presentes</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-900 rounded-lg">
                                    <div className="text-2xl font-bold text-white">{estadisticasGenerales.totalTardanzas}</div>
                                    <div className="text-sm text-yellow-200">Tardanzas</div>
                                </div>
                                <div className="text-center p-4 bg-red-900 rounded-lg">
                                    <div className="text-2xl font-bold text-white">{estadisticasGenerales.totalAusentes}</div>
                                    <div className="text-sm text-red-200">Ausentes</div>
                                </div>
                                <div className="text-center p-4 bg-blue-900 rounded-lg">
                                    <div className="text-2xl font-bold text-white">{estadisticasGenerales.totalJustificados}</div>
                                    <div className="text-sm text-blue-200">Justificados</div>
                                </div>
                                <div className="text-center p-4 bg-purple-900 rounded-lg">
                                    <div className="text-2xl font-bold text-white">{estadisticasGenerales.porcentajeGeneral}%</div>
                                    <div className="text-sm text-purple-200">% Asistencia</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resultados Detallados */}
                    <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <TargetIcon />
                                    Resultados por Asignación
                                </h2>
                                <p className="text-gray-400">
                                    Estadísticas detalladas de asistencia por cada asignación
                                </p>
                            </div>
                            {total > 0 && (
                                <span className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                                    {total} asignaciones encontradas
                                </span>
                            )}
                        </div>
                        
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    <span className="ml-3 text-white">Cargando reporte...</span>
                                </div>
                            ) : resumen.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <div className="text-4xl mb-4">📊</div>
                                    <p>No hay datos para mostrar. Aplica los filtros para generar el reporte.</p>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-750">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Periodo
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Materia
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Docente
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Grupo
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Presentes
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Tardanzas
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Ausentes
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Justificados
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                % Asistencia
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {resumen.map((item) => (
                                            <tr key={item.asignacion_id} className="hover:bg-gray-750">
                                                <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                                                    {item.periodo}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium">{item.materia}</div>
                                                    <div className="text-sm text-gray-300">
                                                        {item.sigla}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                                    {item.docente}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                                    {item.grupo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-white">
                                                    {item.estadisticas.total}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-green-300 font-medium">
                                                    {item.estadisticas.presentes}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-yellow-300 font-medium">
                                                    {item.estadisticas.tardanzas}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-red-300 font-medium">
                                                    {item.estadisticas.ausentes}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-blue-300 font-medium">
                                                    {item.estadisticas.justificados}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {getPorcentajeBadge(item.estadisticas.porcentaje_asistencia)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumenAsistencias;