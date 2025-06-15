import { useState } from 'react';
import {
  Home,
  Package,
  ShoppingCart,
  DollarSign,
  MapPin,
  Store,
  Settings,
  Menu,
  X,
  Clock,
  Import as ImportIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface LojistaLayoutProps {
  title: string;
  children: React.ReactNode;
}

const LojistaLayout = ({ title, children }: LojistaLayoutProps) => {
  const { user, logout } = useAuthOptimized();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/lojista/dashboard', icon: Home },
    { name: 'Produtos', href: '/lojista/produtos', icon: Package },
    { name: 'Importar Produtos', href: '/lojista/importar-produtos', icon: ImportIcon },
    { name: 'Pedidos', href: '/lojista/pedidos', icon: ShoppingCart },
    { name: 'Reservas', href: '/lojista/reservas', icon: Clock },
    { name: 'Receitas', href: '/lojista/receitas', icon: DollarSign },
    { name: 'Filiais', href: '/lojista/filiais', icon: MapPin },
    { name: 'Loja', href: '/lojista/loja', icon: Store },
    { name: 'Configurações', href: '/lojista/configuracoes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden absolute top-4 left-4" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Navegação</SheetTitle>
            <SheetDescription>
              Selecione uma opção para navegar.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md ${location.pathname === item.href ? 'bg-gray-200 font-semibold' : ''}`}
                onClick={closeMenu}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => { closeMenu(); handleSignOut(); }}>
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-200 h-screen fixed">
        <div className="p-4">
          <h1 className="text-lg font-semibold">{user?.email}</h1>
          <p className="text-sm text-gray-600">Lojista</p>
        </div>
        <nav className="flex-1 px-2 py-4">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-300 rounded-md ${location.pathname === item.href ? 'bg-gray-300 font-semibold' : ''}`}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-4">
        <header className="bg-white shadow-sm rounded-lg p-4 mb-4">
          <h1 className="text-2xl font-semibold">{title}</h1>
        </header>
        <main className="bg-white shadow-sm rounded-lg p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LojistaLayout;
