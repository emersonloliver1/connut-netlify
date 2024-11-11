import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Users, 
  ClipboardList, 
  FileText, 
  FileSpreadsheet, 
  Thermometer, 
  BarChart3, 
  CheckSquare, 
  PieChart, 
  MessageSquare, 
  FileCheck, 
  Package, 
  TestTubes, 
  HelpCircle,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard', color: 'text-purple-500' },
  { icon: Users, label: 'Clientes', href: '/dashboard/clientes', color: 'text-purple-500' },
  { icon: ClipboardList, label: 'Planos de Ação', href: '/dashboard/planos', color: 'text-orange-500' },
  { icon: FileText, label: 'Documentos', href: '/dashboard/documentos', color: 'text-blue-500' },
  { icon: FileSpreadsheet, label: 'Cardápios', href: '/dashboard/cardapios', color: 'text-orange-500' },
  { icon: Thermometer, label: 'Temperaturas', href: '/dashboard/temperaturas', color: 'text-red-500' },
  { icon: BarChart3, label: 'Relatórios', href: '/dashboard/reports', color: 'text-purple-500' },
  { icon: CheckSquare, label: 'Checklists', href: '/dashboard/checklists', color: 'text-green-500' },
  { icon: PieChart, label: 'Avaliações', href: '/dashboard/avaliacoes', color: 'text-purple-500' },
  { icon: MessageSquare, label: 'Atendimentos', href: '/dashboard/atendimentos', color: 'text-blue-500' },
  { icon: FileCheck, label: 'Laudos', href: '/dashboard/laudos', color: 'text-green-500' },
  { icon: Package, label: 'Estoque', href: '/dashboard/estoque', color: 'text-brown-500' },
  { icon: TestTubes, label: 'Coleta de Amostras', href: '/dashboard/coletas', color: 'text-green-500' },
  { icon: Settings, label: 'Configurações', href: '/dashboard/settings', color: 'text-gray-500' },
  { icon: HelpCircle, label: 'Ajuda', href: '/dashboard/ajuda', color: 'text-blue-500' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const session = useAuthStore((state) => state.session);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);

  const fetchProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data: { subscription } } = supabase
        .channel('profiles')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'profiles',
            filter: `id=eq.${session.user.id}` 
          }, 
          () => {
            fetchProfileData();
          }
        )
        .subscribe();

      await fetchProfileData();

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up profile subscription:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, [session?.user?.id]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const showMenu = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link to="/dashboard">
              <img src="/connut-logo.svg" alt="Connut" className="h-10" />
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white hidden sm:block">
              Olá, {profile?.full_name || 'Usuário'}
            </span>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-white rounded-lg hover:bg-green-50 transition-colors gap-2"
            >
              <span className="hidden sm:inline">Sair</span>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="p-4 space-y-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-gray-700">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showMenu && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 hover:shadow-md transition-shadow text-center group cursor-pointer"
                >
                  <div className={`p-3 sm:p-4 rounded-lg ${item.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${item.color}`} />
                  </div>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}