import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

interface AuthPageProps {
  type: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onNavigate: (page: string) => void;
  onSuccess: () => void;
}

export default function AuthPage({ type, onNavigate, onSuccess }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
        <span className="text-green-600 font-semibold">← Voltar</span>
      </div>
      <div className="flex items-center justify-center min-h-full">
        <div className="max-w-md w-full">
          {type === 'login' && (
            <LoginForm 
              onRegister={() => onNavigate('/register')} 
              onForgotPassword={() => onNavigate('/forgot-password')}
              onSuccess={onSuccess} 
            />
          )}
          {type === 'register' && (
            <RegisterForm onLogin={() => onNavigate('/login')} />
          )}
          {type === 'forgot-password' && (
            <ForgotPasswordForm onBack={() => onNavigate('/login')} />
          )}
          {type === 'reset-password' && (
            <ResetPasswordForm />
          )}
        </div>
      </div>
    </div>
  );
}