
import React, { useState } from "react";
import StepDownloadTemplate from "./StepDownloadTemplate";
import StepUploadFile from "./StepUploadFile";
import StepPreviewData from "./StepPreviewData";
import StepFinished from "./StepFinished";
import { ParseResult } from "./importUtils";

const steps = [
  "Baixar modelo",
  "Enviar arquivo",
  "Verificar dados",
  "Finalizar",
];

const ImportWizard = () => {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [parseErrors, setParseErrors] = useState<ParseResult["errors"]>([]);
  const [importResult, setImportResult] = useState<any>(null);

  const goNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      {/* Passos visuais */}
      <div className="flex justify-between mb-8">
        {steps.map((label, idx) => (
          <div
            key={idx}
            className={`flex-1 flex flex-col items-center text-center ${
              idx === step
                ? "font-bold text-primary"
                : "text-gray-400"
            }`}
          >
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx <= step ? "border-primary bg-primary text-white" : "border-gray-300 bg-white"}`}>
              {idx + 1}
            </div>
            <span className="mt-1 text-xs">{label}</span>
            {idx < steps.length - 1 && <div className="w-full h-0.5 bg-gray-200 mt-3" />}
          </div>
        ))}
      </div>
      {step === 0 && <StepDownloadTemplate onNext={goNext} />}
      {step === 1 && (
        <StepUploadFile
          onNext={goNext}
          onBack={goBack}
          file={file}
          setFile={setFile}
          setParsedData={setParsedData}
          setParseErrors={setParseErrors}
        />
      )}
      {step === 2 && (
        <StepPreviewData
          onNext={goNext}
          onBack={goBack}
          parsedData={parsedData}
          setParsedData={setParsedData}
          parseErrors={parseErrors}
          setParseErrors={setParseErrors}
        />
      )}
      {step === 3 && <StepFinished onBack={goBack} importResult={importResult} />}
    </div>
  );
};

export default ImportWizard;
