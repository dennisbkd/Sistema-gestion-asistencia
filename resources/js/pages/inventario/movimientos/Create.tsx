// resources/js/pages/inventario/movimientos/create.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

import { ArrowLeft, Save, Package, Building, Hash, AlertCircle } from 'lucide-react';
import movimientos from '@/routes/inventario/movimientos';
import { toast } from 'sonner';

interface Inventario {
  id: number;
  nombre: string;
  modelo: string | null;
  marca: string | null;
  stockTotal: number;
  estado: string;
}

interface Aula {
  id: number;
  codigoAula: string;
  capacidad: number;
  tipo: string;
}

interface CreateProps {
  inventario: Inventario[];
  aulas: Aula[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Inventario',
    href: '/inventario',
  },
  {
    title: 'Movimientos',
    href: '/inventario/movimientos',
  },
  {
    title: 'Registrar Movimiento',
    href: '#',
  },
];

export default function MovimientoCreate({ inventario, aulas }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    idInventario: '',
    tipoMovimiento: '',
    cantidad: 0,
    observacion: '',
    idAulaDestino: '',
  });

  const [selectedItem, setSelectedItem] = useState<Inventario | null>(null);

  // Actualizar selectedItem cuando cambia el inventario seleccionado
  useEffect(() => {
    if (data.idInventario) {
      const item = inventario.find(i => i.id === parseInt(data.idInventario));
      setSelectedItem(item || null);
    } else {
      setSelectedItem(null);
    }
  }, [data.idInventario, inventario]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const createPromise = new Promise((resolve, reject) => {
      post(movimientos.store().url, {
        onSuccess: () => {
          resolve('success');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          reject(new Error(errorMessages || 'Error al crear el Material'));
        },
      });
    });

    toast.promise(createPromise, {
      loading: 'Creando Movimiento...',
      success: () => {
        return `Movimiento "${data.tipoMovimiento}" creado exitosamente`;
      },
      error: (error) => {
        return `${error.message}`;
      },
    });
  };

  const getStockAlert = () => {
    if (!selectedItem || data.tipoMovimiento !== 'salida') return null;

    if (selectedItem.stockTotal < data.cantidad) {
      return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm font-medium text-red-800">Stock insuficiente</p>
            <p className="text-sm text-red-600">
              Stock disponible: {selectedItem.stockTotal} unidades
            </p>
          </div>
        </div>
      );
    }

    if (selectedItem.stockTotal - data.cantidad < 5) {
      return (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Stock bajo después del movimiento: {selectedItem.stockTotal - data.cantidad} unidades
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrar Movimiento" />

      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registrar Movimiento</h1>
            <p className="text-muted-foreground">
              Registra una entrada, salida o movimiento de mantenimiento
            </p>
          </div>

          <Link href="/inventario/movimientos">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Movimientos
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Movimiento</CardTitle>
                <CardDescription>
                  Completa los datos del movimiento que deseas registrar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Item y Tipo */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="idInventario">Item del Inventario *</Label>
                        <Select
                          value={data.idInventario}
                          onValueChange={(value) => setData('idInventario', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un item" />
                          </SelectTrigger>
                          <SelectContent>
                            {inventario.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                <div className="flex gap-x-4">
                                  <span className="font-medium">{item.nombre}</span>
                                  <span className="text-sm text-muted-foreground">
                                    Stock: {item.stockTotal} • {item.estado}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <InputError message={errors.idInventario} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tipoMovimiento">Tipo de Movimiento *</Label>
                        <Select
                          value={data.tipoMovimiento}
                          onValueChange={(value: 'entrada' | 'salida' | 'mantenimiento') =>
                            setData('tipoMovimiento', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entrada">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Entrada (Aumenta stock)
                              </div>
                            </SelectItem>
                            <SelectItem value="salida">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                Salida (Disminuye stock)
                              </div>
                            </SelectItem>
                            <SelectItem value="mantenimiento">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                Mantenimiento (No afecta stock)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <InputError message={errors.tipoMovimiento} />
                      </div>
                    </div>

                    {/* Cantidad y Aula */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cantidad">
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Cantidad *
                          </div>
                        </Label>
                        <Input
                          id="cantidad"
                          type="number"
                          value={data.cantidad}
                          onChange={(e) => setData('cantidad', parseInt(e.target.value) || 0)}
                          required
                          min="1"
                          placeholder="Cantidad de unidades"
                          className="w-full"
                        />
                        <InputError message={errors.cantidad} />
                        {selectedItem && (
                          <p className="text-xs text-muted-foreground">
                            Stock actual: {selectedItem.stockTotal} unidades
                          </p>
                        )}
                      </div>

                      {data.tipoMovimiento === 'salida' && (
                        <div className="space-y-2">
                          <Label htmlFor="idAulaDestino">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Aula de Destino
                            </div>
                          </Label>
                          <Select
                            value={data.idAulaDestino}
                            onValueChange={(value) => setData('idAulaDestino', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un aula" />
                            </SelectTrigger>
                            <SelectContent>
                              {aulas.map((aula) => (
                                <SelectItem key={aula.id} value={aula.id.toString()}>
                                  {aula.codigoAula} - {aula.tipo} ({aula.capacidad} pers.)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <InputError message={errors.idAulaDestino} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="space-y-2">
                    <Label htmlFor="observacion">Observaciones *</Label>
                    <Textarea
                      id="observacion"
                      value={data.observacion}
                      onChange={(e) => setData('observacion', e.target.value)}
                      required
                      placeholder="Describe el motivo del movimiento, persona responsable, etc."
                      className="min-h-[100px]"
                    />
                    <InputError message={errors.observacion} />
                  </div>

                  {/* Alertas de Stock */}
                  {getStockAlert()}

                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={processing}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {processing ? 'Registrando...' : 'Registrar Movimiento'}
                    </Button>

                    <Link href="/inventario/movimientos">
                      <Button type="button" variant="outline" disabled={processing}>
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información del Item Seleccionado */}
          <div className="space-y-6">
            {selectedItem ? (
              <Card>
                <CardHeader>
                  <CardTitle>Información del Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedItem.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {selectedItem.id}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedItem.modelo && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Modelo:</span>
                        <span className="text-sm font-medium">{selectedItem.modelo}</span>
                      </div>
                    )}
                    {selectedItem.marca && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Marca:</span>
                        <span className="text-sm font-medium">{selectedItem.marca}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stock Actual:</span>
                      <span className="text-sm font-medium">{selectedItem.stockTotal} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estado:</span>
                      <span className={`text-sm font-medium ${selectedItem.estado === 'disponible' ? 'text-green-600' :
                        selectedItem.estado === 'agotado' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                        {selectedItem.estado}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona un Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona un item del inventario para ver su información</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Información de Impacto */}
            {selectedItem && data.tipoMovimiento && data.cantidad > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Impacto del Movimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Stock actual:</span>
                    <span className="text-sm font-medium">{selectedItem.stockTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Movimiento:</span>
                    <span className={`text-sm font-medium ${data.tipoMovimiento === 'entrada' ? 'text-green-600' :
                      data.tipoMovimiento === 'salida' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                      {data.tipoMovimiento === 'entrada' ? '+' : '-'}{data.cantidad}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Nuevo stock:</span>
                      <span className={`text-sm font-bold ${data.tipoMovimiento === 'entrada' ? 'text-green-600' :
                        data.tipoMovimiento === 'salida' && selectedItem.stockTotal - data.cantidad < 0 ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                        {data.tipoMovimiento === 'entrada'
                          ? selectedItem.stockTotal + data.cantidad
                          : selectedItem.stockTotal - data.cantidad
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}