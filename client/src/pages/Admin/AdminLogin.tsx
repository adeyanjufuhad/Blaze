import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { toast } from '../../components/ui/Toast';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/api';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const adminLogin = useAuthStore((state) => state.adminLogin);

  const [formData, setFormData] = useState({
    email: 'admin@blaze.com',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await api.post('/api/admin/login', formData);

      if (res.data?.success) {
        const { adminToken, admin } = res.data;
        adminLogin(adminToken, admin);
        toast.success(`Admin authorized. Welcome, ${admin.name}`);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid admin credentials';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5f0] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#f0e6d9] bg-white p-8 sm:p-10 shadow-blaze-card space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" isLink={false} darkText={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-[10px] font-black uppercase tracking-widest text-purple-700">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </div>

          <h1 className="text-2xl font-black uppercase tracking-tight text-[#1a0a00] mt-1">
            System Authentication
          </h1>
          <p className="text-xs text-[#8a6a50]">
            Restricted access for kitchen staff and inventory management.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a50]" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@blaze.com"
                className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a50]" />
              <input
                type="password"
                name="password"
                required
                placeholder="Admin@blaze123"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fffaf5] border border-[#f0e6d9] text-[11px] text-[#8a6a50]">
            <span className="font-bold text-[#1a0a00] uppercase block mb-0.5">Default Seed Admin:</span>
            admin@blaze.com / Admin@blaze123
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-xl shadow-[#ff4500]/30 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? <span>Verifying Admin...</span> : <span>Enter Admin Dashboard</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
