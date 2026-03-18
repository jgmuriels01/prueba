interface BotonProps {
    texto: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    color?: string;
    disabled?: boolean;
}

export default function Boton({ texto, onClick, type = "button", color, disabled }: BotonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                width: '100%',
                backgroundColor: color || '', // Si no hay color, usa el de Water.css
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
        >
            {texto}
        </button>
    );
}