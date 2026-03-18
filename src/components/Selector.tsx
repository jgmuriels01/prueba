import { Opcion } from '../interfaces/Opcion';

interface SelectorProps {
    label: string;
    valor: string | number;
    opciones: Opcion[];
    onChange: (valor: string) => void;
    error?: string;
    placeholder?: string;
}

export default function Selector({ label, valor, opciones, onChange, error, placeholder }: SelectorProps) {
    const errorStyle = { color: '#ff4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' };

    return (
        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label>{label}</label>
            <select 
                value={valor} 
                onChange={(e) => onChange(e.target.value)}
                style={{ borderColor: error ? '#ff4444' : '' }}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {opciones.map((opc) => (
                    <option key={opc.valor} value={opc.valor}>
                        {opc.texto}
                    </option>
                ))}
            </select>
            {error && <span style={errorStyle}>{error}</span>}
        </div>
    );
}