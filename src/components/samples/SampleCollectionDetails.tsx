import React from 'react';
import { X } from 'lucide-react';

interface SampleCollectionDetailsProps {
  sample: any;
  onClose: () => void;
}

export default function SampleCollectionDetails({ sample, onClose }: SampleCollectionDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Detalhes da Amostra</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="font-semibold text-gray-700">Cliente:</p>
              <p>{sample.client?.name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Data/Hora da Coleta:</p>
              <p>{new Date(sample.collection_date).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Refeição:</p>
              <p>{sample.meal_name}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Responsável:</p>
              <p>{sample.responsible}</p>
            </div>
          </div>

          {sample.notes && (
            <div className="mb-6">
              <p className="font-semibold text-gray-700 mb-2">Observações:</p>
              <p className="whitespace-pre-wrap">{sample.notes}</p>
            </div>
          )}

          {sample.photo_url && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">Foto da Amostra:</p>
              <img
                src={sample.photo_url}
                alt="Amostra"
                className="max-w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}