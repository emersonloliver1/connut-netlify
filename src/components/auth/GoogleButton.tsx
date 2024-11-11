import React from 'react';
import { supabase } from '../../lib/supabase';

interface GoogleButtonProps {
  mode: 'login' | 'signup';
}

export default function GoogleButton({ mode }: GoogleButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google auth error:', error.message);
        throw error;
      }
    } catch (error) {
      console.error('Error with Google auth:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full flex justify-center items-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
      )}
      <span className="text-sm font-medium text-gray-700">
        {mode === 'login' ? 'Entrar com Google' : 'Cadastrar com Google'}
      </span>
    </button>
  );
}