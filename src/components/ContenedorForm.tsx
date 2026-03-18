interface Props {
    children: React.ReactNode;
    titulo: string;
}

export default function ContenedorForm({ children, titulo }: Props) {
    return (
        <section style={{ maxWidth: '450px', margin: '2rem auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>{titulo}</h2>
            {children}
        </section>
    );
}