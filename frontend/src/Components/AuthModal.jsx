import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PROBLEM_DESCRIPTIONS = [
  { value: 'stuttering', label: 'Stuttering' },
  { value: 'stammering', label: 'Stammering' },
  { value: 'lisp', label: 'Lisp' },
  { value: 'articulation', label: 'Articulation Disorder' },
  { value: 'phonological_disorder', label: 'Phonological Disorder' },
  { value: 'apraxia', label: 'Apraxia of Speech' },
  { value: 'dysarthria', label: 'Dysarthria' },
  { value: 'voice_disorder', label: 'Voice Disorder' },
  { value: 'other', label: 'Other' },
];

const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Australia/Oceania',
  'Middle East',
];

export default function AuthModal({ isOpen, onClose, mode: initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    childAge: '',
    region: '',
    problemDescription: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        // Validate signup fields
        if (!formData.phoneNumber || !formData.childAge || !formData.region || !formData.problemDescription) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        
        if (formData.childAge < 1 || formData.childAge > 18) {
          setError('Child age must be between 1 and 18');
          setLoading(false);
          return;
        }

        result = await signup(
          formData.name, 
          formData.email, 
          formData.password,
          formData.phoneNumber,
          parseInt(formData.childAge),
          formData.region,
          formData.problemDescription
        );
      }

      if (result.success) {
        onClose();
        setFormData({ 
          name: '', 
          email: '', 
          password: '',
          phoneNumber: '',
          childAge: '',
          region: '',
          problemDescription: ''
        });
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setFormData({ 
      name: '', 
      email: '', 
      password: '',
      phoneNumber: '',
      childAge: '',
      region: '',
      problemDescription: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-spacegroteskbold mb-6">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md font-spacegroteskregular">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Age of Child <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="childAge"
                  value={formData.childAge}
                  onChange={handleChange}
                  required
                  min="1"
                  max="18"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age (1-18)"
                />
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select region</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Primary Speech Challenge <span className="text-red-500">*</span>
                </label>
                <select
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select challenge</option>
                  {PROBLEM_DESCRIPTIONS.map((problem) => (
                    <option key={problem.value} value={problem.value}>
                      {problem.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {mode === 'login' && (
            <>
              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-spacegroteskregular mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md font-spacegroteskregular hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-blue-600 hover:text-blue-800 font-spacegroteskregular"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
