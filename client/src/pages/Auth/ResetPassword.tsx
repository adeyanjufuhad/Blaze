import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { toast } from '../../components/ui/Toast';
import api from '../../lib/api';

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      if (res.data?.success) {
        setIsSuccess(true);
        toast.success('Password updated successfully!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password reset failed or token expired');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fffaf5] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#f0e6d9] bg-white p-8 sm:p-10 shadow-blaze-card space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" isLink={false} darkText={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a0a00]">
            Set New Password
          </h1>
          <p className="text-xs text-[#8a6a50]">
            Create a secure new password for your account.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black uppercase tracking-tight text-[#1a0a00]">
              Password Changed!
            </h3>

            <p className="text-sm text-[#8a6a50] leading-relaxed">
              Your password has been successfully updated. You can now log in with your new credentials.
            </p>

            <div className="pt-2">
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-colors shadow-lg shadow-[#ff4500]/30"
              >
                <span>Proceed to Log In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a50]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a50]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-xl shadow-[#ff4500]/30 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <span>Updating...</span> : <span>Update Password</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
