import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout         from './components/layout/Layout'
import Login          from './components/pages/auth/Login'
import Register       from './components/pages/auth/Register'
import Dashboard      from './components/pages/dashboard/Dashboard'
import Mappa          from './components/pages/dashboard/Mappa'
import Alert          from './components/pages/dashboard/Alert'
import Analisi        from './components/pages/dashboard/Analisi'
import Cassonetti     from './components/pages/dashboard/Cassonetti'
import Utenti         from './components/pages/dashboard/Utenti'
import Configurazione from './components/pages/dashboard/Configurazione'

function Guard() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/auth/login" replace />
}

function GuestGuard() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <Outlet />
}

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <GuestGuard />,
        children: [
          { path: '/auth/login',            element: <Login /> },
          { path: '/auth/register',         element: <Register /> },
        ]
      },
      {
        element: <Guard />,
        children: [{
          element: <Layout />,
          children: [
            { path: '/',              element: <Dashboard /> },
            { path: '/mappa',         element: <Mappa /> },
            { path: '/alert',         element: <Alert /> },
            { path: '/analisi',       element: <Analisi /> },
            { path: '/cassonetti',    element: <Cassonetti /> },
            { path: '/utenti',        element: <Utenti /> },
            { path: '/configurazione',element: <Configurazione /> },
          ]
        }]
      },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} />
}