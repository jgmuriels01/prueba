import { useState, ChangeEvent } from 'react';
import { useGlobalStore } from '../store/useGlobalStore';
import { Usuario } from '../interfaces/Usuario';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
    const registrarUsuario = useGlobalStore((state) => state.registrarUsuario);
    const usuariosExistentes = useGlobalStore((state) => state.usuarios);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Ahora errores es un objeto con la misma estructura que el form
    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Limpiamos el error del campo que el usuario está editando
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let nuevosErrores = { nombre: '', apellido: '', email: '', password: '', confirmPassword: '' };
        let hayErrores = false;

        // Validación: Campos vacíos
        if (!formData.nombre.trim()) { nuevosErrores.nombre = 'El nombre es obligatorio'; hayErrores = true; }
        if (!formData.apellido.trim()) { nuevosErrores.apellido = 'El apellido es obligatorio'; hayErrores = true; }

        // Validación: Email
        if (!formData.email.trim()) {
            nuevosErrores.email = 'El email es obligatorio'; hayErrores = true;
        } else if (usuariosExistentes.find(u => u.email === formData.email)) {
            nuevosErrores.email = 'Este email ya está registrado'; hayErrores = true;
        }

        // Validación: Password
        if (formData.password.length < 4) {
            nuevosErrores.password = 'La contraseña debe tener al menos 4 caracteres'; hayErrores = true;
        }

        // Validación: Confirmar Password
        if (formData.password !== formData.confirmPassword) {
            nuevosErrores.confirmPassword = 'Las contraseñas no coinciden'; hayErrores = true;
        }

        if (hayErrores) {
            setErrors(nuevosErrores);
            return;
        }

        // Si todo es correcto, guardamos
        const { confirmPassword, ...datosUsuario } = formData;
        const nuevoUsuario: Usuario = {
            id: crypto.randomUUID(),
            ...datosUsuario
        };

        registrarUsuario(nuevoUsuario);
        alert('Usuario registrado con éxito');
        navigate('/login');
    };

    // Estilo pequeño para los mensajes de error
    const errorStyle = { color: '#ff4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' };

    return (
        <section style={{ maxWidth: '400px', margin: '2rem auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Crear Cuenta</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos personales</legend>

                    <label>Nombre</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                        style={{ borderColor: errors.nombre ? '#ff4444' : '' }} />
                    {errors.nombre && <span style={errorStyle}>{errors.nombre}</span>}

                    <label>Apellido</label>
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                        style={{ borderColor: errors.apellido ? '#ff4444' : '' }} />
                    {errors.apellido && <span style={errorStyle}>{errors.apellido}</span>}

                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        style={{ borderColor: errors.email ? '#ff4444' : '' }} />
                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </fieldset>

                <fieldset style={{ marginTop: '1rem' }}>
                    <legend>Seguridad</legend>

                    <label>Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange}
                        style={{ borderColor: errors.password ? '#ff4444' : '' }} />
                    {errors.password && <span style={errorStyle}>{errors.password}</span>}

                    <label>Repite Contraseña</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                        style={{ borderColor: errors.confirmPassword ? '#ff4444' : '' }} />
                    {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}

                    <button type="submit" style={{ width: '100%', marginTop: '1.5rem' }}>
                        Registrarse
                    </button>
                </fieldset>
            </form>
        </section>
    );
}