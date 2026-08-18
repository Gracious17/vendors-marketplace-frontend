import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import AuthField from '../components/ui/AuthField';

const stats = [
  { number: '500+', label: 'Verified vendors' },
  { number: '10K+', label: 'Events planned' },
  { number: '4.9', label: 'Average rating' },
];

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { signIn, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signIn(formData.email, formData.password);

      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="lg:h-screen grid lg:grid-cols-2 font-display">
      {/* Image column */}
      <div className="hidden lg:block relative bg-carbon h-full overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1447252/pexels-photo-1447252.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-carbon/75" />
        <div className="relative h-full flex flex-col justify-end p-12">
          <h2 className="font-display font-light text-3xl text-paper mb-3 max-w-sm leading-tight">
            Find the right vendor for your next event
          </h2>
          <p className="text-mist mb-10 max-w-sm">
            Verified caterers, photographers, venues, and planners in one place.
          </p>
          <div className="flex gap-10 pt-8 border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-semibold text-paper mb-1">{stat.number}</div>
                <div className="text-smoke text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className="lg:h-full lg:overflow-y-auto bg-paper">
        <div className="min-h-full flex flex-col justify-center px-6 py-12">
        <div className="w-full max-w-sm mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 mb-10">
            <Calendar className="h-6 w-6 text-carbon" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-carbon">
              VendorHub<span className="text-fiverr-green">.</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-carbon mb-2">Welcome back</h1>
            <p className="text-graphite">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Sign in failed
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <AuthField
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={formErrors.email}
              icon={Mail}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            <AuthField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={formErrors.password}
              icon={Lock}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-smoke hover:text-graphite transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-graphite">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-fiverr-green hover:text-forest-stage transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-carbon text-paper font-semibold hover:bg-slate transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-paper/40 border-t-paper rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-mist" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-paper text-smoke">New to VendorHub?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-fiverr-green hover:text-forest-stage font-medium transition-colors"
              >
                Create your account &rarr;
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
