import React from 'react';
import { Camera, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  questionId: string;
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onRemoveImage?: () => void;
}

export default function ImageUpload({ 
  questionId, 
  onImageUploaded, 
  currentImage,
  onRemoveImage 
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${questionId}-${Math.random()}.${fileExt}`;
      const filePath = `checklist-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('checklist-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('checklist-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024);
    
    if (fileSizeInMB > 5) {
      alert('File size must be less than 5MB');
      return;
    }

    await uploadImage(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Camera className="h-4 w-4" />
        <span>{uploading ? 'Enviando...' : 'Adicionar Foto'}</span>
      </button>

      {currentImage && (
        <div className="relative">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="h-16 w-16 object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}