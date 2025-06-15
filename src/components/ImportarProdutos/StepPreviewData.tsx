import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EXPECTED_HEADERS, ParseResult } from "./importUtils";
import { toast } from "@/hooks/use-toast";

interface Props {
  onNext: () => void;
  onBack: () => void;
  parsedData: any[];
  setParsedData: (data: any[]) => void;
  parseErrors: ParseResult["errors"];
  setParseErrors: (errors: ParseResult["errors"]) => void;
}

const StepPreviewData: React.FC<Props> = ({ onNext, onBack, parsedData, setParsedData, parseErrors }) => {
  // Monta map de erros para busca rápida
  const errorMap = useMemo(() => {
    const map = new Map();
    parseErrors.forEach(e => {
      map.set(`${e.row}-${e.column}`, e.message);
    });
    return map;
  }, [parseErrors]);

  const handleProceed = () => {
    if (parseErrors.length > 0) {
      toast({
        title: "Não é possível importar.",
        description: "Há erros na planilha. Corrija antes de prosseguir."
      });
      return;
    }
    if (parsedData.length === 0) {
      toast({ title: "Nenhum dado para importar." });
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="overflow-auto max-h-[340px] rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow>
              {EXPECTED_HEADERS.map(h => (
                <TableHead key={h}>{h.toUpperCase()}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedData.map((row, i) => (
              <TableRow key={i}>
                {EXPECTED_HEADERS.map(h => (
                  <TableCell key={h} className={errorMap.has(`${i+2}-${h}`) ? "bg-red-100 border-red-400 border text-red-800 font-bold" : ""}>
                    {row[h]}
                    {errorMap.has(`${i+2}-${h}`) && (
                      <span title={errorMap.get(`${i+2}-${h}`)} className="text-xs text-red-500 ml-2">*</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableCaption>
          {parseErrors.length > 0 ? (
            <span className="text-red-600">Há {parseErrors.length} erros que precisam de correção antes de importar.<br/>Passe o mouse sobre <span className="text-red-500 font-bold">*</span> para ver detalhes.</span>
          ) : (
            <span className="text-green-700">Nenhum erro encontrado. Pronto para importar!</span>
          )}
        </TableCaption>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        <Button disabled={parseErrors.length > 0} onClick={handleProceed} className="btn btn-primary">Confirmar Importação</Button>
      </div>
    </div>
  );
};

export default StepPreviewData;
