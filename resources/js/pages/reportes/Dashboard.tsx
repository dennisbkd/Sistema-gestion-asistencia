// resources/js/Pages/reportes/Dashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    Building, 
    BookOpen, 
    ClipboardList, 
    Calendar, 
    Package, 
    Activity, 
    TrendingUp,
    BarChart3,
    Award,
    Target,
    Download,
    Printer,
    ChevronDown
} from 'lucide-react';
import { MenuExportar } from '@/components/MenuExportar';
import { ReportData } from '@/components/services/servicePDF';
import { useState, useRef, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Reportes',
        href: '/reportes',
    },
    {
        title: 'Dashboard General',
        href: '/reportes/dashboard',
    },
];

interface DocenteTop {
    nombre: string;
    asignaciones: number;
    codigo: string;
}

interface AulaUtilizada {
    nombre: string;
    horarios: number;
    tipo: string;
    capacidad: number;
}

interface MateriaTop {
    nombre: string;
    sigla: string;
    asignaciones: number;
    semestre: number;
}

interface Props {
    resumen: {
        // Estadísticas principales
        total_docentes: number;
        total_aulas: number;
        total_materias: number;
        total_asignaciones: number;
        asistencias_hoy: number;
        inventario_disponible: number;
        
        // Estadísticas de asistencias
        asistencias_mes: number;
        asistencias_presentes: number;
        asistencias_tardanzas: number;
        asistencias_ausentes: number;
        porcentaje_asistencia: number;
        
        // Actividad del sistema
        actividades_recientes: number;
        movimientos_mes: number;
        grupos_activos: number;
        
        // Datos para gráficos y listas
        docentes_top: DocenteTop[];
        aulas_utilizadas: AulaUtilizada[];
        materias_top: MateriaTop[];
        modalidades: Record<string, number>;
        
        // Información del periodo
        periodo_activo: {
            nombre: string;
            tipo: string;
            fecha_inicio: string;
            fecha_fin: string;
        } | null;
        
        // Fechas para referencia
        mes_actual: string;
        hoy: string;
    };
}

