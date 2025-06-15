
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface CameraCaptureProps {
  onCapture: (image: File) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onCapture(file);
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Selecionar Foto...
      </Button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {preview && (
        <img
          src={preview}
          alt="Pré-visualização"
          className="rounded-md mt-2 max-h-52 border"
        />
      )}
    </div>
  );
};

export default CameraCapture;
