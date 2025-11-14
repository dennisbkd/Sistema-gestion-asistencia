import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Filters from './components/Filters';
import BloqueHorarioTable from './components/BloqueHorarioTable';
import { type BloqueHorarioIndexProps } from './types/bloque-horario';
import bloquesHorarios from '@/routes/bloques-horarios';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Bloques Horarios', href: bloquesHorarios.index().url },
];

export default function Index({ bloques, filters }: BloqueHorarioIndexProps) {
  const [localFilters, setLocalFilters] = useState({
    search: filters?.search || '',
    diaSemana: filters?.diaSemana || '',
    turno: filters?.turno || 'mañana',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    
    router.get(bloquesHorarios.index().url, newFilters, {
      preserveState: true,
      replace: true,
    });
  };

  const clearFilters = () => {
    setLocalFilters({ search: '', diaSemana: '', turno: '' });
    router.get(bloquesHorarios.index().url, {}, {
      preserveState: true,
      replace: true,
    });
  };

  const tieneFiltros = Object.values(localFilters).some(value => value !== '');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Bloques Horarios" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bloques Horarios</h1>
            <p className="text-muted-foreground">
              Gestiona los horarios disponibles para asignaciones
            </p>
          </div>
          <Button asChild>
            <a href={bloquesHorarios.create().url}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Bloque
            </a>
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtra los bloques horarios por día, turno o horario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Filters
              filters={localFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </CardContent>
        </Card>

        {/* Tabla de Bloques Horarios */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Bloques Horarios</CardTitle>
            <CardDescription>
              {bloques.length} bloque(s) horario(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BloqueHorarioTable 
              bloques={bloques} 
              tieneFiltros={tieneFiltros} 
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}