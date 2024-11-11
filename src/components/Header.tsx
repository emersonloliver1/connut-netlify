import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: 'home' | 'login' | 'register') => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <nav className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <img src="/connut-logo.svg" alt="Connut" className="h-8 sm:h-12" />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#inicio" className="text-gray-600 hover:text-green-600 transition-colors">Início</a>
            <a href="#recursos" className="text-gray-600 hover:text-green-600 transition-colors">Recursos</a>
            <a href="#sobre" className="text-gray-600 hover:text-green-600 transition-colors">Sobre</a>
            <a href="#contato" className="text-gray-600 hover:text-green-600 transition-colors">Contato</a>
            <button 
              onClick={() => onNavigate('login')}
              className="text-green-600 hover:text-green-700 transition-colors"
            >
              Entrar
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Começar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col gap-4">
              <a href="#inicio" className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1">Início</a>
              <a href="#recursos" className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1">Recursos</a>
              <a href="#sobre" className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1">Sobre</a>
              <a href="#contato" className="text-gray-600 hover:text-green-600 transition-colors px-2 py-1">Contato</a>
              <button 
                onClick={() => onNavigate('login')}
                className="text-green-600 hover:text-green-700 transition-colors text-left px-2 py-1"
              >
                Entrar
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
              >
                Começar
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}