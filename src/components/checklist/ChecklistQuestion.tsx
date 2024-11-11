import React from 'react';
import { ConformityLevel, conformityLevels } from '../../types/checklist';
import ImageUpload from './ImageUpload';

interface ChecklistQuestionProps {
  number: number;
  question: string;
  value: string;
  onChange: (value: string) => void;
  onChangeObservation: (value: string) => void;
  observation: string;
  image?: string;
  onImageChange?: (imageUrl: string | null) => void;
}

export default function ChecklistQuestion({
  number,
  question,
  value,
  onChange,
  onChangeObservation,
  observation,
  image,
  onImageChange
}: ChecklistQuestionProps) {
  const selectedLevel = conformityLevels.find(level => level.value === value);

  const handleImageUploaded = (url: string) => {
    if (onImageChange) {
      onImageChange(url);
    }
  };

  const handleRemoveImage = () => {
    if (onImageChange) {
      onImageChange(null);
    }
  };

  return (
    <div className={`p-3 sm:p-6 rounded-lg mb-4 ${selectedLevel?.color || 'bg-white'}`}>
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start gap-2 sm:gap-4">
          <span className="font-medium text-sm sm:text-base">{number}.</span>
          <p className="flex-1 text-sm sm:text-base">{question}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="">Selecione uma nota</option>
              {conformityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              value={observation}
              onChange={(e) => onChangeObservation(e.target.value)}
              placeholder="Observações (Descreva aqui as não conformidades encontradas)"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
              rows={3}
            />
          </div>
        </div>

        <div className="mt-2">
          <ImageUpload
            questionId={`question-${number}`}
            onImageUploaded={handleImageUploaded}
            currentImage={image}
            onRemoveImage={handleRemoveImage}
          />
        </div>
      </div>
    </div>
  );
}