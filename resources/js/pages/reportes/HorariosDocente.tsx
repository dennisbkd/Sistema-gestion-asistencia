// resources/js/Pages/reportes/HorariosDocente.tsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { MenuExportar } from '@/components/MenuExportar';
import { ReportData } from '@/components/services/servicePDF';

interface Horario extends Record<string, unknown> {
    dia: string;
    hora: string;
    materia: string;
    grupo: string;
    aula: string;
    periodo: string;
}

interface HorarioDocente extends Record<string, unknown> {
    docente: string;
    horarios: Horario[];
}

interface Props {
    horarios: HorarioDocente[];
    periodos: Array<{ id: number; nombre: string }>;
    docentes: Array<{ id: number; nombre: string }>;
    filters: {
        idPeriodo?: string;
        idDocente?: string;
    };
}

// Componentes de iconos
const ClockIcon = () => <div className="p-2 bg-blue-900 rounded-lg">⏰</div>;
const UsersIcon = () => <div className="p-2 bg-green-900 rounded-lg">👥</div>;
const FilterIcon = () => <div className="p-2 bg-gray-700 rounded-lg">🔍</div>;
const RefreshIcon = () => <div className="p-2 bg-yellow-900 rounded-lg">🔄</div>;
// const BookIcon = () => <div className="p-2 bg-purple-900 rounded-lg">📚</div>;
// const BuildingIcon = () => <div className="p-2 bg-red-900 rounded-lg">🏫</div>;

const HorariosDocente: React.FC<Props> = ({ horarios, periodos, docentes, filters: initialFilters }) => {
    const { data, setData, get } = useForm({
        idPeriodo: initialFilters.idPeriodo || 'all',
        idDocente: initialFilters.idDocente || 'all'
    });

    const [loading, setLoading] = useState(false);

    const handleFilterChange = (key: keyof typeof data, value: string) => {
        setData(key, value);
    };

    const aplicarFiltros = () => {
        setLoading(true);
        get('/reportes/horarios-docente', {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    const limpiarFiltros = () => {
        setData({
            idPeriodo: 'all',
            idDocente: 'all'
        });
        get('/reportes/horarios-docente');
    };

    // Preparar datos para exportación
    const prepararDatosExportacion = (): ReportData<Record<string, unknown>>[] => {
        const secciones: ReportData<Record<string, unknown>>[] = [];

        horarios.forEach((docenteData, index) => {
            const seccionDocente: ReportData<Record<string, unknown>> = {
                titulo: `Horarios - ${docenteData.docente}`,
                columnas: ['Día', 'Hora', 'Materia', 'Grupo', 'Aula', 'Periodo'],
                datos: docenteData.horarios,
                mapearDatos: (item: Record<string, unknown>) => [
                    item.dia as string,
                    item.hora as string,
                    item.materia as string,
                    item.grupo as string,
                    item.aula as string,
                    item.periodo as string
                ]
            };
            secciones.push(seccionDocente);
        });

        return secciones;
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

        if (data.idDocente && data.idDocente !== 'all') {
            const docente = docentes.find(d => d.id.toString() === data.idDocente);
            if (docente) {
                filtros['Docente'] = docente.nombre;
            }
        }

        return filtros;
    };

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const agruparHorariosPorDia = (horarios: Horario[]) => {
        const agrupados: Record<string, Horario[]> = {};
        diasSemana.forEach(dia => {
            agrupados[dia] = horarios.filter(h => h.dia === dia);
        });
        return agrupados;
    };

    const getColorPorMateria = (materia: string) => {
        const colors = [
            'bg-blue-900 border-blue-700',
            'bg-green-900 border-green-700', 
            'bg-purple-900 border-purple-700',
            'bg-orange-900 border-orange-700',
            'bg-pink-900 border-pink-700',
            'bg-indigo-900 border-indigo-700',
            'bg-teal-900 border-teal-700',
            'bg-amber-900 border-amber-700'
        ];
        
        const index = materia.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    return (
        <>
            <Head title="Horarios por Docente" />
            
            {/* Fondo oscuro */}
            <div className="min-h-screen bg-gray-900 py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header con botón de exportar */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Horarios por Docente</h1>
                            <p className="text-gray-300">Distribución horaria de cada docente según los filtros aplicados</p>
                        </div>
                        
                        {/* Botón de Exportar */}
                        <MenuExportar
                            filters={prepararFiltrosPDF()}
                            secciones={prepararDatosExportacion()}
                            disabled={horarios.length === 0}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <FilterIcon />
                            Filtros del Reporte
                        </h2>
                        <p className="text-gray-400 mb-4">Selecciona los criterios para filtrar el reporte</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* Resultados */}
                    <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <ClockIcon />
                                Horarios de Docentes
                            </h2>
                            <p className="text-gray-400">
                                Distribución semanal de horarios por docente
                            </p>
                        </div>
                        
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    <span className="ml-3 text-white">Cargando reporte...</span>
                                </div>
                            ) : horarios.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <div className="text-4xl mb-4">⏰</div>
                                    <p>No hay datos para mostrar. Aplica los filtros para generar el reporte.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {horarios.map((docenteData, index) => {
                                        const horariosPorDia = agruparHorariosPorDia(docenteData.horarios);
                                        
                                        return (
                                            <div key={index} className="border border-gray-700 rounded-lg p-6 bg-gray-750 shadow-sm">
                                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-600">
                                                    <UsersIcon />
                                                    <h3 className="text-xl font-bold text-white">{docenteData.docente}</h3>
                                                    <span className="ml-auto px-3 py-1 bg-gray-600 text-white rounded-full text-sm">
                                                        {docenteData.horarios.length} horarios
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                                                    {diasSemana.map((dia) => (
                                                        <div key={dia} className="border border-gray-600 rounded-lg p-3 bg-gray-700 min-h-[200px]">
                                                            <h4 className="font-semibold text-center mb-3 text-sm text-gray-300 border-b border-gray-600 pb-2">
                                                                {dia}
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {horariosPorDia[dia].length === 0 ? (
                                                                    <div className="text-center text-xs text-gray-500 py-6">
                                                                        Sin horarios
                                                                    </div>
                                                                ) : (
                                                                    horariosPorDia[dia].map((horario, horarioIndex) => (
                                                                        <div
                                                                            key={horarioIndex}
                                                                            className={`border rounded p-2 text-xs ${getColorPorMateria(horario.materia)}`}
                                                                        >
                                                                            <div className="font-bold text-white mb-1 flex items-center gap-1">
                                                                                <span>⏰</span>
                                                                                {horario.hora}
                                                                            </div>
                                                                            <div className="flex items-center gap-1 mb-1">
                                                                                <span>📚</span>
                                                                                <span className="font-medium truncate text-white">{horario.materia}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1 mb-1">
                                                                                <span>👥</span>
                                                                                <span className="text-gray-300">Grupo {horario.grupo}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <span>🏫</span>
                                                                                <span className="text-gray-300">Aula {horario.aula}</span>
                                                                            </div>
                                                                            <div className="mt-1 text-xs text-gray-400">
                                                                                {horario.periodo}
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HorariosDocente;