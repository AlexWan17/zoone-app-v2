
import React from "react";

interface Props {
  original: string | null;
  processed: string | null;
  loading: boolean;
}

const ImagePreview: React.FC<Props> = ({ original, processed, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-8">
      <div className="text-center">
        <h3 className="mb-2 font-medium">Original</h3>
        {original && <img src={original} alt="Original" className="mx-auto rounded-md max-h-72 border" />}
      </div>
      <div className="text-center">
        <h3 className="mb-2 font-medium">Fundo Removido (IA Huggingface)</h3>
        {loading ? (
          <span className="text-sm text-gray-500">Processando...</span>
        ) : processed ? (
          <img src={processed} alt="Sem fundo" className="mx-auto rounded-md max-h-72 border" />
        ) : (
          <span className="text-gray-400 text-sm">Nenhuma imagem</span>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
