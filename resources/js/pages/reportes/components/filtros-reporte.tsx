// // resources/js/components/reportes/filtros-reporte.tsx
// import { useState, useEffect, useCallback } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { Filter, Download, RefreshCw } from 'lucide-react';

// interface FiltroData {
//   periodos: Array<{ id: number; nombre: string }>;
//   materias: Array<{ id: number; nombre: string }>;
//   docentes: Array<{ id: number; nombre: string }>;
// }

// interface Filtros {
//   idPeriodo: string;
//   idMateria: string;
//   idDocente: string;
//   fechaInicio: string;
//   fechaFin: string;
// }

// interface FiltrosReporteProps {
//   onFiltrosChange: (filtros: Filtros) => void;
//   onGenerarReporte: () => void;
//   loading?: boolean;
//   showFechas?: boolean;
//   periodos: Array<{ id: number; nombre: string }>;
//   materias: Array<{ id: number; nombre: string }>;
//   docentes: Array<{ id: number; nombre: string }>;
// }

// export default function FiltrosReporte({ 
//   onFiltrosChange, 
//   onGenerarReporte, 
//   loading = false,
//   showFechas = false,
//   periodos = [],
//   materias = [],
//   docentes = []
// }: FiltrosReporteProps) {
//   const [filtros, setFiltros] = useState<Filtros>({
//     idPeriodo: '',
//     idMateria: '',
//     idDocente: '',
//     fechaInicio: '',
//     fechaFin: ''
//   });

//   // Memoizar la función de cambio de filtros
//   const handleFiltrosChange = useCallback((newFiltros: Filtros) => {
//     onFiltrosChange(newFiltros);
//   }, [onFiltrosChange]);

//   useEffect(() => {
//     handleFiltrosChange(filtros);
//   }, [filtros, handleFiltrosChange]);

//   const handleFiltroChange = (key: keyof Filtros, value: string) => {
//     setFiltros(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const limpiarFiltros = () => {
//     setFiltros({
//       idPeriodo: '',
//       idMateria: '',
//       idDocente: '',
//       fechaInicio: '',
//       fechaFin: ''
//     });
//   };

//   const handleGenerarReporte = () => {
//     onGenerarReporte();
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Filter className="h-5 w-5" />
//           Filtros del Reporte
//         </CardTitle>
//         <CardDescription>
//           Selecciona los criterios para generar el reporte
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Filtro Periodo */}
//           <div className="space-y-2">
//             <Label htmlFor="periodo">Periodo Académico</Label>
//             <Select
//               value={filtros.idPeriodo}
//               onValueChange={(value) => handleFiltroChange('idPeriodo', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Todos los periodos" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos los periodos</SelectItem>
//                 {periodos.map((periodo) => (
//                   <SelectItem key={periodo.id} value={periodo.id.toString()}>
//                     {periodo.nombre}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Filtro Materia */}
//           <div className="space-y-2">
//             <Label htmlFor="materia">Materia</Label>
//             <Select
//               value={filtros.idMateria}
//               onValueChange={(value) => handleFiltroChange('idMateria', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Todas las materias" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todas las materias</SelectItem>
//                 {materias.map((materia) => (
//                   <SelectItem key={materia.id} value={materia.id.toString()}>
//                     {materia.nombre}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Filtro Docente */}
//           <div className="space-y-2">
//             <Label htmlFor="docente">Docente</Label>
//             <Select
//               value={filtros.idDocente}
//               onValueChange={(value) => handleFiltroChange('idDocente', value)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Todos los docentes" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">Todos los docentes</SelectItem>
//                 {docentes.map((docente) => (
//                   <SelectItem key={docente.id} value={docente.id.toString()}>
//                     {docente.nombre}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Filtros de fecha opcionales */}
//         {showFechas && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
//             <div className="space-y-2">
//               <Label htmlFor="fechaInicio">Fecha Inicio</Label>
//               <input
//                 type="date"
//                 id="fechaInicio"
//                 value={filtros.fechaInicio}
//                 onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
//                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="fechaFin">Fecha Fin</Label>
//               <input
//                 type="date"
//                 id="fechaFin"
//                 value={filtros.fechaFin}
//                 onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
//                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//               />
//             </div>
//           </div>
//         )}

//         <div className="flex gap-2 pt-4">
//           <Button 
//             onClick={handleGenerarReporte} 
//             disabled={loading}
//             className="flex items-center gap-2"
//           >
//             {loading ? (
//               <RefreshCw className="h-4 w-4 animate-spin" />
//             ) : (
//               <Filter className="h-4 w-4" />
//             )}
//             {loading ? 'Generando...' : 'Generar Reporte'}
//           </Button>
          
//           <Button 
//             variant="outline" 
//             onClick={limpiarFiltros}
//             disabled={loading}
//           >
//             Limpiar
//           </Button>

//           <Button variant="outline" className="flex items-center gap-2 ml-auto">
//             <Download className="h-4 w-4" />
//             Exportar
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }