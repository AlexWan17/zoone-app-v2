import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContextProvider';
import { useCart } from '@/context/CartContext';
import { useTemporaryCart } from '@/hooks/useTemporaryCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search,
  Heart,
  LogOut,
  UserPlus
} from 'lucide-react';

const HeaderImproved = () => {
  const { user, logout } = useAuth();
  const { getItemsCount: getAuthItemsCount } = useCart();
  const { getItemsCount: getTempItemsCount } = useTemporaryCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = user ? getAuthItemsCount() : getTempItemsCount();

  const handleCartClick = () => {
    // Always open correct cart depending on auth status!
    if (user) {
      navigate('/carrinho');   // Authenticated = always /carrinho
    } else {
      navigate('/carrinho-temporario'); // Not authed = always /carrinho-temporario
    }
  };

  const handleProfileClick = () => {
    if (user?.role === 'lojista') {
      navigate('/lojista/dashboard');
    } else {
      navigate('/perfil'); // update to /perfil (was /consumidor/perfil, but /perfil is the defined route)
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/lovable-uploads/864bdb4f-15fa-495b-84a7-46cd73723d35.png" 
              alt="Zoone.AI" 
              className="h-6 w-auto transition-transform group-hover:scale-105"
            />
            <span className="text-lg font-bold text-white font-montserrat hidden sm:block">
              Zoone.AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/busca" 
              className="text-white/80 hover:text-white transition-colors flex items-center space-x-1 text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </Link>
            
            {user && (
              <Link 
                to="/favoritos" 
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-1 text-sm"
              >
                <Heart className="w-4 h-4" />
                <span>Favoritos</span>
              </Link>
            )}
            {user && (
              <Link 
                to="/notificacoes" 
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-1 text-sm"
              >
                <span className="w-4 h-4 inline-block"><svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Notificações</span>
              </Link>
            )}
            {user && (
              <Link 
                to="/historico-buscas" 
                className="text-white/80 hover:text-white transition-colors flex items-center space-x-1 text-sm"
              >
                <span className="w-4 h-4 inline-block"><svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Histórico</span>
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className="relative text-white hover:text-secondary transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-accent text-white text-xs min-w-[18px] h-4 flex items-center justify-center rounded-full">
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center space-x-1.5 text-white hover:text-secondary transition-colors p-1.5 rounded-lg hover:bg-white/10"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {user.email.substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm">
                    {user.email.split('@')[0]}
                  </span>
                </button>
                
                {/* Dropdown */}
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] bg-white"
                  style={{ backgroundColor: '#fff' }} // Garantia extra de bg opaco mesmo que classe falhe
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    <p className="text-xs text-primary font-semibold">
                      {user.role === 'lojista' ? 'Lojista' : 'Consumidor'}
                    </p>
                  </div>
                  <button 
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Minha Conta</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8 px-3 text-sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/registrar">
                  <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-gray-100 h-8 px-3 text-sm">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1.5 rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-3 space-y-1">
            <Link 
              to="/busca" 
              className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg flex items-center space-x-2 text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="w-4 h-4" />
              <span>Buscar Produtos</span>
            </Link>
            
            {user && (
              <Link 
                to="/favoritos" 
                className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg flex items-center space-x-2 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-4 h-4" />
                <span>Favoritos</span>
              </Link>
            )}
            
            {!user && (
              <div className="px-4 pt-2 space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10 justify-start h-8 text-sm">
                    Fazer Login
                  </Button>
                </Link>
                <Link to="/registrar" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100 h-8 text-sm">
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderImproved;
