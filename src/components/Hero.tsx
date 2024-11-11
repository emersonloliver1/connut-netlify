import React from 'react';
import { Clipboard, ShieldCheck, Users } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-24 sm:pt-32 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              Gestão Nutricional
              <span className="text-green-600 block">Simplificada</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Transforme a gestão do seu estabelecimento com nossa plataforma completa de controle nutricional. 
              Checklists, documentação e conformidade em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg font-semibold"
              >
                Começar Agora
              </button>
              <button className="border-2 border-green-600 text-green-600 px-6 sm:px-8 py-3 rounded-lg hover:bg-green-50 transition-colors text-base sm:text-lg font-semibold">
                Saiba Mais
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="flex-1 w-full">
            <div className="grid gap-4 sm:gap-6 max-w-lg mx-auto">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Clipboard className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">Checklists RDC 216</h3>
                    <p className="text-sm sm:text-base text-gray-600">Conformidade garantida com a legislação</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">Controle Sanitário</h3>
                    <p className="text-sm sm:text-base text-gray-600">Monitore padrões de higiene e qualidade</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">Gestão de Clientes</h3>
                    <p className="text-sm sm:text-base text-gray-600">Organize e acompanhe seus clientes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Carousel Section */}
        <div className="mt-16 sm:mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Nossa Plataforma em Ação</h2>
          <ImageCarousel />
        </div>
      </div>
    </div>
  );
}