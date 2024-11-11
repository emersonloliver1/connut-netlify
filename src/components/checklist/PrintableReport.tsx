import React from 'react';
import { ChecklistSection } from '../../types/checklist';
import { conformityLevels } from '../../types/checklist';

interface PrintableReportProps {
  type: 'rdc216' | 'hygiene';
  client: string;
  date: string;
  area: string;
  crn: string;
  sections: ChecklistSection[];
  values: Record<string, string>;
  observations: Record<string, string>;
  images: Record<string, string>;
}

export default function PrintableReport({
  type,
  client,
  date,
  area,
  crn,
  sections,
  values,
  observations,
  images
}: PrintableReportProps) {
  const title = type === 'rdc216' 
    ? 'CHECKLIST RDC 216' 
    : 'CHECKLIST HIGIÊNICO SANITÁRIO';
  
  const subtitle = type === 'rdc216'
    ? 'Checklist para verificação das Boas Práticas para Serviços de Alimentação conforme RDC 216'
    : 'Checklist para verificação das Condições Higiênico-Sanitárias';

  const calculatePerformance = () => {
    const validValues = Object.values(values).filter(value => value !== '' && value !== 'NA');
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, value) => acc + Number(value), 0);
    return (sum / (validValues.length * 100)) * 100;
  };

  const performance = calculatePerformance();
  const evaluatedItems = Object.values(values).filter(value => value !== '').length;

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
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

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

      {sections.map((section, sectionIndex) => (
        <div key={section.titulo} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{section.titulo}</h2>
          {section.itens.map((item, itemIndex) => {
            const value = values[item.id];
            const conformityLevel = conformityLevels.find(level => level.value === value);
            const observation = observations[item.id];
            const image = images[item.id];

            if (!value) return null;

            return (
              <div key={item.id} className="mb-6 p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <span className="font-medium">{itemIndex + 1}.</span>
                  <div className="flex-1">
                    <p className="mb-2">{item.descricao}</p>
                    <div className={`mt-2 p-2 rounded-lg ${conformityLevel?.color || 'bg-gray-100'}`}>
                      <p className="font-semibold">
                        Avaliação: <span className="font-normal">{conformityLevel?.label}</span>
                      </p>
                    </div>
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
              </div>
            );
          })}
        </div>
      ))}

      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Avaliação de Desempenho</h2>
        <div className={`${level.color} text-white p-4 rounded-lg text-center mb-4`}>
          {level.text}
        </div>
        <div className="text-center">
          <p className="mb-2">Total de itens avaliados: {evaluatedItems}</p>
          <p>Porcentagem de Conformidade: {performance.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        <div className="grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="border-b pb-4 mb-2"></div>
            <p>Responsável Técnico</p>
            <p>CRN: {crn}</p>
          </div>
          <div className="text-center">
            <div className="border-b pb-4 mb-2"></div>
            <p>Responsável pelo Estabelecimento</p>
            <p>{client}</p>
          </div>
        </div>
      </div>
    </div>
  );
}