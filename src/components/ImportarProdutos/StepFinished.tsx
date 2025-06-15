
import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onBack: () => void;
  importResult: any;
}
const StepFinished: React.FC<Props> = ({ onBack, importResult }) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-green-50 rounded-md p-4 w-full text-center">
        {importResult?.success &&
          <p className="text-green-700 font-bold">Importação realizada com sucesso! {importResult.count} produtos importados.</p>
        }
        {importResult?.errors?.length > 0 && (
          <div>
            <p className="text-red-600 font-bold mb-2">Alguns erros ocorreram:</p>
            <ul className="text-left text-sm text-red-700 max-h-32 overflow-y-scroll">
              {importResult.errors.map((err: any, i: number) => (
                <li key={i}>
                  Linha {err.row}: {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!importResult && <p>Resumo da importação será apresentado aqui.</p>}
      </div>
      <Button onClick={onBack}>Importar Novamente</Button>
    </div>
  );
};
export default StepFinished;
