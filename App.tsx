
import React, { useState, useEffect } from 'react';
import { Home, DollarSign, CreditCard, User, Menu, Calculator, Building2, TrendingUp, X, Info, ChevronRight, Layers, ShieldCheck, AlertCircle, Phone, MessageCircle, FileText, Shield } from 'lucide-react';
import ProjectCard from './components/ProjectCard';
import ProductPopup from './components/ProductPopup';
import AdminDashboard from './components/AdminDashboard';
import LoanCalculator from './components/LoanCalculator';
import CardComparison from './components/CardComparison';
import RegistrationGuide from './components/RegistrationGuide';
import PartnerSlider from './components/PartnerSlider';
import { Project, ProjectType } from './types';
import { INITIAL_PROJECTS, SUPPORT_ZALO } from './constants';
import { getAllProjects, getHeroSettings } from './services/supabaseService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'loans' | 'cards' | 'comparison' | 'calc' | 'insurance' | 'profile'>('home');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // App Settings for Hero Slide - synced with AdminDashboard via localStorage
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('finsmart_app_settings');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'Tài Chính Thông Minh',
      heroSubtitle: 'Giải pháp so sánh và lựa chọn sản phẩm tài chính tối ưu nhất dành cho bạn.',
      heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200',
      zaloSupport: SUPPORT_ZALO
    };
  });

  // Listen for storage changes from AdminDashboard
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('finsmart_app_settings');
      const savedProjects = localStorage.getItem('finsmart_projects');

      if (savedSettings) {
        setAppSettings(JSON.parse(savedSettings));
      }
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check on mount
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for admin hash or path
  useEffect(() => {
    const checkAdminAccess = () => {
      // Check both hash (#admin) and pathname (/admin)
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setShowAdmin(true);
      }
    };

    checkAdminAccess();
    window.addEventListener('hashchange', checkAdminAccess);
    window.addEventListener('popstate', checkAdminAccess);

    return () => {
      window.removeEventListener('hashchange', checkAdminAccess);
      window.removeEventListener('popstate', checkAdminAccess);
    };
  }, []);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const loadDataFromSupabase = async () => {
      try {
        // Fetch projects from Supabase Database
        const dbProjects = await getAllProjects();
        if (dbProjects && dbProjects.length > 0) {
          setProjects(dbProjects);
          localStorage.setItem('finsmart_projects', JSON.stringify(dbProjects));
        }

        // Fetch hero settings from Supabase
        const heroData = await getHeroSettings();
        if (heroData) {
          setAppSettings(heroData);
          localStorage.setItem('finsmart_app_settings', JSON.stringify(heroData));
        }
      } catch (error) {
        console.warn('Supabase fetch error, using localStorage/fallback:', error);
      }
    };

    loadDataFromSupabase();
  }, []);

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'loans') return p.type === ProjectType.LOAN;
    if (activeTab === 'cards') return p.type === ProjectType.CREDIT_CARD;
    return p.status === 'Published';
  }).sort((a, b) => a.order - b.order);

  const handlePhoneCall = () => {
    window.location.href = `tel:${SUPPORT_ZALO.replace(/\./g, '')}`;
  };

  const handleZaloChat = () => {
    window.open(`https://zalo.me/${SUPPORT_ZALO.replace(/\./g, '')}`, '_blank');
  };

  // If admin mode, show only AdminDashboard
  if (showAdmin) {
    return <AdminDashboard />;
  }

  const HomeSection = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Banner */}
      <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-xl">
        <img src={appSettings.heroImage} className="w-full h-full object-cover" alt="hero" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent flex items-center p-6 sm:p-10">
          <div className="max-w-md">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{appSettings.heroTitle}</h1>
            <p className="text-blue-100 text-sm sm:text-lg mb-6 opacity-90">{appSettings.heroSubtitle}</p>
            <button
              onClick={() => setActiveTab('loans')}
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 text-sm uppercase"
            >
              Khám phá ngay <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'comparison', label: 'So sánh thẻ', icon: Layers, color: 'bg-blue-600' },
          { id: 'calc', label: 'Ước tính khoản vay', icon: Calculator, color: 'bg-amber-500' },
          { id: 'cards', label: 'Thẻ tín dụng', icon: CreditCard, color: 'bg-indigo-500' },
          { id: 'loans', label: 'Vay tiêu dùng', icon: DollarSign, color: 'bg-emerald-500' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className="flex flex-col items-center p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
              <item.icon size={24} />
            </div>
            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight text-center">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Featured Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" /> Dự án nổi bật
          </h2>
          <button onClick={() => setActiveTab('loans')} className="text-xs font-bold text-blue-600">Xem tất cả</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.filter(p => p.status === 'Published').slice(0, 6).map(p => (
            <ProjectCard key={p.id} project={p} onOpenDetail={setSelectedProject} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      <div className="flex flex-1 w-full">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 bg-white border-r border-slate-100 shadow-sm z-40 overflow-hidden">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
              <Building2 size={24} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">FINSMART</span>
          </div>

          <nav className="flex-1 space-y-2 p-6">
            {[
              { id: 'home', label: 'Trang chủ', icon: Home, color: 'blue' },
              { id: 'cards', label: 'Thẻ tín dụng', icon: CreditCard, color: 'blue' },
              { id: 'loans', label: 'Vay tiêu dùng', icon: DollarSign, color: 'emerald' },
              { id: 'insurance', label: 'Bảo hiểm ô tô', icon: Shield, color: 'purple' },
              { id: 'profile', label: 'Hướng dẫn đăng ký', icon: FileText, color: 'amber' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 font-bold rounded-2xl transition-all ${activeTab === item.id
                  ? `bg-${item.color}-50 text-${item.color}-600 shadow-md`
                  : 'text-slate-600 hover:bg-slate-50 hover:scale-[1.02]'
                  }`}
              >
                <item.icon size={20} strokeWidth={2.5} /> {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Hub - Icon Only Design */}
          <div className="mt-auto p-5 bg-slate-50 rounded-[2.5rem] border border-slate-200/50 shadow-inner mx-6 mb-6">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4 text-center">Hỗ trợ trực tuyến</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePhoneCall}
                className="w-12 h-12 bg-white text-slate-600 rounded-full flex items-center justify-center shadow-lg border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 group"
                title="Gọi: 0337.502.217"
              >
                <Phone size={18} />
              </button>
              <button
                onClick={handleZaloChat}
                className="w-12 h-12 bg-gradient-to-br from-[#0068ff] to-[#0052cc] text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-200 hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
                title="Chat Zalo: 0337.502.217"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle size={22} fill="white" className="relative z-10" />
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-8 overflow-x-hidden w-full">
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center px-4 sm:px-8">
            <div className="lg:hidden w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Building2 size={20} />
            </div>
            <div className="flex-1 lg:hidden">
              <span className="text-xl font-black text-slate-800 tracking-tighter">FINSMART</span>
            </div>

            <nav className="hidden sm:flex items-center gap-8 mr-auto pl-8">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-black uppercase tracking-tight ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}>Trang chủ</button>
              <button onClick={() => setActiveTab('loans')} className={`text-sm font-black uppercase tracking-tight ${activeTab === 'loans' ? 'text-blue-600' : 'text-slate-400'}`}>Vay tiêu dùng</button>
              <button onClick={() => setActiveTab('cards')} className={`text-sm font-black uppercase tracking-tight ${activeTab === 'cards' ? 'text-blue-600' : 'text-slate-400'}`}>Thẻ tín dụng</button>
            </nav>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          </header>

          {/* Body Content */}
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
            {activeTab === 'home' && <HomeSection />}

            {(activeTab === 'loans' || activeTab === 'cards') && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {activeTab === 'loans' ? 'Khoản Vay Tiêu Dùng' : 'Thẻ Tín Dụng'}
                  </h2>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button onClick={() => setActiveTab('loans')} className={`px-5 py-2 rounded-xl text-xs font-black uppercase ${activeTab === 'loans' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Vay</button>
                    <button onClick={() => setActiveTab('cards')} className={`px-5 py-2 rounded-xl text-xs font-black uppercase ${activeTab === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Thẻ</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map(p => (
                    <ProjectCard key={p.id} project={p} onOpenDetail={setSelectedProject} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'calc' && <LoanCalculator onNavigate={setActiveTab} />}

            {activeTab === 'comparison' && <CardComparison onSelectCard={setSelectedProject} projects={projects} />}

            {activeTab === 'insurance' && (
              <div className="text-center py-20 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield size={48} className="text-purple-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3">Bảo hiểm ô tô giá rẻ</h3>
                <p className="text-slate-500 font-medium mb-6">Tính năng đang được phát triển</p>
                <div className="inline-block px-6 py-3 bg-purple-100 text-purple-700 rounded-2xl font-bold text-sm">
                  Sắp ra mắt
                </div>
              </div>
            )}

            {activeTab === 'profile' && <RegistrationGuide projects={projects} />}
          </div>

          {/* PARTNER SLIDER */}
          <PartnerSlider projects={projects} />

          {/* CHÂN TRANG - LƯU Ý PHÁP LÝ */}
          <footer className="mt-auto px-4 sm:px-8 py-8 border-t border-slate-100 bg-white/50">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cam kết bảo mật & Minh bạch</span>
                </div>
                <div className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200/50 max-w-3xl">
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed flex items-start gap-3 text-left">
                    <AlertCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      <b>Lưu ý quan trọng:</b> Website chỉ cung cấp thông tin so sánh và đánh giá sản phẩm tài chính.
                      Mọi đăng ký (nếu có) được thực hiện trực tiếp tại website chính thức của đơn vị phát hành.
                      Finsmart không phải là đơn vị cho vay và không thu bất kỳ khoản phí nào từ người dùng.
                    </span>
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 font-bold">© 2024 Finsmart - Affiliate Fintech Conversion Engine. All Rights Reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* BOTTOM NAVIGATION - MOBILE */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/95 backdrop-blur-md border-t border-slate-200 h-16 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        {[
          { id: 'home', label: 'Trang chủ', icon: Home },
          { id: 'cards', label: 'Thẻ', icon: CreditCard },
          { id: 'loans', label: 'Vay', icon: DollarSign },
          { id: 'insurance', label: 'Bảo hiểm', icon: Shield },
          { id: 'comparison', label: 'So sánh', icon: Layers },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 transition-all duration-200 ${activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-slate-500 hover:text-blue-500 hover:scale-105'
              }`}
          >
            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} className="transition-all" />
            <span className={`text-[10px] font-bold transition-all ${activeTab === tab.id ? 'opacity-100' : 'opacity-75'
              }`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-white to-slate-50 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white">
              <h2 className="text-xl font-black text-slate-800">Danh mục</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all hover:rotate-90"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-2">
              {[
                { id: 'cards', label: 'Thẻ tín dụng', icon: CreditCard, color: 'blue' },
                { id: 'loans', label: 'Vay tiêu dùng', icon: DollarSign, color: 'emerald' },
                { id: 'insurance', label: 'Bảo hiểm ô tô giá rẻ', icon: Shield, color: 'purple' },
                { id: 'profile', label: 'Hướng dẫn đăng ký', icon: FileText, color: 'orange' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02] ${activeTab === item.id
                      ? `bg-${item.color}-50 text-${item.color}-700 shadow-sm`
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === item.id ? `bg-${item.color}-100` : 'bg-slate-100'
                    }`}>
                    <item.icon size={20} />
                  </div>
                  <span className="font-bold text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Footer - Contact Support */}
            <div className="p-6 border-t border-slate-200 bg-white">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 text-center">
                Liên hệ hỗ trợ
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePhoneCall}
                  title="Gọi: 0337.502.217"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <Phone size={18} />
                  <span className="text-xs font-bold">Gọi ngay</span>
                </button>
                <button
                  onClick={handleZaloChat}
                  title="Chat Zalo: 0337.502.217"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-[#0068ff] to-[#0052cc] text-white rounded-2xl shadow-lg hover:scale-105 transition-transform"
                >
                  <MessageCircle size={18} />
                  <span className="text-xs font-bold">Chat Zalo</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {selectedProject && <ProductPopup project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
};

export default App;
