
import React from "react";
import { Button } from "@/components/ui/button";
import { downloadTemplateCSV } from "@/components/ImportarProdutos/templateUtils";

interface Props {
  onNext: () => void;
}
const StepDownloadTemplate: React.FC<Props> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <p>
        Baixe o modelo de planilha para importar produtos. <br />
        Abra no Excel, Google Sheets ou equivalente, preencha os dados e salve como CSV.
      </p>
      <Button onClick={downloadTemplateCSV}>
        Baixar Modelo CSV
      </Button>
      <Button variant="outline" onClick={onNext}>Já tenho meu arquivo</Button>
      <div className="text-xs mt-4 text-gray-400 text-center">
        Dica: Não modifique os cabeçalhos do arquivo, nem exclua colunas.
      </div>
    </div>
  );
};
export default StepDownloadTemplate;
