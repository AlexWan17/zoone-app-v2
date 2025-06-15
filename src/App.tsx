import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContextProvider";
import { CartProvider } from "@/context/CartContext";

// Pages
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import HomePage from "./pages/Consumidor/HomePage";
import SearchPage from "./pages/Search/SearchPage";
import ProductDetail from "./pages/Product/ProductDetail";
import CartPage from "./pages/Cart/CartPage";
import TemporaryCartPage from "./pages/Cart/TemporaryCartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmation/OrderConfirmationPage";
import PedidosPage from "./pages/Consumidor/PedidosPage";
import PedidoDetailPage from "./pages/Consumidor/PedidoDetailPage";
import PerfilPage from "./pages/Consumidor/PerfilPage";
import VirtualTryOn from "./pages/VirtualTryOn";
import TermosDeUso from "./pages/TermosDeUso";
import NotFound from "./pages/NotFound";
import FavoritosPage from "./pages/Consumidor/FavoritosPage";
import NotificacoesPage from "./pages/Consumidor/NotificacoesPage";
import HistoricoBuscasPage from "./pages/Consumidor/HistoricoBuscasPage";
import ProdutosReservadosPage from "./pages/Consumidor/ProdutosReservadosPage";
import ListaDesejosPage from "./pages/Consumidor/ListaDesejosPage";
import EnderecosPage from "./pages/Consumidor/EnderecosPage";
import MetodosPagamentoPage from "./pages/Consumidor/MetodosPagamentoPage";
import ConfiguracoesConsumidorPage from "./pages/Consumidor/ConfiguracoesPage";
import AjudaPage from "./pages/Consumidor/AjudaPage";

// Lojista Pages
import DashboardPage from "./pages/Lojista/DashboardPage";
import ProductsPage from "./pages/Lojista/ProductsPage";
import ProdutoDetailPage from "./pages/Lojista/ProdutoDetailPage";
import ProdutoDetailPageEnhanced from "./pages/Lojista/ProdutoDetailPageEnhanced";
import CadastroProdutoPage from "./pages/Lojista/CadastroProdutoPage";
import ConfiguracoesLojistaPage from "./pages/Lojista/ConfiguracoesPage";
import LojaPage from "./pages/Lojista/LojaPage";
import FiliaisPage from "./pages/Lojista/FiliaisPage";
import ReceitasPage from "./pages/Lojista/ReceitasPage";
import ReservasPage from "./pages/Lojista/ReservasPage";
import PerfilPageLojista from "./pages/Lojista/PerfilPage";
import PedidosPageLojista from "./pages/Lojista/PedidosPage";
import ImportarProdutosPage from "./pages/Lojista/ImportarProdutosPage";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/termos" element={<TermosDeUso />} />

              {/* Backward compatibility: redirect /cart to /carrinho */}
              <Route path="/cart" element={<Navigate to="/carrinho" replace />} />

              {/* Consumer Routes */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/produto/:id" element={<ProductDetail />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/carrinho-temporario" element={<TemporaryCartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmacao/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/pedidos" element={<PedidosPage />} />
              <Route path="/pedido/:id" element={<PedidoDetailPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/provador-virtual" element={<VirtualTryOn />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
              <Route path="/notificacoes" element={<NotificacoesPage />} />
              <Route path="/historico-buscas" element={<HistoricoBuscasPage />} />
              <Route path="/produtos-reservados" element={<ProdutosReservadosPage />} />
              <Route path="/lista-desejos" element={<ListaDesejosPage />} />
              <Route path="/enderecos" element={<EnderecosPage />} />
              <Route path="/metodos-pagamento" element={<MetodosPagamentoPage />} />
              <Route path="/configuracoes" element={<ConfiguracoesConsumidorPage />} />
              <Route path="/ajuda" element={<AjudaPage />} />

              {/* Lojista Routes */}
              <Route path="/lojista" element={<DashboardPage />} />
              <Route path="/lojista/dashboard" element={<DashboardPage />} />
              <Route path="/lojista/produtos" element={<ProductsPage />} />
              <Route path="/lojista/produto/new" element={<CadastroProdutoPage />} />
              <Route path="/lojista/produto/:id" element={<ProdutoDetailPageEnhanced />} />
              <Route path="/lojista/produto/:id/enhanced" element={<ProdutoDetailPageEnhanced />} />
              <Route path="/lojista/produtos/:id/editar" element={<CadastroProdutoPage />} />
              <Route path="/lojista/configuracoes" element={<ConfiguracoesLojistaPage />} />
              <Route path="/lojista/loja" element={<LojaPage />} />
              <Route path="/lojista/filiais" element={<FiliaisPage />} />
              <Route path="/lojista/receitas" element={<ReceitasPage />} />
              <Route path="/lojista/reservas" element={<ReservasPage />} />
              <Route path="/lojista/perfil" element={<PerfilPageLojista />} />
              <Route path="/lojista/pedidos" element={<PedidosPageLojista />} />
              <Route path="/lojista/importar-produtos" element={<ImportarProdutosPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
