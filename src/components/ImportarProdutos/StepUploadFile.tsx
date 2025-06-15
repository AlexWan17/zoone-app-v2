
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { parseFile, ParseResult } from "./importUtils";
import { toast } from "@/hooks/use-toast";

interface Props {
  onNext: () => void;
  onBack: () => void;
  file: File | null;
  setFile: (file: File | null) => void;
  setParsedData: (data: any[]) => void;
  setParseErrors: (errors: ParseResult["errors"]) => void;
}
const StepUploadFile: React.FC<Props> = ({ onNext, onBack, file, setFile, setParsedData, setParseErrors }) => {
  const [parsing, setParsing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setParsing(true);
      try {
        const parsed = await parseFile(acceptedFiles[0]);
        setParsedData(parsed.data);
        setParseErrors(parsed.errors);
        if (parsed.errors.length === 0) {
          toast({ title: "Arquivo válido. Pronto para pré-visualizar!" });
          onNext();
        } else {
          toast({
            title: "Validação encontrou erros.",
            description: "Corrija ou revise antes de importar."
          });
          // Stay in preview
        }
      } catch (err) {
        toast({
          title: "Erro ao ler arquivo",
          description: (err as Error).message
        });
      }
      setParsing(false);
    }
  }, [setFile, setParsedData, setParseErrors, onNext]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "text/csv": [".csv"], "application/vnd.ms-excel": [".xls", ".xlsx"] }
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        {...getRootProps()}
        className={`w-full p-10 border-2 border-dashed rounded-md text-center transition cursor-pointer ${
          isDragActive ? "border-primary bg-gray-50" : "border-gray-300 bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        <div>
          {file ? (
            <p className="text-green-700 font-bold">
              {file.name} selecionado.
            </p>
          ) : (
            <p>
              Arraste seu arquivo CSV/XLS aqui, <br />
              ou clique para escolher.
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>Voltar</Button>
        {file && (
          <Button disabled={parsing} onClick={() => onDrop([file])} className="ml-4 flex items-center gap-2">
            {parsing && (
              <span className="animate-spin inline-block w-4 h-4 border-t-2 border-b-2 border-primary rounded-full"></span>
            )}
            {parsing ? "Validando..." : "Avançar / Pré-visualizar"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepUploadFile;
