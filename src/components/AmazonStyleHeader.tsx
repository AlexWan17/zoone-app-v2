import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextProvider';
import { useCart } from '@/context/CartContext';
import { useTemporaryCart } from '@/hooks/useTemporaryCart';
import VoiceSearch from './VoiceSearch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search,
  Heart,
  LogOut,
  UserPlus,
  MapPin,
  Package,
  Star,
  CreditCard,
  Settings,
  HelpCircle,
  MapIcon,
  Clock
} from 'lucide-react';

const AmazonStyleHeader = () => {
  const { user, logout } = useAuth();
  const { getItemsCount: getAuthItemsCount } = useCart();
  const { getItemsCount: getTempItemsCount } = useTemporaryCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('São Paulo, SP');
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, right: number} | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const totalItems = user ? getAuthItemsCount() : getTempItemsCount();

  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
    } else {
      navigate('/carrinho-temporario');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleVoiceSearch = (transcript: string) => {
    setSearchTerm(transcript);
    navigate(`/busca?q=${encodeURIComponent(transcript)}`);
  };

  const handleLocationUpdate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation('Localização atualizada');
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        }
      );
    }
  };

  useEffect(() => {
    // Fecha menu se clicar fora dele
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      const menu = document.getElementById('account-dropdown-menu');
      if (
        menu &&
        !menu.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  // Calcula posição do dropdown
  useEffect(() => {
    if (userMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [userMenuOpen]);

  return (
    <>
      {/* Header Principal */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white sticky top-0 z-[11000] relative shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[60px]">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 min-w-[100px]">
              <img 
                src="/lovable-uploads/864bdb4f-15fa-495b-84a7-46cd73723d35.png" 
                alt="Zoone.AI" 
                className="h-8 w-auto"
              />
            </Link>

            {/* Localização */}
            <div className="hidden md:flex flex-col items-start min-w-[120px] mx-2">
              <button 
                onClick={handleLocationUpdate}
                className="text-xs text-blue-100 hover:text-white flex items-center transition-colors"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Entregar em
              </button>
              <span className="text-sm font-medium truncate max-w-[120px]">
                {location}
              </span>
            </div>

            {/* Barra de Busca Central */}
            <form onSubmit={handleSearch} className="flex-1 max-w-[600px] mx-4">
              <div className="flex">
                <select className="bg-white text-gray-900 px-3 py-2 rounded-l-md border-none text-sm focus:outline-none">
                  <option>Todas</option>
                  <option>Eletrônicos</option>
                  <option>Casa</option>
                  <option>Moda</option>
                  <option>Beleza</option>
                </select>
                <div className="relative flex-1 flex items-center">
                  <Input
                    type="text"
                    placeholder="Buscar produtos, lojas..."
                    className="w-full px-4 py-2 border-none rounded-none text-gray-900 focus:outline-none pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {/* Ícone do microfone imediatamente ao lado do botão de buscar */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <VoiceSearch onTranscript={handleVoiceSearch} />
                  </div>
                </div>
                <Button 
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 px-4 py-2 rounded-r-md text-gray-900 transition-colors flex items-center"
                  aria-label="Buscar"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Área do Usuário */}
            <div className="flex items-center space-x-4 min-w-[200px] justify-end">
              
              {/* Menu do Usuário */}
              {user ? (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
                    className="flex flex-col items-start hover:bg-white/10 p-2 rounded transition-colors"
                  >
                    <span className="text-xs text-blue-100">Olá, {user.email.split('@')[0]}</span>
                    <span className="text-sm font-medium flex items-center">
                      Conta e Listas
                      <User className="w-3 h-3 ml-1" />
                    </span>
                  </button>

                  {/* Overlay escurecido */}
                  {userMenuOpen && (
                    <div
                      role="presentation"
                      className="fixed inset-0 bg-black/30 z-[10999]"
                      onClick={() => setUserMenuOpen(false)}
                    />
                  )}

                  {/* Dropdown do Usuário */}
                  {userMenuOpen && dropdownPosition && (
                    <div
                      id="account-dropdown-menu"
                      className="fixed rounded-lg shadow-xl py-2 z-[12000] bg-white"
                      style={{
                        top: dropdownPosition.top,
                        right: dropdownPosition.right,
                        width: 260,
                        minWidth: 224,
                      }}
                    >
                      <div className="px-4 py-2 border-b bg-gradient-to-r from-primary/5 to-primary-dark/5">
                        <p className="text-sm font-medium text-gray-900">Minha Conta</p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                      
                      {/* Seção Principal */}
                      <div className="py-1">
                        <Link 
                          to="/perfil"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3 text-primary" />
                          Minha Conta
                        </Link>
                        <Link 
                          to="/pedidos"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4 mr-3 text-primary" />
                          Devoluções e Pedidos
                        </Link>
                      </div>

                      <hr className="my-1" />

                      {/* Seção Listas */}
                      <div className="py-1">
                        <Link 
                          to="/favoritos"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Heart className="w-4 h-4 mr-3 text-accent" />
                          Favoritos
                        </Link>
                        <Link 
                          to="/produtos-reservados"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Clock className="w-4 h-4 mr-3 text-primary" />
                          Produtos Reservados
                        </Link>
                        <Link 
                          to="/lista-desejos"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Star className="w-4 h-4 mr-3 text-secondary" />
                          Lista de Desejos
                        </Link>
                      </div>

                      <hr className="my-1" />

                      {/* Seção Configurações */}
                      <div className="py-1">
                        <Link 
                          to="/enderecos"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <MapIcon className="w-4 h-4 mr-3 text-primary" />
                          Endereços
                        </Link>
                        <Link 
                          to="/metodos-pagamento"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <CreditCard className="w-4 h-4 mr-3 text-primary" />
                          Métodos de Pagamento
                        </Link>
                        <Link 
                          to="/configuracoes"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3 text-primary" />
                          Configurações
                        </Link>
                      </div>

                      <hr className="my-1" />

                      {/* Seção Ajuda */}
                      <div className="py-1">
                        <Link 
                          to="/ajuda"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <HelpCircle className="w-4 h-4 mr-3 text-primary" />
                          Central de Ajuda
                        </Link>
                        <button 
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary/5"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <span className="text-xs text-blue-100">Olá, faça seu</span>
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-sm hover:underline transition-all">
                      Login
                    </Link>
                    <span className="text-xs">ou</span>
                    <Link to="/registrar" className="text-sm hover:underline transition-all">
                      Cadastre-se
                    </Link>
                  </div>
                </div>
              )}

              {/* Carrinho */}
              <button 
                onClick={handleCartClick}
                className="relative flex items-center hover:bg-white/10 p-2 rounded transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-secondary text-gray-900 text-xs min-w-[18px] h-4">
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
                <span className="ml-1 text-sm font-medium hidden md:block">Carrinho</span>
              </button>

              {/* Menu Mobile */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navegação Secundária */}
        <div className="bg-primary-dark/20 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 h-10 text-sm">
              <Link to="/busca" className="hover:text-secondary flex items-center transition-colors">
                <Menu className="w-4 h-4 mr-1" />
                Todos
              </Link>
              <Link to="/busca?categoria=eletronicos" className="hover:text-secondary transition-colors">
                Eletrônicos
              </Link>
              <Link to="/busca?categoria=casa" className="hover:text-secondary transition-colors">
                Casa e Jardim
              </Link>
              <Link to="/busca?categoria=moda" className="hover:text-secondary transition-colors">
                Moda
              </Link>
              <Link to="/busca?categoria=beleza" className="hover:text-secondary transition-colors">
                Beleza
              </Link>
              <Link to="/ofertas" className="hover:text-secondary text-secondary transition-colors">
                Ofertas do Dia
              </Link>
              <Link to="/virtual-try-on" className="hover:text-secondary transition-colors">
                Provador Virtual
              </Link>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-dark/20 border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              {/* Localização Mobile */}
              <button 
                onClick={handleLocationUpdate}
                className="flex items-center text-sm text-blue-100 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {location}
              </button>
              
              {/* Links Mobile */}
              <Link to="/busca" className="block py-2 hover:text-secondary transition-colors">
                Buscar Produtos
              </Link>
              <Link to="/ofertas" className="block py-2 hover:text-secondary transition-colors">
                Ofertas do Dia
              </Link>
              <Link to="/virtual-try-on" className="block py-2 hover:text-secondary transition-colors">
                Provador Virtual
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default AmazonStyleHeader;
