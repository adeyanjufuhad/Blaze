import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { toast } from '../../components/ui/Toast';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/menu';

  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.data?.success) {
        const { accessToken, refreshToken, user } = res.data;
        login(accessToken, refreshToken, user);
        toast.success(`Welcome back, ${user.name}!`);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#faf9f6] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#e8e4dd] bg-white p-8 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" isLink={false} darkText={true} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#111111]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#666666]">
            Log in to your account to order and track your delivery.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-wide text-[#666666] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="email"
                name="email"
                required
                placeholder="alex@blaze.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium tracking-wide text-[#666666]">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-[11px] text-[#666666] hover:text-[#111111] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white font-medium text-xs tracking-wide transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <span>Logging In...</span> : <span>Log In</span>}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-[#e8e4dd] text-xs text-[#666666]">
          Don't have an account yet?{' '}
          <Link
            to="/auth/register"
            className="text-[#111111] font-medium hover:underline ml-1"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
