export interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    password?: string; // Opcional para cuando lo usemos en la sesión
}