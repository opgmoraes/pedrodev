import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import SalesLandingPage from './sales/SalesLandingPage'
import ProtectedRoute from './components/ProtectedRoute'

// Carregadas sob demanda: só baixam quando o visitante realmente navega
// pra essas rotas, em vez de entrar no pacote inicial de "/".
const PortfolioHome = lazy(() => import('./portfolio/PortfolioHome'))
const Login = lazy(() => import('./pages/Login'))
const ClienteArea = lazy(() => import('./pages/ClienteArea'))
const PropostaPublica = lazy(() => import('./pages/public/PropostaPublica'))
const ContratoPublico = lazy(() => import('./pages/public/ContratoPublico'))
const LinkInBio = lazy(() => import('./pages/LinkInBio'))
const Contratos = lazy(() => import('./pages/admin/Contratos'))
const AdminLayout = lazy(() => import('./components/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Clientes = lazy(() => import('./pages/admin/Clientes'))
const ClienteDetalhe = lazy(() => import('./pages/admin/ClienteDetalhe'))
const Projetos = lazy(() => import('./pages/admin/Projetos'))
const Orcamentos = lazy(() => import('./pages/admin/Orcamentos'))
const Formularios = lazy(() => import('./pages/admin/Formularios'))

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<SalesLandingPage />} />
        <Route path="/portifolio" element={<PortfolioHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cliente/:slug" element={<ClienteArea />} />
        <Route path="/proposta/:slug" element={<PropostaPublica />} />
        <Route path="/contrato/:slug" element={<ContratoPublico />} />
        <Route path="/link" element={<LinkInBio />} />

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
          <Route path="contratos" element={<Contratos />} />
          <Route path="formularios" element={<Formularios />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
