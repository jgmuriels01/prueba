import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore } from '../store/useGlobalStore';
import { useSessionStore } from '../store/useSessionStore';

export default function LoginPage() {
    const usuarios = useGlobalStore((state) => state.usuarios);
    const login = useSessionStore((state) => state.login);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Buscar al usuario en el store global
        const usuarioEncontrado = usuarios.find(
            (u) => u.email === formData.email && u.password === formData.password
        );

        if (usuarioEncontrado) {
            // Guardar en el store de sesión (sessionStorage)
            login(usuarioEncontrado);
            alert(`Bienvenido de nuevo, ${usuarioEncontrado.nombre}`);
            navigate('/home');
        } else {
            setError('Credenciales incorrectas. Revisa tu email y contraseña.');
        }
    };

    return (
        <section style={{ maxWidth: '400px', margin: '2rem auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Acceso</legend>

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {error && (
                        <p style={{
                            color: '#ff4444',
                            backgroundColor: '#ffebee',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ffcccc'
                        }}>
                            {error}
                        </p>
                    )}

                    <button type="submit" style={{ width: '100%', marginTop: '10px' }}>
                        Entrar
                    </button>
                </fieldset>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                ¿No tienes cuenta? <button onClick={() => navigate('/signup')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>Regístrate aquí</button>
            </p>
        </section>
    );
}