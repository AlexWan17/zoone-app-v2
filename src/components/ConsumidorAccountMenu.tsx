
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Package,
  ClipboardList,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContextProvider";
import classNames from "clsx";

const menuItems = [
  {
    key: "perfil",
    label: "Meu Perfil",
    icon: User,
    to: "/perfil"
  },
  {
    key: "pedidos",
    label: "Pedidos",
    icon: Package,
    to: "/pedidos"
  },
  {
    key: "produtos-reservados",
    label: "Produtos Reservados",
    icon: ClipboardList,
    to: "/produtos-reservados"
  },
  {
    key: "lista-desejos",
    label: "Lista de Desejos",
    icon: Heart,
    to: "/lista-desejos"
  },
  {
    key: "enderecos",
    label: "Endereços",
    icon: MapPin,
    to: "/enderecos"
  },
  {
    key: "metodos-pagamento",
    label: "Métodos de Pagamento",
    icon: CreditCard,
    to: "/metodos-pagamento"
  },
  {
    key: "configuracoes",
    label: "Configurações da Conta",
    icon: Settings,
    to: "/configuracoes"
  },
  {
    key: "ajuda",
    label: "Central de Ajuda",
    icon: HelpCircle,
    to: "/ajuda"
  }
];

export default function ConsumidorAccountMenu() {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="w-full md:w-64 flex md:flex-col rounded-xl md:rounded-l-xl bg-white/90 border md:border-r md:border-b-0 border-gray-200 shadow-sm p-2 md:py-6 md:px-4 mb-4 md:mb-0">
      <ul className="flex flex-row md:flex-col gap-2 w-full">
        {menuItems.map(({ key, label, icon: Icon, to }) => (
          <li key={key}>
            <Link
              to={to}
              className={classNames(
                "group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm",
                location.pathname === to
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          </li>
        ))}

        <li className="mt-auto w-full">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </li>
      </ul>
    </nav>
  );
}
