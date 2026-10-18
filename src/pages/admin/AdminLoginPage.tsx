import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, User, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Bolar@247');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginAdmin(username.trim(), password);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify your password.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-sm shadow-2xl border border-[#262626] overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-[#171717] p-8 text-center text-white border-b border-[#262626]">
          <div className="w-12 h-12 rounded-full border border-[#B99A5B] flex items-center justify-center mx-auto mb-3 text-[#B99A5B]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-white mb-1">
            Bola Wardrobe
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#B99A5B] font-semibold">
            Boutique Administration Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-[#71717A]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-sm text-[#171717]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#71717A]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] border border-[#E9E6E0] focus:border-[#B99A5B] focus:outline-none rounded-sm text-[#171717]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#71717A] hover:text-[#171717]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider bg-[#171717] text-white hover:bg-[#B99A5B] disabled:opacity-50 transition-colors rounded-sm shadow-sm"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </div>
          </form>

          {/* Back to store */}
          <div className="mt-8 pt-6 border-t border-[#E9E6E0] text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#171717] transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Boutique Storefront</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
