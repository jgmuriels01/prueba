import { createBrowserRouter, RouterProvider, Outlet, Navigate, Link } from "react-router-dom";
import AddVentaPage from "./pages/AddVentaPage";
import ListaVentasPage from "./pages/ListaVentasPage";
import Home from "./pages/Home";
import { useSessionStore } from "./store/useSessionStore";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ModificarPage from "./pages/ModificarPage";

const MainLayout = () => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const logout = useSessionStore((state) => state.logout); // Opcional: para cerrar sesión

  return (
    <div style={{ margin: '0 auto', padding: '20px' }}>
      <header>
        <nav>
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0 }}>
            {/* Links para TODOS */}
            <li><Link to="/home">Inicio</Link></li>
            <li><Link to="/add_venta">Añadir Venta</Link></li>
            <li><Link to="/lista_ventas">Ver Ventas</Link></li>

            {/* Links solo para ANÓNIMOS */}
            {!isAuthenticated && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            )}

            {/* Links solo para LOGUEADOS */}
            {isAuthenticated && (
              <>
                <li><Link to="/modificar">Modificar</Link></li>
                <li><button onClick={logout}>Salir</button></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  );
};

const ProtectedRoute = () => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);

  // Si no está autenticado, mandarlo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el contenido de la ruta
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      // Rutas Públicas (Cualquiera entra)
      { path: "/home", element: <Home /> },
      { path: "/add_venta", element: <AddVentaPage /> },
      { path: "/lista_ventas", element: <ListaVentasPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },

      // Rutas Protegidas (Solo logueados)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/modificar", element: <ModificarPage /> },
        ],
      },

      // Redirección por defecto
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}