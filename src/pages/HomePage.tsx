import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';

export default function HomePage() {
  const navigate = useNavigate();
  
  const handleNavigation = (page: 'home' | 'login' | 'register') => {
    navigate(page === 'home' ? '/' : `/${page}`);
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Header onNavigate={handleNavigation} />
      <Hero onGetStarted={handleGetStarted} />
    </div>
  );
}