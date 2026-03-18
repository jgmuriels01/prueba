import { useState, ChangeEvent } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { useSessionStore } from '../store/useSessionStore';

export default function ModificarPage() {
    const userSession = useSessionStore((state) => state.userSession);
    const login = useSessionStore((state) => state.login);
    const usuarios = useGlobalStore((state) => state.usuarios);

    // Quitamos el email de la gestión del formulario ya que no se va a editar
    const [formData, setFormData] = useState({
        nombre: userSession?.nombre || '',
        apellido: userSession?.apellido || '',
        password: userSession?.password || ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        password: ''
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

        let nuevosErrores = { nombre: '', apellido: '', password: '' };
        let hayErrores = false;

        if (!formData.nombre.trim()) { nuevosErrores.nombre = 'El nombre es obligatorio'; hayErrores = true; }
        if (!formData.apellido.trim()) { nuevosErrores.apellido = 'El apellido es obligatorio'; hayErrores = true; }
        if (!formData.password.trim()) { nuevosErrores.password = 'La contraseña es obligatoria'; hayErrores = true; }

        if (hayErrores) {
            setErrors(nuevosErrores);
            return;
        }

        const index = usuarios.findIndex(u => u.id === userSession.id);
        if (index !== -1) {
            // El email se mantiene tal cual estaba en userSession
            const usuarioActualizado = {
                ...userSession,
                ...formData
            };

            const nuevaLista = [...usuarios];
            nuevaLista[index] = usuarioActualizado;

            useGlobalStore.setState({ usuarios: nuevaLista });
            login(usuarioActualizado);
            setMensajeExito('Perfil actualizado correctamente');
        }
    };

    const errorStyle = { color: '#ff4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' };

    return (
        <section style={{ maxWidth: '400px', margin: '2rem auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Mi Perfil</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos de usuario</legend>

                    {/* Input de Email Deshabilitado */}
                    <label>Email (No se puede modificar)</label>
                    <input
                        type="email"
                        value={userSession?.email || ''}
                        disabled
                        style={{ backgroundColor: 'var(--background-alt)', cursor: 'not-allowed', opacity: 0.7 }}
                    />

                    <label>Nombre</label>
                    <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        style={{ borderColor: errors.nombre ? '#ff4444' : '' }}
                    />
                    {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}

                    <label>Apellido</label>
                    <input
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        style={{ borderColor: errors.apellido ? '#ff4444' : '' }}
                    />
                    {errors.apellido && <span style={errorStyle}>{errors.apellido}</span>}

                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ borderColor: errors.password ? '#ff4444' : '' }}
                    />
                    {errors.password && <span style={errorStyle}>{errors.password}</span>}

                    {mensajeExito && (
                        <p style={{ color: 'green', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                            {mensajeExito}
                        </p>
                    )}

                    <button type="submit" style={{ width: '100%', marginTop: '1.5rem' }}>
                        Guardar Cambios
                    </button>
                </fieldset>
            </form>
        </section>
    );
}