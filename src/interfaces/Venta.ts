export type EstadoVenta = 'completada' | 'procesando' | 'pedida';

export interface Venta {
    nombre: string;
    tipo: EstadoVenta;
}