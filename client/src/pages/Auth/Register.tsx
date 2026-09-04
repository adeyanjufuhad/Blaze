import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Mail, Lock, User as UserIcon, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/ui/Logo';
import { toast } from '../../components/ui/Toast';
import api from '../../lib/api';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(formData.password);

  const getStrengthLabel = () => {
    if (!formData.password) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong 🔥';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.data?.success) {
        setIsSuccess(true);
        setRegisteredEmail(formData.email);
        if (res.data.verificationToken) {
          setVerificationToken(res.data.verificationToken);
        }
        toast.success('Registration successful! Please check your email.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-[#faf9f6] px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-[#e8e4dd] bg-white p-8 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo size="md" isLink={false} darkText={true} />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#111111]">
            Create an Account
          </h1>
          <p className="text-xs text-[#666666]">
            Join Blaze for artisan pizzas, live delivery tracking, and fast ordering.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#2d5a27]/10 border border-[#2d5a27]/30 flex items-center justify-center text-[#2d5a27] mx-auto">
              <Mail className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-lg font-normal tracking-tight text-[#111111]">
              Verify Your Email
            </h3>

            <p className="text-xs text-[#666666] leading-relaxed">
              We sent a verification link to <strong className="text-[#111111]">{registeredEmail}</strong>. Click the link in your email to activate your account.
            </p>

            {verificationToken && (
              <div className="pt-2">
                <Link
                  to={`/auth/verify-email/${verificationToken}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[#2d5a27] hover:bg-[#23471f] text-white font-medium text-xs tracking-wide transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Email Verification Link</span>
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/auth/login"
                className="text-xs text-[#666666] hover:text-[#111111] transition-colors"
              >
                Back to Log In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium tracking-wide text-[#666666] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Alex Hunter"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
                />
              </div>
            </div>

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
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#faf9f6] border border-[#e8e4dd] focus:border-[#111111] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder-[#888888] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide text-[#666666] mb-1.5">
                Password
              </label>
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

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-medium">
                    <span className="text-[#666666]">Strength:</span>
                    <span
                      className={
                        strength <= 2
                          ? 'text-red-500'
                          : strength <= 3
                          ? 'text-yellow-600'
                          : 'text-[#2d5a27]'
                      }
                    >
                      {getStrengthLabel()}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`rounded-full transition-all ${
                          strength >= level
                            ? strength <= 2
                              ? 'bg-red-500'
                              : strength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-[#2d5a27]'
                            : 'bg-[#e8e4dd]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide text-[#666666] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
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
              {isSubmitting ? <span>Creating Account...</span> : <span>Create Account</span>}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-[#e8e4dd] text-xs text-[#666666]">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-[#111111] font-medium hover:underline ml-1"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
