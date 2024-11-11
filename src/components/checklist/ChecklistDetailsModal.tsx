import React from 'react';
import { X } from 'lucide-react';
import { ChecklistSection } from '../../types/checklist';
import { conformityLevels } from '../../types/checklist';

interface ChecklistDetailsModalProps {
  type: 'rdc216' | 'hygiene';
  client: string;
  date: string;
  area: string;
  crn: string;
  sections: ChecklistSection[];
  values: Record<string, string>;
  observations: Record<string, string>;
  images: Record<string, string>;
  performance: number;
  onClose: () => void;
}

export default function ChecklistDetailsModal({
  type,
  client,
  date,
  area,
  crn,
  sections,
  values,
  observations,
  images,
  performance,
  onClose
}: ChecklistDetailsModalProps) {
  const title = type === 'rdc216' 
    ? 'CHECKLIST RDC 216' 
    : 'CHECKLIST HIGIÊNICO SANITÁRIO';
  
  const subtitle = type === 'rdc216'
    ? 'Checklist para verificação das Boas Práticas para Serviços de Alimentação conforme RDC 216'
    : 'Checklist para verificação das Condições Higiênico-Sanitárias';

  const getPerformanceLevel = () => {
    if (performance >= 75) return {
      text: 'Desempenho Bom - Manter o Padrão',
      color: 'bg-green-600'
    };
    if (performance >= 50) return {
      text: 'Desempenho Regular - Necessita Melhorias',
      color: 'bg-yellow-400'
    };
    return {
      text: 'Desempenho Crítico - Necessita Ações Imediatas',
      color: 'bg-red-500'
    };
  };

  const level = getPerformanceLevel();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-600 mb-8">{subtitle}</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="font-semibold">Cliente:</p>
              <p>{client}</p>
            </div>
            <div>
              <p className="font-semibold">Data da Inspeção:</p>
              <p>{new Date(date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Área Observada:</p>
              <p>{area}</p>
            </div>
            <div>
              <p className="font-semibold">CRN do Responsável Técnico:</p>
              <p>{crn}</p>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.titulo} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">{section.titulo}</h3>
              {section.itens.map((item) => {
                const value = values[item.id];
                const conformityLevel = conformityLevels.find(level => level.value === value);
                const observation = observations[item.id];
                const image = images[item.id];

                if (!value) return null;

                return (
                  <div key={item.id} className="mb-6 p-4 border rounded-lg">
                    <p className="mb-2">{item.descricao}</p>
                    <div className="mt-2">
                      <p>
                        <span className="font-semibold">Avaliação:</span>{' '}
                        <span className={`inline-block px-2 py-1 rounded ${conformityLevel?.color}`}>
                          {conformityLevel?.label}
                        </span>
                      </p>
                      {observation && (
                        <div className="mt-2">
                          <p className="font-semibold">Observações:</p>
                          <p className="whitespace-pre-wrap">{observation}</p>
                        </div>
                      )}
                      {image && (
                        <div className="mt-4">
                          <img src={image} alt="Evidência" className="max-w-sm rounded-lg" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Avaliação de Desempenho</h3>
            <div className={`${level.color} text-white p-4 rounded-lg text-center mb-4`}>
              {level.text}
            </div>
            <div className="text-center">
              <p className="mb-2">
                Total de itens avaliados: {Object.values(values).filter(v => v !== '').length}
              </p>
              <p>Porcentagem de Conformidade: {performance.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}