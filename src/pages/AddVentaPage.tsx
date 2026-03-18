import { useState, ChangeEvent } from 'react';
import { useAuthStore, Venta } from '../store/useAuthStore';

export default function AddVentaPage() {
    const addVenta = useAuthStore((state) => state.addVenta);

    const [formData, setFormData] = useState({ nombre: '', tipo: '' });
    const [errors, setErrors] = useState({ nombre: '', tipo: '' });

    const nameRegex = /^[a-zA-ZÀ-ÿ]+(\s[a-zA-ZÀ-ÿ]+)*$/;

    const OPCIONES_TIPO_VENTA = [
        { value: 'completada', label: 'Completada' },
        { value: 'procesando', label: 'Procesando' },
        { value: 'pedida', label: 'Pedida' }
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
            tipo: formData.tipo as Venta['tipo']
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

                    {/* Campo Nombre */}
                    <label>Nombre:</label>
                    <input
                        id="nombre"
                        type="text"
                        name="nombre"
                        placeholder="Ej: Camiseta"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{ borderColor: errors.nombre ? 'red' : '' }}
                    />
                    {errors.nombre && (
                        <p style={{ color: 'red' }}>
                            {errors.nombre}
                        </p>
                    )}

                    {/* Campo Tipo con opción vacía */}
                    <label >Estado de la Venta:</label>
                    <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                        <option value="" disabled>-- Selecciona --</option>
                        {OPCIONES_TIPO_VENTA.map((opcion) => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    {errors.tipo && (
                        <p style={{ color: 'red' }}>
                            {errors.tipo}
                        </p>
                    )}

                    <button type="submit" style={{ width: '100%' }}>
                        Añadir a la lista
                    </button>
                </fieldset>
            </form>
        </section>
    );
}