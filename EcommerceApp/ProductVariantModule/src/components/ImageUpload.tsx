import { useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "../lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        processFile(file);
      }
    },
    [disabled, onChange]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const triggerUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div
      onClick={triggerUpload}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "relative w-full h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/50 hover:border-primary/50",
        value ? "border-solid border-border" : "border-muted-foreground/25"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        <>
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X className="h-3 w-3" />
          </button>
        </>
      ) : (
        <div className="text-center text-muted-foreground text-xs flex flex-col items-center gap-1 p-2">
          <Upload className="h-4 w-4" />
          <span className="font-medium">Tải ảnh</span>
        </div>
      )}
    </div>
  );
}
