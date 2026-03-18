import { useState, ChangeEvent } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { useSessionStore } from '../store/useSessionStore';

export default function ModificarPage() {
    const userSession = useSessionStore((state) => state.userSession);
    const login = useSessionStore((state) => state.login);
    const usuarios = useGlobalStore((state) => state.usuarios);

    const [formData, setFormData] = useState({
        nombre: userSession?.nombre || '',
        apellido: userSession?.apellido || '',
        password: userSession?.password || '',
        confirmPassword: '' // Campo para repetir la contraseña
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

        // Validaciones básicas
        if (!formData.nombre.trim()) { nuevosErrores.nombre = 'El nombre es obligatorio'; hayErrores = true; }
        if (!formData.apellido.trim()) { nuevosErrores.apellido = 'El apellido es obligatorio'; hayErrores = true; }
        if (!formData.password.trim()) { nuevosErrores.password = 'La contraseña es obligatoria'; hayErrores = true; }

        // Validación: Coincidencia de contraseñas
        if (formData.password !== formData.confirmPassword) {
            nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
            hayErrores = true;
        }

        if (hayErrores) {
            setErrors(nuevosErrores);
            return;
        }

        // Lógica de actualización
        const index = usuarios.findIndex(u => u.id === userSession.id);
        if (index !== -1) {
            // Extraemos confirmPassword para no guardarlo en el store
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...datosActualizados } = formData;

            const usuarioActualizado = { 
                ...userSession, 
                ...datosActualizados 
            };
            
            const nuevaLista = [...usuarios];
            nuevaLista[index] = usuarioActualizado;
            
            useGlobalStore.setState({ usuarios: nuevaLista });
            login(usuarioActualizado);
            
            // Limpiamos el campo de confirmar para la siguiente edición
            setFormData(prev => ({ ...prev, confirmPassword: '' }));
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
                    
                    <label>Email (No modificable)</label>
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
                </fieldset>

                <fieldset style={{ marginTop: '1rem' }}>
                    <legend>Seguridad</legend>
                    <label>Nueva Contraseña</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        style={{ borderColor: errors.password ? '#ff4444' : '' }}
                    />
                    {errors.password && <span style={errorStyle}>{errors.password}</span>}

                    <label>Repetir Contraseña</label>
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange}
                        style={{ borderColor: errors.confirmPassword ? '#ff4444' : '' }}
                    />
                    {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}

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