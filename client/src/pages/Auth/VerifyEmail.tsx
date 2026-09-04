import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import api from '../../lib/api';

export const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Link expired or invalid.');
        return;
      }

      try {
        const res = await api.get(`/api/auth/verify-email/${token}`);
        if (res.data?.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(res.data?.message || 'Link expired or invalid.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Link expired or invalid.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fffaf5] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#f0e6d9] bg-white p-8 sm:p-10 shadow-blaze-card text-center space-y-6">
        <div className="flex justify-center mb-2">
          <Logo size="md" isLink={false} darkText={true} />
        </div>

        {status === 'loading' && (
          <div className="space-y-4 py-8">
            <Loader2 className="w-12 h-12 text-[#ff4500] animate-spin mx-auto" />
            <h2 className="text-xl font-black uppercase tracking-tight text-[#1a0a00]">
              Verifying Your Email...
            </h2>
            <p className="text-xs text-[#8a6a50]">
              Please hold on while we validate your activation token.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a0a00]">
              Email verified!
            </h2>

            <p className="text-sm text-[#8a6a50]">
              Your account has been fully activated. You can now log in and start ordering blazing hot pizzas.
            </p>

            <div className="pt-4">
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-all duration-200 shadow-xl shadow-[#ff4500]/30 active:scale-95"
              >
                <span>Log In Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500 flex items-center justify-center text-red-600 mx-auto">
              <XCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a0a00]">
              Verification Failed
            </h2>

            <p className="text-sm text-[#8a6a50]">
              {errorMessage || 'Link expired or invalid.'}
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#ff4500] hover:bg-[#e03800] text-white font-black uppercase text-xs tracking-wider transition-colors"
              >
                <span>Go to Log In</span>
              </Link>
              <Link
                to="/auth/register"
                className="w-full inline-block py-2.5 rounded-xl text-[#8a6a50] hover:text-[#1a0a00] font-bold text-xs uppercase transition-colors"
              >
                Register a new account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
