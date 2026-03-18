import { useGlobalStore } from "../store/useGlobalStore";

export default function ListaVentasPage() {
    const ventas = useGlobalStore((state) => state.ventas);
    const clearVentas = useGlobalStore((state) => state.clearVentas);

    const getStatusStyles = (tipo: string) => {
        switch (tipo) {
            case 'completada':
                return { backgroundColor: 'green', color: 'white' };
            case 'procesando':
                return { backgroundColor: 'yellow', color: 'black' };
            case 'pedida':
                return { backgroundColor: 'blue', color: 'white' };
            default:
                return { backgroundColor: 'grey', color: 'white' };
        }
    };

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Historial de ventas</h2>
                {ventas.length > 0 && (
                    <button onClick={clearVentas} style={{ backgroundColor: 'red' }}>
                        Limpiar Lista
                    </button>
                )}
            </div>

            {ventas.length === 0 ? (
                <p>No hay registros guardados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Venta</th>
                            <th>Estado Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta, index) => (
                            <tr key={index}>
                                <td>{venta.nombre}</td>
                                <td>
                                    <span style={getStatusStyles(venta.tipo)}>
                                        {venta.tipo.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}