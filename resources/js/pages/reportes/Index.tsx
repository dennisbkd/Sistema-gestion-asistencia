// resources/js/pages/reportes/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, Clock, TrendingUp, ClipboardList, UserCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Reportes',
    href: '/reportes',
  },
];

const reportCards = [
  {
    title: 'Dashboard General',
    description: 'Vista general con métricas clave del sistema',
    href: '/reportes/dashboard',
    icon: TrendingUp,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    title: 'Reporte de Asistencias',
    description: 'Reporte detallado de asistencias con filtros por periodo, materia y docente',
    href: '/reportes/asistencias',
    icon: UserCheck,
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    title: 'Reporte de Asignaciones',
    description: 'Asignaciones activas con horarios y detalles',
    href: '/reportes/asignaciones',
    icon: ClipboardList,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    title: 'Resumen de Asistencias',
    description: 'Estadísticas y porcentajes de asistencia',
    href: '/reportes/resumen-asistencias',
    icon: BarChart3,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
  },
  {
    title: 'Horarios por Docente',
    description: 'Distribución horaria de cada docente',
    href: '/reportes/horarios-docente',
    icon: Clock,
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  },
  {
    title: 'Utilización de Aulas',
    description: 'Análisis de uso y ocupación de las aulas',
    href: '/reportes/utilizacion-aulas',
    icon: Calendar,
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  // {
  //   title: 'Actividad en Bitácora',
  //   description: 'Historial de actividades y eventos del sistema',
  //   href: '#',
  //   icon: Activity,
  //   color: 'bg-red-50 border-red-200 text-red-700',
  // },
];

export default function ReportesIndex() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sistema de Reportes" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sistema de Reportes</h1>
            <p className="text-muted-foreground">
              Genera y visualiza reportes del sistema académico con filtros avanzados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reportCards.map((report, index) => (
            <Link key={index} href={report.href} className="block">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <report.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm mt-2">
                    {report.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}