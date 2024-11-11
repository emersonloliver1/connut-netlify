import React from 'react';

interface PerformanceEvaluationProps {
  values: Record<string, string>;
  totalItems: number;
}

export default function PerformanceEvaluation({ values, totalItems }: PerformanceEvaluationProps) {
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
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Avaliação de Desempenho</h2>
      
      <div className={`${level.color} text-white p-4 rounded-lg text-center mb-4`}>
        {level.text}
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full mb-4">
        <div 
          className={`absolute left-0 top-0 h-full rounded-full ${level.color}`}
          style={{ width: `${performance}%` }}
        />
      </div>

      <div className="text-center">
        <h3 className="font-semibold mb-2">Análise:</h3>
        <p>Total de itens avaliados: {evaluatedItems}</p>
        <p>Porcentagem de Conformidade: {performance.toFixed(1)}%</p>
      </div>
    </div>
  );
}