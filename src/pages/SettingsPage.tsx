import React from 'react';
import { Settings, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export default function SettingsPage() {
  const session = useAuthStore((state) => state.session);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    fullName: '',
  });

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      // First ensure profile exists
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          full_name: session.user.user_metadata.full_name || '',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (upsertError) throw upsertError;

      // Then fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setFormData({
        fullName: data?.full_name || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erro ao carregar perfil');
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, [session?.user?.id]);

  const handleUpdateProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success('Perfil atualizado com sucesso');
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(session?.user?.email || '', {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email de redefinição de senha enviado');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Erro ao enviar email de redefinição de senha');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(session?.user?.email || '', {
        redirectTo: `${window.location.origin}/update-email`,
      });

      if (error) throw error;

      toast.success('Email de atualização enviado');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Erro ao enviar email de atualização');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-gray-600" />
          <h1 className="text-2xl font-semibold text-gray-800">Configurações</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-700">Informações Pessoais</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full rounded-lg border-gray-300"
                placeholder="Seu nome completo"
              />
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-700">Email</h2>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Email atual: {session?.user?.email}</p>
          </div>

          <button
            onClick={handleUpdateEmail}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Alterar Email
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-700">Senha</h2>
          </div>

          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}