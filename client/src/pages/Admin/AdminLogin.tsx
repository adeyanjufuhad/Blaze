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
    <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#e8e4dd] bg-white p-8 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" isLink={false} darkText={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf9f6] border border-[#e8e4dd] text-[10px] font-medium tracking-widest text-[#666666]">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </div>

          <h1 className="font-serif text-2xl font-normal tracking-tight text-[#111111] mt-1">
            System Authentication
          </h1>
          <p className="text-xs text-[#666666]">
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
            <label className="block text-xs font-medium tracking-wide text-[#666666] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@blaze.com"
                className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium tracking-wide text-[#666666] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="password"
                name="password"
                required
                placeholder="Admin@blaze123"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#faf9f6] border border-[#e8e4dd] text-[11px] text-[#666666]">
            <span className="font-semibold text-[#111111] block mb-0.5">Default Seed Admin:</span>
            admin@blaze.com / Admin@blaze123
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white font-medium text-xs tracking-wide transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <span>Verifying Admin...</span> : <span>Enter Admin Dashboard</span>}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
