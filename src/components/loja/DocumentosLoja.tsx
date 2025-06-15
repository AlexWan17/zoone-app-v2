
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, Trash2, FileCheck } from 'lucide-react';

interface Documento {
  id: string;
  nome: string;
  tipo: string;
  dataUpload: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  url?: string;
}

interface DocumentosLojaProps {
  onSalvar: (data: any) => Promise<void>;
  isLoading: boolean;
}

const DocumentosLoja = ({ onSalvar, isLoading }: DocumentosLojaProps) => {
  const { toast } = useToast();
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: '1',
      nome: 'Contrato Social.pdf',
      tipo: 'contrato_social',
      dataUpload: '2025-05-15',
      status: 'aprovado',
      url: '#'
    },
    {
      id: '2',
      nome: 'Comprovante de Endereço.pdf',
      tipo: 'comprovante_endereco',
      dataUpload: '2025-05-15',
      status: 'pendente',
      url: '#'
    }
  ]);

  const handleUpload = (tipo: string, tipoNome: string) => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll simulate adding a document
    const newDoc: Documento = {
      id: Date.now().toString(),
      nome: `Novo ${tipoNome}.pdf`,
      tipo,
      dataUpload: new Date().toISOString().split('T')[0],
      status: 'pendente',
      url: '#'
    };
    
    setDocumentos([...documentos, newDoc]);
    
    toast({
      title: "Documento enviado",
      description: `${tipoNome} enviado com sucesso.`,
    });
  };

  const handleDelete = (id: string) => {
    setDocumentos(documentos.filter(doc => doc.id !== id));
    
    toast({
      title: "Documento removido",
      description: "Documento removido com sucesso.",
    });
  };

  const documentosTipos = [
    { id: 'contrato_social', nome: 'Contrato Social' },
    { id: 'comprovante_endereco', nome: 'Comprovante de Endereço' },
    { id: 'cartao_cnpj', nome: 'Cartão CNPJ' },
    { id: 'identidade_proprietario', nome: 'Identidade do Proprietário' },
    { id: 'alvara_funcionamento', nome: 'Alvará de Funcionamento' },
    { id: 'inscricao_estadual', nome: 'Inscrição Estadual' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentosTipos.map(tipo => {
          const docExistente = documentos.find(doc => doc.tipo === tipo.id);
          
          return (
            <Card key={tipo.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-medium">{tipo.nome}</h3>
                </div>
                
                {docExistente ? (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <File className="h-4 w-4 text-gray-500" />
                        <span className="text-sm truncate max-w-[180px]">{docExistente.nome}</span>
                      </div>
                      <div className="flex items-center">
                        {docExistente.status === 'aprovado' && (
                          <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            <FileCheck className="h-3 w-3 mr-1" />
                            Aprovado
                          </span>
                        )}
                        {docExistente.status === 'pendente' && (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                            Pendente
                          </span>
                        )}
                        {docExistente.status === 'rejeitado' && (
                          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                            Rejeitado
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Enviado em {docExistente.dataUpload}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={docExistente.url} target="_blank" rel="noopener noreferrer">
                          Visualizar
                        </a>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="px-2 flex-shrink-0"
                        onClick={() => handleDelete(docExistente.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center min-h-[120px]">
                    <p className="text-sm text-gray-500 mb-3 text-center">
                      Nenhum documento enviado
                    </p>
                    <Button variant="outline" size="sm" onClick={() => handleUpload(tipo.id, tipo.nome)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Arquivo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <h3 className="font-medium text-yellow-800 mb-2">Observações Importantes:</h3>
        <ul className="list-disc pl-5 text-yellow-700 space-y-1">
          <li>Os documentos devem estar legíveis e em formato PDF</li>
          <li>O tamanho máximo por arquivo é de 5MB</li>
          <li>A verificação dos documentos pode levar até 3 dias úteis</li>
          <li>Documentos rejeitados deverão ser enviados novamente com as correções necessárias</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentosLoja;
