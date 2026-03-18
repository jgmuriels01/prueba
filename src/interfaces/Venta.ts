import { EstadoVenta } from "./EstadoVenta";

export interface Venta {
    nombre: string;
    tipo: EstadoVenta;
}