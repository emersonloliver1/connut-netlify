import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, ClipboardList } from 'lucide-react';

export default function ChecklistsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center text-white bg-green-600 py-4 rounded-lg mb-8">
        Checklists
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* RDC 216 Checklist Card */}
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
          <div className="p-4 rounded-lg bg-blue-100 mb-4">
            <ClipboardCheck className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">CHECKLIST RDC 216</h2>
          <p className="text-gray-600 text-center mb-6">
            Checklist para verificação das Boas Práticas para Serviços de Alimentação conforme RDC 216
          </p>
          <Link
            to="/dashboard/checklists/rdc216"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Checklist
          </Link>
        </div>

        {/* Hygiene Checklist Card */}
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center">
          <div className="p-4 rounded-lg bg-green-100 mb-4">
            <ClipboardList className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">CHECKLIST HIGIÊNICO SANITÁRIO</h2>
          <p className="text-gray-600 text-center mb-6">
            Checklist para acompanhamento das condições higiênicas sanitárias
          </p>
          <Link
            to="/dashboard/checklists/hygiene"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Iniciar Checklist
          </Link>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/dashboard"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <span>Voltar para o Menu Principal</span>
        </Link>
      </div>
    </div>
  );
}