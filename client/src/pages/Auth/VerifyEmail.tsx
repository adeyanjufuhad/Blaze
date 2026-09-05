import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import api from '../../lib/api';

export const VerifyEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('Email verified!');
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasRequestedRef.current) return;
      hasRequestedRef.current = true;

      if (!token) {
        setStatus('error');
        setErrorMessage('Link expired or invalid.');
        return;
      }

      try {
        const res = await api.get(`/api/auth/verify-email/${token}`);
        if (res.data?.success) {
          setStatus('success');
          if (res.data.message) {
            setSuccessMessage(res.data.message);
          }
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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#faf9f6] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#e8e4dd] bg-white p-8 sm:p-10 shadow-xs text-center space-y-6">
        <div className="flex justify-center mb-2">
          <Logo size="md" isLink={false} darkText={true} />
        </div>

        {status === 'loading' && (
          <div className="space-y-4 py-8">
            <Loader2 className="w-10 h-10 text-[#111111] animate-spin mx-auto" />
            <h2 className="font-serif text-xl font-normal tracking-tight text-[#111111]">
              Verifying Your Email...
            </h2>
            <p className="text-xs text-[#666666]">
              Please hold on while we validate your activation token.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#2d5a27]/10 border border-[#2d5a27]/30 flex items-center justify-center text-[#2d5a27] mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[2]" />
            </div>

            <h2 className="font-serif text-2xl font-normal tracking-tight text-[#111111]">
              {successMessage}
            </h2>

            <p className="text-xs text-[#666666]">
              Your account has been fully activated. You can now log in and start ordering artisan pizzas.
            </p>

            <div className="pt-4">
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white font-medium text-xs tracking-wide transition-colors"
              >
                <span>Log In Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 mx-auto">
              <XCircle className="w-8 h-8 stroke-[2]" />
            </div>

            <h2 className="font-serif text-2xl font-normal tracking-tight text-[#111111]">
              Verification Failed
            </h2>

            <p className="text-xs text-[#666666]">
              {errorMessage || 'Link expired or invalid.'}
            </p>

            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/auth/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#111111] hover:bg-[#2d5a27] text-white font-medium text-xs tracking-wide transition-colors"
              >
                <span>Go to Log In</span>
              </Link>
              <Link
                to="/auth/register"
                className="w-full inline-block py-2 rounded-full text-[#666666] hover:text-[#111111] text-xs transition-colors"
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
