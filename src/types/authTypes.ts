
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  supbaseConnected: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: 'lojista' | 'consumidor') => Promise<void>;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'lojista' | 'consumidor';
}
