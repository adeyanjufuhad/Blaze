import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { toast } from '../../components/ui/Toast';
import api from '../../lib/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      if (res.data?.success) {
        setIsSent(true);
        if (res.data.resetToken) {
          setResetToken(res.data.resetToken);
        }
        toast.success('Reset link dispatched! Check your email.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not send reset link');
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
            Reset Password
          </h1>
          <p className="text-xs text-[#8a6a50]">
            Enter your registered email address and we'll send you a password recovery link.
          </p>
        </div>

        {isSent ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#ff4500]/15 border border-[#ff4500] flex items-center justify-center text-[#ff4500] mx-auto">
              <Mail className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-black uppercase tracking-tight text-[#1a0a00]">
              Check Your Inbox
            </h3>

            <p className="text-sm text-[#8a6a50] leading-relaxed">
              If an account is associated with <strong className="text-[#1a0a00]">{email}</strong>, a reset link that expires in 1 hour has been sent.
            </p>

            {resetToken && (
              <div className="pt-2">
                <Link
                  to={`/auth/reset-password/${resetToken}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-colors"
                >
                  <span>Test Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ff4500] hover:underline uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Log In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8a6a50] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a6a50]" />
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fffaf5] border border-[#f0e6d9] focus:border-[#ff4500] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a0a00] placeholder-[#8a6a50]/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-xl shadow-[#ff4500]/30 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? <span>Sending Link...</span> : <span>Send Reset Link</span>}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-[#f0e6d9] text-xs">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1.5 text-[#8a6a50] hover:text-[#1a0a00] font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
