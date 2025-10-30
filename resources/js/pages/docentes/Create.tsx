// import AppLayout from '@/layouts/app-layout';
// import { type BreadcrumbItem } from '@/types';
// import { Head, Link } from '@inertiajs/react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { ArrowLeft, Save, Phone, Briefcase, Clock, User } from 'lucide-react';
// import { index } from '@/routes/docentes';

// const breadcrumbs: BreadcrumbItem[] = [
//   {
//     title: 'Dashboard',
//     href: '/dashboard',
//   },
//   {
//     title: 'Docentes',
//     href: index().url,
//   },
//   {
//     title: 'Nuevo Docente',
//     href: '#',
//   },
// ];

// export default function Create() {
//   return (
//     <AppLayout breadcrumbs={breadcrumbs}>
//       <Head title="Crear Nuevo Docente" />

//       <div className="flex h-full flex-1 flex-col gap-6 p-6">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Docente</h1>
//             <p className="text-muted-foreground">
//               Asocia un usuario con rol docente al sistema académico
//             </p>
//           </div>

//           <Link href={index().url}>
//             <Button variant="outline" className="flex items-center gap-2">
//               <ArrowLeft className="h-4 w-4" />
//               Volver
//             </Button>
//           </Link>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Información del Docente</CardTitle>
//             <CardDescription>
//               Completa todos los campos para crear un nuevo docente
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-6">
//               <div className="grid gap-4 md:grid-cols-2">
//                 {/* Usuario */}
//                 <div className="space-y-2">
//                   <Label htmlFor="idUsuario">Usuario Docente *</Label>
//                   <Select disabled>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Selecciona un usuario docente" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="1">
//                         <div className="flex flex-col">
//                           <span className="font-medium">Dr. Carlos Mendoza</span>
//                           <span className="text-sm text-muted-foreground">carlos.mendoza@universidad.edu</span>
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="2">
//                         <div className="flex flex-col">
//                           <span className="font-medium">Dra. Ana López</span>
//                           <span className="text-sm text-muted-foreground">ana.lopez@universidad.edu</span>
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Código Docente */}
//                 <div className="space-y-2">
//                   <Label htmlFor="codigoDocente">Código del Docente *</Label>
//                   <Input
//                     id="codigoDocente"
//                     placeholder="Ej: DOC-2024-001"
//                     disabled
//                   />
//                 </div>

//                 {/* Teléfono */}
//                 <div className="space-y-2">
//                   <Label htmlFor="telefono">
//                     <div className="flex items-center gap-2">
//                       <Phone className="h-4 w-4" />
//                       Teléfono
//                     </div>
//                   </Label>
//                   <Input
//                     id="telefono"
//                     placeholder="Ej: +591 12345678"
//                     disabled
//                   />
//                 </div>

//                 {/* Especialidad */}
//                 <div className="space-y-2">
//                   <Label htmlFor="especialidad">
//                     <div className="flex items-center gap-2">
//                       <Briefcase className="h-4 w-4" />
//                       Especialidad
//                     </div>
//                   </Label>
//                   <Input
//                     id="especialidad"
//                     placeholder="Ej: Matemáticas, Física, Programación..."
//                     disabled
//                   />
//                 </div>

//                 {/* Horas Máximas Semanales */}
//                 <div className="space-y-2">
//                   <Label htmlFor="maxHorasSemanales">
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4" />
//                       Horas Máximas Semanales *
//                     </div>
//                   </Label>
//                   <Input
//                     id="maxHorasSemanales"
//                     type="number"
//                     defaultValue="40"
//                     disabled
//                   />
//                 </div>

//                 {/* Estado */}
//                 <div className="space-y-2">
//                   <Label htmlFor="estado">Estado *</Label>
//                   <Select disabled defaultValue="activo">
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="activo">Activo</SelectItem>
//                       <SelectItem value="inactivo">Inactivo</SelectItem>
//                       <SelectItem value="licencia">Licencia</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex gap-4 pt-4">
//                 <Button disabled className="flex items-center gap-2">
//                   <Save className="h-4 w-4" />
//                   Guardar Docente
//                 </Button>
                
//                 <Link href={index().url}>
//                   <Button type="button" variant="outline">
//                     Cancelar
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </AppLayout>
//   );
// }