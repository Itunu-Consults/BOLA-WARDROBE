import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Calendar,
  Layers,
  Mail,
  Image as ImageIcon,
  Settings,
  LogOut,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  navigate,
  children,
}) => {
  const { adminUser, logoutAdmin, changeAdminPassword } = useStore();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Order Requests', icon: ShoppingBag },
    { id: 'bookings', label: 'Consultations', icon: Calendar },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters long.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }

    const res = await changeAdminPassword(currentPw, newPw);
    if (res.success) {
      setPwSuccess(true);
      setTimeout(() => {
        setPasswordModalOpen(false);
        setPwSuccess(false);
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
      }, 1500);
    } else {
      setPwError(res.error || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex flex-col md:flex-row text-[#171717]">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#171717] text-white flex flex-col shrink-0 border-r border-[#262626]">
        {/* Brand Lockup */}
        <div className="p-6 border-b border-[#262626] flex items-center justify-between">
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-white block">
              Bola Wardrobe
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#B99A5B] font-semibold block">
              Management Portal
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="p-1.5 text-[#A1A1AA] hover:text-white transition-colors"
            title="View Live Storefront"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Change password warning banner if required */}
        {adminUser?.passwordMustChange && (
          <div className="p-3 bg-[#B99A5B]/15 border-b border-[#B99A5B]/30 flex items-start gap-2 text-xs text-[#FAF8F5]">
            <AlertTriangle className="w-4 h-4 text-[#B99A5B] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#B99A5B]">Password Update Advised</p>
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="underline hover:text-white text-[11px]"
              >
                Change default password
              </button>
            </div>
          </div>
        )}

        {/* Nav Link List */}
        <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  navigate(`/admin/${item.id === 'dashboard' ? '' : item.id}`);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xs transition-colors ${
                  isActive
                    ? 'bg-[#B99A5B] text-[#171717] shadow-2xs'
                    : 'text-[#D4D4D8] hover:bg-[#262626] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Session Footer */}
        <div className="p-4 border-t border-[#262626] flex items-center justify-between text-xs text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#262626] border border-[#B99A5B]/40 flex items-center justify-center text-[#B99A5B] font-semibold text-xs">
              BW
            </div>
            <div className="truncate max-w-[100px]">
              <span className="font-medium text-white block truncate">
                {adminUser?.username || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#71717A] uppercase">Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="p-1.5 hover:text-white hover:bg-[#262626] rounded-xs transition-colors"
              title="Change Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={async () => {
                await logoutAdmin();
                navigate('/admin/login');
              }}
              className="p-1.5 hover:text-red-400 hover:bg-[#262626] rounded-xs transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-[#E9E6E0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B99A5B]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
              Secure Admin Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#B99A5B] transition-colors flex items-center gap-1"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* Password Change Modal */}
      {passwordModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Change Administrator Password"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white max-w-sm w-full p-6 rounded-sm shadow-xl border border-[#E9E6E0] relative animate-fadeIn">
            <h3 className="font-serif text-xl font-semibold text-[#171717] mb-1">
              Change Admin Password
            </h3>
            <p className="text-xs text-[#626262] mb-4">
              Enter your current password and specify a strong new password.
            </p>

            {pwSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 text-xs rounded-xs font-medium text-center">
                Password updated successfully!
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
                {pwError && (
                  <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xs font-medium">
                    {pwError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    New Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-[#626262] hover:text-[#171717]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] rounded-xs transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