export default function DashboardReport({ resumen }: Props) {
    // Preparar datos para exportación
    const prepararDatosExportacion = (): ReportData<Record<string, unknown>>[] => {
        const secciones: ReportData<Record<string, unknown>>[] = [];

        // Sección 1: Estadísticas Principales
        const seccionEstadisticas: ReportData<Record<string, unknown>> = {
            titulo: 'Estadísticas Principales del Sistema',
            columnas: ['Métrica', 'Valor'],
            datos: [
                { metrica: 'Docentes Activos', valor: resumen.total_docentes },
                { metrica: 'Aulas Disponibles', valor: resumen.total_aulas },
                { metrica: 'Materias Activas', valor: resumen.total_materias },
                { metrica: 'Asignaciones Activas', valor: resumen.total_asignaciones },
                { metrica: 'Asistencias Hoy', valor: resumen.asistencias_hoy },
                { metrica: 'Inventario Disponible', valor: resumen.inventario_disponible },
                { metrica: 'Actividades Recientes (24h)', valor: resumen.actividades_recientes },
                { metrica: 'Movimientos del Mes', valor: resumen.movimientos_mes },
                { metrica: 'Grupos Activos', valor: resumen.grupos_activos }
            ],
            mapearDatos: (item: Record<string, unknown>) => [
                item.metrica as string,
                (item.valor as number).toString()
            ]
        };
        secciones.push(seccionEstadisticas);

        // Sección 2: Estadísticas de Asistencias
        const seccionAsistencias: ReportData<Record<string, unknown>> = {
            titulo: 'Estadísticas de Asistencias del Mes',
            columnas: ['Tipo', 'Cantidad', 'Porcentaje'],
            datos: [
                { tipo: 'Total de Registros', cantidad: resumen.asistencias_mes, porcentaje: '100%' },
                { tipo: 'Presentes', cantidad: resumen.asistencias_presentes, porcentaje: `${Math.round((resumen.asistencias_presentes / resumen.asistencias_mes) * 100)}%` },
                { tipo: 'Tardanzas', cantidad: resumen.asistencias_tardanzas, porcentaje: `${Math.round((resumen.asistencias_tardanzas / resumen.asistencias_mes) * 100)}%` },
                { tipo: 'Ausentes', cantidad: resumen.asistencias_ausentes, porcentaje: `${Math.round((resumen.asistencias_ausentes / resumen.asistencias_mes) * 100)}%` }
            ],
            mapearDatos: (item: Record<string, unknown>) => [
                item.tipo as string,
                (item.cantidad as number).toString(),
                item.porcentaje as string
            ]
        };
        secciones.push(seccionAsistencias);

        // Sección 3: Docentes Top
        if (resumen.docentes_top.length > 0) {
            const seccionDocentes: ReportData<Record<string, unknown>> = {
                titulo: 'Top 5 - Docentes con Más Asignaciones',
                columnas: ['Docente', 'Código', 'Asignaciones'],
                datos: resumen.docentes_top,
                mapearDatos: (item: Record<string, unknown>) => [
                    item.nombre as string,
                    item.codigo as string,
                    (item.asignaciones as number).toString()
                ]
            };
            secciones.push(seccionDocentes);
        }

        // Sección 4: Aulas Más Utilizadas
        if (resumen.aulas_utilizadas.length > 0) {
            const seccionAulas: ReportData<Record<string, unknown>> = {
                titulo: 'Top 5 - Aulas Más Utilizadas',
                columnas: ['Aula', 'Tipo', 'Capacidad', 'Horarios'],
                datos: resumen.aulas_utilizadas,
                mapearDatos: (item: Record<string, unknown>) => [
                    item.nombre as string,
                    item.tipo as string,
                    (item.capacidad as number).toString(),
                    (item.horarios as number).toString()
                ]
            };
            secciones.push(seccionAulas);
        }

        // Sección 5: Materias Más Asignadas
        if (resumen.materias_top.length > 0) {
            const seccionMaterias: ReportData<Record<string, unknown>> = {
                titulo: 'Top 5 - Materias Más Asignadas',
                columnas: ['Materia', 'Sigla', 'Semestre', 'Asignaciones'],
                datos: resumen.materias_top,
                mapearDatos: (item: Record<string, unknown>) => [
                    item.nombre as string,
                    item.sigla as string,
                    (item.semestre as number).toString(),
                    (item.asignaciones as number).toString()
                ]
            };
            secciones.push(seccionMaterias);
        }

        // Sección 6: Distribución de Modalidades
        const seccionModalidades: ReportData<Record<string, unknown>> = {
            titulo: 'Distribución por Modalidad',
            columnas: ['Modalidad', 'Cantidad'],
            datos: Object.entries(resumen.modalidades).map(([modalidad, cantidad]) => ({
                modalidad: modalidad.charAt(0).toUpperCase() + modalidad.slice(1),
                cantidad: cantidad
            })),
            mapearDatos: (item: Record<string, unknown>) => [
                item.modalidad as string,
                (item.cantidad as number).toString()
            ]
        };
        secciones.push(seccionModalidades);

        return secciones;
    };

    // Preparar filtros para el PDF (en este caso, información del periodo)
    const prepararFiltrosPDF = () => {
        const filtros: Record<string, string> = {
            'Mes': resumen.mes_actual,
            'Fecha de generación': resumen.hoy
        };

        if (resumen.periodo_activo) {
            filtros['Periodo académico'] = resumen.periodo_activo.nombre;
            filtros['Tipo de periodo'] = resumen.periodo_activo.tipo;
            filtros['Fecha inicio'] = resumen.periodo_activo.fecha_inicio;
            filtros['Fecha fin'] = resumen.periodo_activo.fecha_fin;
        }

        return filtros;
    };

    const stats = [
        {
            title: 'Docentes Activos',
            value: resumen.total_docentes,
            icon: Users,
            color: 'bg-blue-500',
            description: 'Total de docentes en estado activo',
        },
        {
            title: 'Aulas Disponibles',
            value: resumen.total_aulas,
            icon: Building,
            color: 'bg-green-500',
            description: 'Aulas activas en el sistema',
        },
        {
            title: 'Materias Activas',
            value: resumen.total_materias,
            icon: BookOpen,
            color: 'bg-orange-500',
            description: 'Materias disponibles para asignación',
        },
        {
            title: 'Asignaciones Activas',
            value: resumen.total_asignaciones,
            icon: ClipboardList,
            color: 'bg-purple-500',
            description: 'Asignaciones en período activo',
        },
        {
            title: 'Asistencias Hoy',
            value: resumen.asistencias_hoy,
            icon: Calendar,
            color: 'bg-red-500',
            description: 'Registros de asistencia del día',
        },
        {
            title: 'Inventario Disponible',
            value: resumen.inventario_disponible,
            icon: Package,
            color: 'bg-indigo-500',
            description: 'Items de inventario en stock',
        },
        {
            title: 'Actividades Recientes',
            value: resumen.actividades_recientes,
            icon: Activity,
            color: 'bg-teal-500',
            description: 'Registros en bitácora (24h)',
        },
        {
            title: 'Movimientos Mes',
            value: resumen.movimientos_mes,
            icon: TrendingUp,
            color: 'bg-cyan-500',
            description: 'Movimientos de inventario este mes',
        },
    ];

    const getPorcentajeBadge = (porcentaje: number) => {
        let color = 'bg-red-100 text-red-800';
        if (porcentaje >= 90) color = 'bg-green-100 text-green-800';
        else if (porcentaje >= 70) color = 'bg-yellow-100 text-yellow-800';
        
        return (
            <Badge className={color}>
                {porcentaje}%
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard General de Reportes" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard General</h1>
                            <p className="text-muted-foreground">
                                Métricas y estadísticas clave del sistema académico - {resumen.mes_actual}
                            </p>
                            {resumen.periodo_activo && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-sm">
                                        Periodo Activo: {resumen.periodo_activo.nombre}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {resumen.periodo_activo.fecha_inicio} - {resumen.periodo_activo.fecha_fin}
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Botón de Exportar */}
                        <MenuExportar
                            filters={prepararFiltrosPDF()}
                            secciones={prepararDatosExportacion()}
                            disabled={false}
                        />
                    </div>
                </div>

                {/* Estadísticas Principales */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Segunda Fila - Estadísticas Específicas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Estadísticas de Asistencias */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Estadísticas de Asistencias
                            </CardTitle>
                            <CardDescription>
                                Resumen del mes de {resumen.mes_actual}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium">Total de Registros</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {resumen.asistencias_mes}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="text-sm font-medium">Presentes</span>
                                    <span className="text-lg font-bold text-green-600">
                                        {resumen.asistencias_presentes}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-sm font-medium">Tardanzas</span>
                                    <span className="text-lg font-bold text-yellow-600">
                                        {resumen.asistencias_tardanzas}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                    <span className="text-sm font-medium">Ausentes</span>
                                    <span className="text-lg font-bold text-red-600">
                                        {resumen.asistencias_ausentes}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                    <span className="text-sm font-medium">Porcentaje de Asistencia</span>
                                    {getPorcentajeBadge(resumen.porcentaje_asistencia)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Docentes con Más Asignaciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Docentes con Más Asignaciones
                            </CardTitle>
                            <CardDescription>
                                Top 5 docentes por carga académica
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {resumen.docentes_top.map((docente, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">{docente.nombre}</div>
                                            <div className="text-sm text-muted-foreground">{docente.codigo}</div>
                                        </div>
                                        <Badge variant="secondary">
                                            {docente.asignaciones} asignaciones
                                        </Badge>
                                    </div>
                                ))}
                                {resumen.docentes_top.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4">
                                        No hay datos disponibles
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tercera Fila */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Aulas Más Utilizadas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Aulas Más Utilizadas
                            </CardTitle>
                            <CardDescription>
                                Top 5 aulas por cantidad de horarios
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {resumen.aulas_utilizadas.map((aula, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">{aula.nombre}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {aula.tipo} • Capacidad: {aula.capacidad}
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {aula.horarios} horarios
                                        </Badge>
                                    </div>
                                ))}
                                {resumen.aulas_utilizadas.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4">
                                        No hay datos disponibles
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Materias Más Asignadas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Materias Más Asignadas
                            </CardTitle>
                            <CardDescription>
                                Top 5 materias por cantidad de asignaciones
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {resumen.materias_top.map((materia, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <div className="font-medium">{materia.nombre}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {materia.sigla} • Semestre {materia.semestre}
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {materia.asignaciones} asignaciones
                                        </Badge>
                                    </div>
                                ))}
                                {resumen.materias_top.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4">
                                        No hay datos disponibles
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Información Adicional */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Información Adicional
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-700">{resumen.grupos_activos}</div>
                                <div className="text-sm text-gray-600">Grupos Activos</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {resumen.modalidades.presencial || 0}
                                </div>
                                <div className="text-sm text-blue-600">Asignaciones Presenciales</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {resumen.modalidades.virtual || 0}
                                </div>
                                <div className="text-sm text-green-600">Asignaciones Virtuales</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}