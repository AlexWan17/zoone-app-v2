
import { RegraFrete, Filial } from '@/types';

// Função para calcular distância entre dois pontos (Haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    0.5 - Math.cos(dLat)/2 + 
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

// Função para obter coordenadas a partir de um endereço (simulado)
export const getCoordinatesFromAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
  // Em produção, aqui você usaria a API do Google Maps Geocoding
  // Por enquanto, vou simular algumas coordenadas para São Paulo
  
  const addressLower = address.toLowerCase();
  
  // Simulação de coordenadas para diferentes regiões de São Paulo
  if (addressLower.includes('centro') || addressLower.includes('sé')) {
    return { lat: -23.5505, lng: -46.6333 };
  } else if (addressLower.includes('vila madalena') || addressLower.includes('pinheiros')) {
    return { lat: -23.5440, lng: -46.6920 };
  } else if (addressLower.includes('moema') || addressLower.includes('ibirapuera')) {
    return { lat: -23.5928, lng: -46.6617 };
  } else if (addressLower.includes('santana') || addressLower.includes('tucuruvi')) {
    return { lat: -23.5038, lng: -46.6297 };
  } else if (addressLower.includes('itaquera') || addressLower.includes('cidade tiradentes')) {
    return { lat: -23.5394, lng: -46.4556 };
  } else {
    // Coordenadas padrão para São Paulo - Centro
    return { lat: -23.5505, lng: -46.6333 };
  }
};

// Interface para resultado do cálculo de frete
export interface FreteCalculation {
  valor: number;
  distancia: number;
  regra_aplicada: RegraFrete;
  tempo_estimado: string;
  gratis: boolean;
}

// Função principal para calcular frete
export const calculateFrete = async (
  filial: Filial,
  enderecoEntrega: string,
  valorPedido: number,
  regras: RegraFrete[]
): Promise<FreteCalculation | null> => {
  try {
    // Obter coordenadas do endereço de entrega
    const coordenadasEntrega = await getCoordinatesFromAddress(enderecoEntrega);
    
    if (!coordenadasEntrega) {
      console.error('Não foi possível obter coordenadas do endereço');
      return null;
    }
    
    // Calcular distância entre filial e endereço
    const distancia = calculateDistance(
      filial.latitude,
      filial.longitude,
      coordenadasEntrega.lat,
      coordenadasEntrega.lng
    );
    
    // Filtrar regras aplicáveis para esta filial
    const regrasFilial = regras.filter(regra => regra.filial_id === filial.id);
    
    if (regrasFilial.length === 0) {
      // Regra padrão caso não haja regras configuradas
      return {
        valor: 15.00, // Frete padrão
        distancia,
        regra_aplicada: {
          id: 'default',
          filial_id: filial.id,
          tipo: 'fixo',
          valor: 15.00,
          area_geografica: 'Padrão'
        },
        tempo_estimado: calculateDeliveryTime(distancia),
        gratis: false
      };
    }
    
    // Encontrar a melhor regra aplicável
    let melhorRegra: RegraFrete | null = null;
    let valorFrete = 0;
    let gratis = false;
    
    for (const regra of regrasFilial) {
      // Verificar se a regra se aplica à área geográfica (simplificado)
      const areaAplicavel = verificarAreaGeografica(regra.area_geografica, distancia);
      
      if (!areaAplicavel) continue;
      
      if (regra.tipo === 'fixo') {
        if (!melhorRegra || regra.valor < valorFrete) {
          melhorRegra = regra;
          valorFrete = regra.valor;
          gratis = false;
        }
      } else if (regra.tipo === 'gratis_acima') {
        if (valorPedido >= (regra.valor_minimo_pedido || 0)) {
          melhorRegra = regra;
          valorFrete = 0;
          gratis = true;
          break; // Frete grátis é sempre a melhor opção
        }
      }
    }
    
    // Se não encontrou regra aplicável, usar a primeira disponível
    if (!melhorRegra) {
      melhorRegra = regrasFilial[0];
      valorFrete = melhorRegra.valor;
    }
    
    return {
      valor: valorFrete,
      distancia,
      regra_aplicada: melhorRegra,
      tempo_estimado: calculateDeliveryTime(distancia),
      gratis
    };
    
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    return null;
  }
};

// Função para verificar se a área geográfica se aplica
const verificarAreaGeografica = (areaGeografica: string, distancia: number): boolean => {
  // Lógica simplificada - em produção seria mais sofisticada
  const area = areaGeografica.toLowerCase();
  
  if (area.includes('centro') && distancia <= 5) return true;
  if (area.includes('geral') && distancia <= 15) return true;
  if (area.includes('região metropolitana') && distancia <= 30) return true;
  
  // Para áreas não especificadas, aplicar até 20km
  return distancia <= 20;
};

// Função para calcular tempo estimado de entrega
const calculateDeliveryTime = (distancia: number): string => {
  if (distancia <= 5) return '1-2 dias úteis';
  if (distancia <= 15) return '2-3 dias úteis';
  if (distancia <= 30) return '3-5 dias úteis';
  return '5-7 dias úteis';
};

// Função para calcular frete para múltiplas filiais
export const calculateFreteMultiplasFiliais = async (
  filiaisComItens: Array<{filial: Filial, valor: number}>,
  enderecoEntrega: string,
  todasRegras: RegraFrete[]
): Promise<Array<FreteCalculation & {filial_id: string}>> => {
  const resultados = [];
  
  for (const {filial, valor} of filiaisComItens) {
    const calculo = await calculateFrete(filial, enderecoEntrega, valor, todasRegras);
    if (calculo) {
      resultados.push({
        ...calculo,
        filial_id: filial.id
      });
    }
  }
  
  return resultados;
};
