import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Home } from 'lucide-react';
import { Input } from './Input';
import { Radio } from './Radio';

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  role?: 'tenant' | 'landlord';
  rememberMe?: boolean;
};

type AuthMode = 'login' | 'signup';

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tenant',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login, signup, error: authError, loading: authLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        // For signup, ensure role is always defined with a default of 'tenant'
        // Convert role to lowercase and ensure it's a string
        const role = (formData.role || 'tenant').toString().toLowerCase();
        await signup(formData.email, formData.password, role);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setSubmitError(authError || 'An error occurred during authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setErrors({});
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Main gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-500"></div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        {/* Light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-400/20"></div>
      </div>
      
      {/* Animated floating elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-cyan-400 mix-blend-overlay opacity-10 filter blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      <motion.div 
        className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-blue-500 mix-blend-overlay opacity-10 filter blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 25, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 1
        }}
      />
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Home className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">HouseRental</h1>
            </div>
            <h2 className="text-xl font-semibold text-white/90">
              {mode === 'login' ? 'Welcome back!' : 'Create an account'}
            </h2>
            <p className="text-sm text-white/80 mt-1">
              {mode === 'login' 
                ? 'Sign in to continue to your account'
                : 'Join us and find your perfect home'}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Email */}
                  <Input
                    name="email"
                    type="email"
                    label="Email address"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                  />

                  {/* Password */}
                  <Input
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    isPassword
                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                  />

                  {/* Confirm Password (Signup only) */}
                  {mode === 'signup' && (
                    <Input
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="••••••••"
                      value={formData.confirmPassword || ''}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                      isPassword
                      icon={<Lock className="h-5 w-5 text-gray-400" />}
                    />
                  )}

                  {/* Role Selection (Signup only) */}
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        I am a
                      </label>
                      <div className="grid gap-2 grid-cols-2">
                        <Radio
                          name="role"
                          value="tenant"
                          checked={formData.role === 'tenant'}
                          onChange={handleChange}
                          label="Tenant"
                          description="Looking for a place to rent"
                        />
                        <Radio
                          name="role"
                          value="landlord"
                          checked={formData.role === 'landlord'}
                          onChange={handleChange}
                          label="Landlord"
                          description="List your property"
                        />
                      </div>
                    </div>
                  )}

                  {/* Remember Me & Forgot Password (Login only) */}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe || false}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <button 
                          type="button"
                          onClick={() => {/* TODO: Implement forgot password functionality */}}
                          className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-md p-1 -m-1"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error Message */}
              {submitError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                  role="alert"
                >
                  {submitError}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || authLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${
                  (isSubmitting || authLoading) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {(isSubmitting || authLoading) ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : mode === 'login' ? 'Sign in' : 'Create account'}
              </motion.button>
            </form>

            {/* Toggle between Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
