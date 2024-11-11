import React from 'react';
import ChecklistQuestion from './ChecklistQuestion';
import { ChecklistSection as ChecklistSectionType } from '../../types/checklist';

interface ChecklistSectionProps {
  section: ChecklistSectionType;
  values: Record<string, string>;
  observations: Record<string, string>;
  images: Record<string, string>;
  onChangeValue: (id: string, value: string) => void;
  onChangeObservation: (id: string, value: string) => void;
  onChangeImage: (id: string, imageUrl: string | null) => void;
}

export default function ChecklistSection({
  section,
  values,
  observations,
  images,
  onChangeValue,
  onChangeObservation,
  onChangeImage
}: ChecklistSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{section.titulo}</h2>
      {section.itens.map((item, index) => (
        <ChecklistQuestion
          key={item.id}
          number={index + 1}
          question={item.descricao}
          value={values[item.id] || ''}
          observation={observations[item.id] || ''}
          image={images[item.id]}
          onChange={(value) => onChangeValue(item.id, value)}
          onChangeObservation={(value) => onChangeObservation(item.id, value)}
          onImageChange={(imageUrl) => onChangeImage(item.id, imageUrl)}
        />
      ))}
    </div>
  );
}