
export interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  municipio?: string;
  uf?: string;
  situacao?: string;
  atividade_principal?: Array<{
    code: string;
    text: string;
  }>;
  telefone?: string;
  email?: string;
  data_abertura?: string;
  capital_social?: number;
}

interface APIResponse {
  status: string;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  municipio?: string;
  uf?: string;
  situacao?: string;
  atividade_principal?: Array<{
    code: string;
    text: string;
  }>;
  telefone?: string;
  email?: string;
  data_abertura?: string;
  capital_social?: number;
}

export const cnpjService = {
  // Remove formatação do CNPJ (pontos, barras, hífens)
  cleanCNPJ(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, '');
  },

  // Formata CNPJ para exibição
  formatCNPJ(cnpj: string): string {
    const cleaned = this.cleanCNPJ(cnpj);
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  },

  // Valida se CNPJ está no formato correto
  isValidCNPJFormat(cnpj: string): boolean {
    const cleaned = this.cleanCNPJ(cnpj);
    return cleaned.length === 14 && /^\d{14}$/.test(cleaned);
  },

  // Valida dígitos verificadores do CNPJ
  isValidCNPJ(cnpj: string): boolean {
    const cleaned = this.cleanCNPJ(cnpj);
    
    if (!this.isValidCNPJFormat(cleaned)) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleaned)) return false;
    
    let length = cleaned.length - 2;
    let numbers = cleaned.substring(0, length);
    const digits = cleaned.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers = cleaned.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return result === parseInt(digits.charAt(1));
  },

  // Busca dados do CNPJ via API externa
  async fetchCNPJData(cnpj: string): Promise<CNPJData | null> {
    const cleanedCNPJ = this.cleanCNPJ(cnpj);
    
    if (!this.isValidCNPJ(cleanedCNPJ)) {
      throw new Error('CNPJ inválido');
    }

    try {
      // Usando brasilapi - mais confiável
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`);
      
      if (!response.ok) {
        throw new Error('CNPJ não encontrado');
      }
      
      const data = await response.json();
      
      if (!data || !data.cnpj) {
        throw new Error('CNPJ não encontrado');
      }

      // Mapeia a resposta da API para nossa interface
      const mappedData: CNPJData = {
        cnpj: cleanedCNPJ,
        razao_social: data.razao_social || data.nome || '',
        nome_fantasia: data.nome_fantasia,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cep: data.cep,
        municipio: data.municipio,
        uf: data.uf,
        situacao: data.situacao_cadastral,
        atividade_principal: data.cnae_fiscal_principal ? [{
          code: data.cnae_fiscal_principal.codigo,
          text: data.cnae_fiscal_principal.descricao
        }] : undefined,
        telefone: data.ddd_telefone_1,
        email: data.email,
        data_abertura: data.data_inicio_atividade,
        capital_social: data.capital_social
      };

      return mappedData;
    } catch (error) {
      console.error('Erro ao buscar dados do CNPJ:', error);
      throw error;
    }
  },

  // Formata endereço completo
  formatAddress(data: CNPJData): string {
    const parts = [
      data.logradouro,
      data.numero,
      data.complemento,
      data.bairro,
      data.municipio,
      data.uf,
      data.cep
    ].filter(Boolean);
    
    return parts.join(', ');
  }
};
