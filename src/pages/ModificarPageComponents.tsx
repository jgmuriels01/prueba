import { useState, ChangeEvent } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { useSessionStore } from '../store/useSessionStore';
import ContenedorForm from '../components/ContenedorForm';
import Input from '../components/Input';
import Alerta from '../components/Alerta';
import Boton from '../components/Boton'; // Asegúrate de importar tu componente Boton

export default function ModificarPage() {
    const userSession = useSessionStore((state) => state.userSession);
    const login = useSessionStore((state) => state.login);
    const usuarios = useGlobalStore((state) => state.usuarios);

    const [formData, setFormData] = useState({
        nombre: userSession?.nombre || '',
        apellido: userSession?.apellido || '',
        password: userSession?.password || '',
        confirmPassword: '' // Campo para la validación
    });

    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        password: '',
        confirmPassword: ''
    });

    const [mensajeExito, setMensajeExito] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
        setMensajeExito('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userSession) return;

        let nuevosErrores = { nombre: '', apellido: '', password: '', confirmPassword: '' };
        let hayErrores = false;

        // Validaciones
        if (!formData.nombre.trim()) { nuevosErrores.nombre = 'El nombre es obligatorio'; hayErrores = true; }
        if (!formData.apellido.trim()) { nuevosErrores.apellido = 'El apellido es obligatorio'; hayErrores = true; }
        if (!formData.password.trim()) { nuevosErrores.password = 'La contraseña es obligatoria'; hayErrores = true; }

        // Validación de coincidencia
        if (formData.password !== formData.confirmPassword) {
            nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
            hayErrores = true;
        }

        if (hayErrores) {
            setErrors(nuevosErrores);
            return;
        }

        const index = usuarios.findIndex(u => u.id === userSession.id);
        if (index !== -1) {
            // Extraemos confirmPassword para no guardarlo en el store global
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...datosParaGuardar } = formData;

            const usuarioActualizado = {
                ...userSession,
                ...datosParaGuardar
            };

            const nuevaLista = [...usuarios];
            nuevaLista[index] = usuarioActualizado;

            useGlobalStore.setState({ usuarios: nuevaLista });
            login(usuarioActualizado);

            // Limpiar campo de confirmación por seguridad
            setFormData(prev => ({ ...prev, confirmPassword: '' }));
            setMensajeExito('Perfil actualizado correctamente');
        }
    };

    return (
        <ContenedorForm titulo="Mi Perfil">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos de usuario</legend>

                    <Input
                        label="Email"
                        name="email"
                        value={userSession?.email || ''}
                        onChange={() => { }}
                        disabled
                    />

                    <Input
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={errors.nombre}
                    />

                    <Input
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        error={errors.apellido}
                    />
                </fieldset>

                <fieldset style={{ marginTop: '1rem' }}>
                    <legend>Seguridad</legend>
                    <Input
                        label="Nueva Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <Input
                        label="Repetir Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={errors.confirmPassword}
                    />

                    <Alerta mensaje={mensajeExito} tipo="exito" />

                    <Boton texto="Guardar Cambios" type="submit" />
                </fieldset>
            </form>
        </ContenedorForm>
    );
}