// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Link } from '@inertiajs/react';
// import { Edit, BookOpen, Users, Layers } from 'lucide-react';
// import { toast } from 'sonner';
// import { PeriodoAcademico } from '../types';
// import periodosAcademicos from '@/routes/periodos-academicos';

// interface PeriodoActionsProps {
//   periodo: PeriodoAcademico;
//   onChangeStatus: (periodo: PeriodoAcademico) => void;
// }

// export function PeriodoActions({ periodo, onChangeStatus }: PeriodoActionsProps) {
//   const getEstadoBadge = (estado: string) => {
//     const colors = {
//       activo: 'bg-green-100 text-green-800 border-green-200',
//       finalizado: 'bg-blue-100 text-blue-800 border-blue-200',
//       planificado: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//     } as const;

//     return (
//       <Badge variant="outline" className={colors[estado as keyof typeof colors]}>
//         {estado.charAt(0).toUpperCase() + estado.slice(1)}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-x-2 flex justify-center">
//       <Link href={`/periodos-academicos/${periodo.idPeriodo}/materias`}>
//         <Button variant="outline" size="sm" className="flex items-center gap-1">
//           <BookOpen className="h-3 w-3" />
//           Materias
//         </Button>
//       </Link>
//       <Link href={`/periodos-academicos/${periodo.idPeriodo}/docentes`}>
//         <Button variant="outline" size="sm" className="flex items-center gap-1">
//           <Users className="h-3 w-3" />
//           Docentes
//         </Button>
//       </Link>
//       <Link href={`/periodos-academicos/${periodo.idPeriodo}/grupos`}>
//         <Button variant="outline" size="sm" className="flex items-center gap-1">
//           <Layers className="h-3 w-3" />
//           Grupos
//         </Button>
//       </Link>
//       <Link href={periodosAcademicos.edit(periodo.idPeriodo).url}>
//         <Button variant="outline" size="sm" className="flex items-center gap-1">
//           <Edit className="h-3 w-3" />
//           Editar
//         </Button>
//       </Link>
//       <Button 
//         variant="outline" 
//         size="sm"
//         onClick={() => onChangeStatus(periodo)}
//         className={periodo.estado === 'activo' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
//         disabled={periodo.estado === 'planificado'}
//       >
//         {periodo.estado === 'activo' ? 'Finalizar' : 'Activar'}
//       </Button>
//     </div>
//   );
// }