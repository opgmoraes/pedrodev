import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SalesLandingPage from "./sales/SalesLandingPage";
import RouteLoading from "./components/RouteLoading";
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Carregadas sob demanda: só baixam quando o visitante realmente navega
// pra essas rotas, em vez de entrar no pacote inicial de "/".
const PortfolioTrilha = lazy(() => import("./portfolio/PortfolioTrilha"));
const PortfolioStartup = lazy(() => import("./portfolio/PortfolioStartup"));
const Login = lazy(() => import("./pages/Login"));
const ClienteArea = lazy(() => import("./pages/ClienteArea"));
const PropostaPublica = lazy(() => import("./pages/public/PropostaPublica"));
const ContratoPublico = lazy(() => import("./pages/public/ContratoPublico"));
const LinkInBio = lazy(() => import("./pages/LinkInBio"));
const Contratos = lazy(() => import("./pages/admin/Contratos"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Financeiro = lazy(() => import("./pages/admin/Financeiro"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Clientes = lazy(() => import("./pages/admin/Clientes"));
const ClienteDetalhe = lazy(() => import("./pages/admin/ClienteDetalhe"));
const Projetos = lazy(() => import("./pages/admin/Projetos"));
const Orcamentos = lazy(() => import("./pages/admin/Orcamentos"));
const Formularios = lazy(() => import("./pages/admin/Formularios"));
const AdminPortfolio = lazy(() => import("./pages/admin/Portfolio"));

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    const privatePage = /^\/(admin|login|cliente|proposta|contrato)(\/|$)/.test(
      pathname,
    );
    const robots = document.querySelector('meta[name="robots"]');
    robots?.setAttribute(
      "content",
      privatePage ? "noindex, nofollow" : "index, follow",
    );
    if (privatePage) document.title = "Área de projetos | Pedro Gomes";
    if (!window.location.hash)
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<SalesLandingPage />} />
        <Route path="/portifolio" element={<SalesLandingPage portfolio />} />
        <Route path="/portfolio" element={<SalesLandingPage portfolio />} />
        <Route path="/trilha" element={<PortfolioTrilha />} />
        <Route path="/startup" element={<PortfolioStartup />} />
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
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="contratos" element={<Contratos />} />
          <Route path="formularios" element={<Formularios />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="container">
              <h1>Página não encontrada</h1>
              <p>
                Confira o endereço ou <a href="/">volte ao início</a>.
              </p>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
