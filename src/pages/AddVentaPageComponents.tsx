import { useState, ChangeEvent } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { EstadoVenta } from '../interfaces/Venta';
import Boton from '../components/Boton';
import Selector from '../components/Selector';
import { Opcion } from '../interfaces/Opcion';

export default function AddVentaPage() {
    const addVenta = useGlobalStore((state) => state.addVenta);

    const [formData, setFormData] = useState({ nombre: '', tipo: '' });
    const [errors, setErrors] = useState({ nombre: '', tipo: '' });

    const nameRegex = /^[a-zA-ZÀ-ÿ]+(\s[a-zA-ZÀ-ÿ]+)*$/;

    const OPCIONES_VENTA: Opcion[] = [
        { valor: 'completada', texto: 'Completada' },
        { valor: 'procesando', texto: 'Procesando' },
        { valor: 'pedida', texto: 'Pedida' }
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Limpiamos el error específico al empezar a corregir
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nombreLimpio = formData.nombre.trim();
        let nuevosErrores = { nombre: '', tipo: '' };
        let hayErrores = false;

        // Validación de Nombre
        if (!nombreLimpio) {
            nuevosErrores.nombre = "El nombre es obligatorio.";
            hayErrores = true;
        } else if (!nameRegex.test(nombreLimpio)) {
            nuevosErrores.nombre = "El nombre solo permite letras y espacios únicos.";
            hayErrores = true;
        }

        // 2. Validación de Selección Vacía
        if (!formData.tipo) {
            nuevosErrores.tipo = "Debes seleccionar un estado para la venta.";
            hayErrores = true;
        }

        if (hayErrores) {
            setErrors(nuevosErrores);
            return;
        }

        // Si todo está bien, guardamos (forzamos el tipo como Venta['tipo'])
        addVenta({
            nombre: nombreLimpio,
            tipo: formData.tipo as EstadoVenta
        });

        // 3. Reset completo a vacío
        setFormData({ nombre: '', tipo: '' });
        alert("Venta añadida correctamente");
    };

    return (
        <section>
            <h2>Registrar Nueva Venta</h2>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos de la venta</legend>

                    {/* Tu input de nombre normal... */}

                    <Selector
                        label="Estado de la Venta"
                        valor={formData.tipo}
                        opciones={OPCIONES_VENTA}
                        onChange={(val) => setFormData({ ...formData, tipo: val })}
                        placeholder="-- Selecciona --"
                        error={errors.tipo}
                    />

                    <Boton texto="Añadir a la lista" type="submit" />
                </fieldset>
            </form>
        </section>
    );
}