import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, Lock, Mail, User, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'instructor' ? 'instructor' : 'student';

  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newUser = await register({
        name,
        email,
        password,
        role,
        headline: headline || (role === 'instructor' ? 'Professional Instructor' : 'Student Learner'),
      });

      if (newUser.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Apex<span className="text-indigo-600">LMS</span>
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-xs text-slate-500">
            Join our global community of engineers, designers, and instructors.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              role === 'student'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I'm a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('instructor')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              role === 'instructor'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I want to Teach (Instructor)
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {role === 'instructor' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Professional Headline / Expertise
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Software Architect"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Registering...' : `Join as ${role === 'instructor' ? 'Instructor' : 'Student'}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
