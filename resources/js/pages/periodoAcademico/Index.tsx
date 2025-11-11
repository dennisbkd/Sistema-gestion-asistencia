// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, Link, router, useForm } from '@inertiajs/react';
// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import periodosAcademicos from '@/routes/periodos-academicos';
// import { IndexProps } from './types';
// import { PeriodoStats } from './components/PeriodoStats';
// import { PeriodoFilters } from './components/PeriodoFilters';
// import { PeriodoTable } from './components/PeriodoTable';

// const breadcrumbs: BreadcrumbItem[] = [
//   {
//     title: 'Dashboard',
//     href: '/dashboard',
//   },
//   {
//     title: 'Períodos Académicos',
//     href: periodosAcademicos.index().url,
//   },
// ];

// export default function Index({ periodos: periodosData, filters }: IndexProps) {
//   const [search, setSearch] = useState(filters?.search || '');
//   const [selectedEstado, setSelectedEstado] = useState(filters?.estado || '');
//   const { processing, get } = useForm();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (search) params.append('search', search);
//     if (selectedEstado) params.append('estado', selectedEstado);
    
//     get(periodosAcademicos.index().url + `?${params.toString()}`);
//   };

//   const handleClearFilters = () => {
//     setSearch('');
//     setSelectedEstado('');
//     router.get(periodosAcademicos.index().url);
//   };

//   const changeStatusHandler = (periodo: any) => {
//     const nuevoEstado = periodo.estado === 'activo' ? 'finalizado' : 'activo';
    
//     router.patch(periodosAcademicos.changeStatus(periodo.idPeriodo).url, {}, {
//       onSuccess: () => {
//         // toast.success(`Período académico ${nuevoEstado === 'activo' ? 'activado' : 'finalizado'} exitosamente`);
//       },
//       onError: () => {
//         // toast.error('Error al cambiar el estado del período académico');
//       },
//     });
//   };

//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Gestión de Períodos Académicos" />

//       <div className="flex h-full flex-1 flex-col gap-6 p-6">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Gestión de Períodos Académicos</h1>
//             <p className="text-muted-foreground">
//               Administra los períodos académicos del sistema
//             </p>
//           </div>

//           <Link href={periodosAcademicos.create().url}>
//             <Button className="flex items-center gap-2">
//               <Plus className="h-4 w-4" />
//               Nuevo Período
//             </Button>
//           </Link>
//         </div>

//         <PeriodoStats periodos={periodosData} />

//         <PeriodoFilters
//           search={search}
//           selectedEstado={selectedEstado}
//           onSearchChange={setSearch}
//           onEstadoChange={setSelectedEstado}
//           onSearchSubmit={handleSearch}
//           onClearFilters={handleClearFilters}
//         />

//         <PeriodoTable
//           periodos={periodosData}
//           onChangeStatus={changeStatusHandler}
//         />
//       </div>
//     </AppLayout>
//   );
// }