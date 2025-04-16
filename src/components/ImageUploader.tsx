
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
  onImageUploaded?: (imageUrl: string) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images = [], 
  onImagesChange,
  onImageUploaded,
  maxImages = 5 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (onImagesChange && images.length + files.length > maxImages) {
      setError(`حداکثر ${maxImages} تصویر می‌توانید آپلود کنید`);
      return;
    }

    setError(null);
    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError('فقط فایل‌های تصویری مجاز هستند');
        continue;
      }
      
      // Upload to Django backend
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await uploadImage(formData);
        if (response && response.url) {
          if (onImageUploaded) {
            onImageUploaded(response.url);
          }
          if (onImagesChange) {
            onImagesChange([...images, response.url]);
          }
        } else {
          toast({
            title: "خطا",
            description: "آپلود تصویر با مشکل مواجه شد",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        toast({
          title: "خطا",
          description: "آپلود تصویر با مشکل مواجه شد",
          variant: "destructive",
        });
      }
    }
    
    setIsUploading(false);

    // Reset the file input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    if (onImagesChange) {
      const newImages = [...images];
      newImages.splice(index, 1);
      onImagesChange(newImages);
    }
    setError(null);
  };

  return (
    <div className="space-y-3">
      {onImagesChange && (
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
      )}

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
          disabled={isUploading || (onImagesChange && images.length >= maxImages)}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <span>در حال آپلود...</span>
          ) : onImageUploaded ? (
            <>
              <ImageIcon size={16} />
              آپلود تصویر
            </>
          ) : (
            <>
              <Upload size={16} />
              آپلود تصاویر
            </>
          )}
        </Button>
        {onImagesChange && (
          <span className="text-xs text-gray-500 mr-2">
            {images.length} از {maxImages} تصویر
          </span>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;
