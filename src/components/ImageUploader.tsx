
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`حداکثر ${maxImages} تصویر می‌توانید آپلود کنید`);
      return;
    }

    setError(null);
    
    const newImages: string[] = [...images];
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('فقط فایل‌های تصویری مجاز هستند');
        return;
      }
      
      // In a real backend application, we would upload to a server
      // For now, we'll use the browser's FileReader API to create a base64 URL
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          newImages.push(reader.result);
          onImagesChange(newImages);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset the file input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative w-24 h-24 border rounded">
            <img 
              src={image} 
              alt={`تصویر ${index+1}`} 
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={images.length >= maxImages}
        >
          آپلود تصاویر
        </Button>
        <span className="text-xs text-gray-500 mr-2">
          {images.length} از {maxImages} تصویر
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
