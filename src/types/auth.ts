
import { User } from '@/types';

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  supbaseConnected: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, role: 'lojista' | 'consumidor') => Promise<void>;
};
