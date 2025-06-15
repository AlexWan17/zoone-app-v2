
import React, { useState } from "react";
import CameraCapture from "@/components/VirtualTryOn/CameraCapture";
import ImagePreview from "@/components/VirtualTryOn/ImagePreview";
import { removeBackground } from "@/utils/virtualTryOn/removeBackground";
import { Button } from "@/components/ui/button";

const VirtualTryOnDemo: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCapture = async (file: File) => {
    setOriginalUrl(URL.createObjectURL(file));
    setProcessedUrl(null);
    setProcessing(true);
    try {
      const bgRemovedUrl = await removeBackground(file);
      setProcessedUrl(bgRemovedUrl);
    } catch (err: any) {
      alert("Erro ao remover fundo: " + err.message);
    }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2">Demo: Provador Virtual com IA</h1>
      <div className="max-w-xl">
        <CameraCapture onCapture={handleCapture} />
      </div>
      <ImagePreview original={originalUrl} processed={processedUrl} loading={processing} />
      <div className="mt-8 text-sm text-gray-500 text-center max-w-xl">
        Esta é uma demonstração inicial do pipeline de remoção de fundo (IA Huggingface). Pronto para avançar para sobreposição de roupas!
      </div>
    </div>
  );
};

export default VirtualTryOnDemo;
