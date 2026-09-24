import { Routes, Route } from 'react-router-dom'
import SalesLandingPage from './sales/SalesLandingPage'
import PortfolioHome from './portfolio/PortfolioHome'
import PortfolioTrilha from './portfolio/PortfolioTrilha'
import PortfolioStartup from './portfolio/PortfolioStartup'
import Login from './pages/Login'
import ClienteArea from './pages/ClienteArea'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Clientes from './pages/admin/Clientes'
import ClienteDetalhe from './pages/admin/ClienteDetalhe'
import Projetos from './pages/admin/Projetos'
import Orcamentos from './pages/admin/Orcamentos'
import Formularios from './pages/admin/Formularios'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SalesLandingPage />} />
      <Route path="/portifolio" element={<PortfolioHome />} />
      <Route path="/trilha" element={<PortfolioTrilha />} />
      <Route path="/startup" element={<PortfolioStartup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cliente/:slug" element={<ClienteArea />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id" element={<ClienteDetalhe />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="orcamentos" element={<Orcamentos />} />
        <Route path="formularios" element={<Formularios />} />
      </Route>
    </Routes>
  )
}
