import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');

  const [email, setEmail] = useState(requestedRole === 'admin' ? 'admin@lms.com' : '');
  const [password, setPassword] = useState(requestedRole === 'admin' ? 'Password123!' : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (requestedRole === 'admin') {
      setEmail('admin@lms.com');
      setPassword('Password123!');
    }
  }, [requestedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      // Redirect based on role or intended destination
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const quickFill = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Apex<span className="text-indigo-600">LMS</span>
            </span>
          </Link>
          
          {requestedRole === 'admin' ? (
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator Gateway
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                Admin Control Login
              </h2>
              <p className="text-xs text-slate-500">
                Credentials pre-loaded. Click "Sign In" to open Admin Control Center.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to continue your learning journey or manage your academy.
              </p>
            </div>
          )}
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100/80 space-y-2">
          <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider text-center">
            Quick 1-Click Role Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickFill('admin@lms.com', 'Password123!')}
              className={`px-2 py-1.5 rounded-lg text-xs font-bold shadow-sm border transition truncate ${
                email === 'admin@lms.com'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200'
                  : 'bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 border-slate-200'
              }`}
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => quickFill('john@instructor.com', 'Password123!')}
              className={`px-2 py-1.5 rounded-lg text-xs font-bold shadow-sm border transition truncate ${
                email === 'john@instructor.com'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                  : 'bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border-slate-200'
              }`}
            >
              💼 Instructor
            </button>
            <button
              type="button"
              onClick={() => quickFill('alex@student.com', 'Password123!')}
              className={`px-2 py-1.5 rounded-lg text-xs font-bold shadow-sm border transition truncate ${
                email === 'alex@student.com'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
                  : 'bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 border-slate-200'
              }`}
            >
              🎓 Student
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2 ${
              email === 'admin@lms.com'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200 hover:shadow-rose-300'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 hover:shadow-indigo-300'
            }`}
          >
            {loading ? 'Authenticating...' : email === 'admin@lms.com' ? 'Sign in as Admin' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Bottom register link */}
        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <p className="text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Register
            </Link>
          </p>

          <Link
            to="/login?role=admin"
            className="text-rose-600 font-bold hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
