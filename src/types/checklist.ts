export interface ChecklistItem {
  id: string;
  descricao: string;
}

export interface ChecklistSection {
  titulo: string;
  itens: ChecklistItem[];
}

export const conformityLevels = [
  { value: '100', label: '100% - Conforme', color: 'bg-green-100 border-green-500' },
  { value: '50', label: '50% - Parcialmente conforme', color: 'bg-yellow-100 border-yellow-500' },
  { value: '25', label: '25% - Pouco conforme', color: 'bg-orange-100 border-orange-500' },
  { value: '0', label: '0% - Não conforme', color: 'bg-red-100 border-red-500' },
  { value: 'NA', label: 'N/A - Não se aplica', color: 'bg-gray-100 border-gray-500' }
];