interface InputProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
}

export default function Input({ label, name, value, type = "text", onChange, error, placeholder, disabled }: InputProps) {
    const errorStyle = { color: '#ff4444', fontSize: '0.85rem', marginTop: '4px', display: 'block' };

    return (
        <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    borderColor: error ? '#ff4444' : '',
                    backgroundColor: disabled ? 'var(--background-alt)' : '',
                    cursor: disabled ? 'not-allowed' : 'text'
                }}
            />
            {error && <span style={errorStyle}>{error}</span>}
        </div>
    );
}