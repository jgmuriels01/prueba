interface AlertaProps {
    mensaje: string;
    tipo: 'exito' | 'error';
}

export default function Alerta({ mensaje, tipo }: AlertaProps) {
    if (!mensaje) return null;

    const estilos = {
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
        marginBottom: '10px',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textAlign: 'center' as const,
        border: '1px solid',
        backgroundColor: tipo === 'exito' ? '#e8f5e9' : '#ffebee',
        color: tipo === 'exito' ? '#2e7d32' : '#c62828',
        borderColor: tipo === 'exito' ? '#a5d6a7' : '#ffcccc',
    };

    return <div style={estilos}>{mensaje}</div>;
}