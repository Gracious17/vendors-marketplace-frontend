import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, UserCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import AuthField from '../components/ui/AuthField';
import ImageUpload from '../components/ImageUpload';

const stats = [
  { number: '500+', label: 'Verified vendors' },
  { number: '10K+', label: 'Events planned' },
  { number: '4.9', label: 'Average rating' },
];

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'client' | 'vendor',
    profileImage: null as string | null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { signUp, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

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

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'vendor' && !formData.profileImage) {
      errors.profileImage = 'Profile image is required for vendors';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        role: formData.role,
        profileImage: formData.profileImage,
      });

      const dashboardPath = formData.role === 'client' ? '/dashboard/client' : '/dashboard/vendor';
      navigate(dashboardPath, { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
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
            Join thousands of event planners and vendors
          </h2>
          <p className="text-mist mb-10 max-w-sm">
            Free to join, verified profiles, and a marketplace built for real events.
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
        <div className="w-full max-w-xl mx-auto">
          <Link to="/" className="inline-flex items-center space-x-2 mb-10">
            <Calendar className="h-6 w-6 text-carbon" strokeWidth={1.5} />
            <span className="text-lg font-semibold text-carbon">
              VendorHub<span className="text-fiverr-green">.</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-carbon mb-2">Create your account</h1>
            <p className="text-graphite">Join VendorHub and start connecting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Registration failed
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('role', 'client')}
                  className={`
                    p-4 border rounded-xl text-left transition-colors
                    ${formData.role === 'client'
                      ? 'border-fiverr-green bg-fiverr-green/10 text-fiverr-green'
                      : 'border-mist hover:border-fog text-graphite'
                    }
                  `}
                >
                  <UserCheck className="h-5 w-5 mb-2" strokeWidth={1.5} />
                  <div className="font-medium">Client</div>
                  <div className="text-sm opacity-75">Plan events</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('role', 'vendor')}
                  className={`
                    p-4 border rounded-xl text-left transition-colors
                    ${formData.role === 'vendor'
                      ? 'border-fiverr-green bg-fiverr-green/10 text-fiverr-green'
                      : 'border-mist hover:border-fog text-graphite'
                    }
                  `}
                >
                  <User className="h-5 w-5 mb-2" strokeWidth={1.5} />
                  <div className="font-medium">Vendor</div>
                  <div className="text-sm opacity-75">Offer services</div>
                </button>
              </div>
            </div>

            {formData.role === 'vendor' && (
              <div>
                <label className="block text-sm font-medium text-carbon mb-2">
                  Profile Image *
                </label>
                <div className="flex justify-center">
                  <ImageUpload
                    currentImage={formData.profileImage}
                    onImageChange={(url) => setFormData(prev => ({ ...prev, profileImage: url }))}
                    size="lg"
                  />
                </div>
                {formErrors.profileImage && (
                  <p className="mt-1 text-sm text-red-600 text-center">{formErrors.profileImage}</p>
                )}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <AuthField
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={formErrors.name}
                icon={User}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <AuthField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={formErrors.email}
                icon={Mail}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <AuthField
              label="Phone Number (Optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={formErrors.phone}
              icon={Phone}
              placeholder="Enter your phone number"
              autoComplete="tel"
              helperText="Optional - helps with account verification"
            />

            <div className="grid sm:grid-cols-2 gap-5 items-start">
              <AuthField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={formErrors.password}
                icon={Lock}
                placeholder="Create a password"
                autoComplete="new-password"
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

              <AuthField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={formErrors.confirmPassword}
                icon={Lock}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-smoke hover:text-graphite transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>
            <p className="text-sm text-smoke -mt-3">
              Password must be at least 8 characters with uppercase, lowercase, and a number.
            </p>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-fiverr-green focus:ring-fiverr-green border-fog rounded mt-1"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-graphite">
                I agree to the{' '}
                <Link to="/terms" className="text-fiverr-green hover:text-forest-stage transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-fiverr-green hover:text-forest-stage transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-carbon text-paper font-semibold hover:bg-slate transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-paper/40 border-t-paper rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-mist" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-paper text-smoke">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-fiverr-green hover:text-forest-stage font-medium transition-colors"
              >
                Sign in instead &rarr;
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
