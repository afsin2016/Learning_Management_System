import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  BookOpen,
  Heart,
  Award,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isInstructor, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6 flex-1 max-w-xl">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                Apex<span className="text-indigo-600">LMS</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Academy
              </span>
            </div>
          </Link>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses, skills, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm rounded-full border border-transparent focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition outline-none text-slate-800"
            />
          </form>
        </div>

        {/* Center / Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link
            to="/courses"
            className={`hover:text-indigo-600 transition flex items-center gap-1.5 ${
              location.pathname === '/courses' ? 'text-indigo-600 font-semibold' : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Browse Catalog
          </Link>

          {isStudent && (
            <>
              <Link
                to="/student/my-courses"
                className={`hover:text-indigo-600 transition flex items-center gap-1.5 ${
                  location.pathname === '/student/my-courses' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                My Courses
              </Link>
              <Link
                to="/student/wishlist"
                className={`hover:text-indigo-600 transition flex items-center gap-1.5 ${
                  location.pathname === '/student/wishlist' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                <Heart className="w-4 h-4" />
                Wishlist
              </Link>
              <Link
                to="/student/certificates"
                className={`hover:text-indigo-600 transition flex items-center gap-1.5 ${
                  location.pathname === '/student/certificates' ? 'text-indigo-600 font-semibold' : ''
                }`}
              >
                <Award className="w-4 h-4" />
                Certificates
              </Link>
            </>
          )}

          {isInstructor && (
            <Link
              to="/instructor"
              className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition"
            >
              <Briefcase className="w-4 h-4" />
              Instructor Studio
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-rose-100 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right: Auth Action or User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1 pl-2 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition"
              >
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 uppercase text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    {isInstructor && (
                      <Link
                        to="/instructor"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Instructor Studio
                      </Link>
                    )}

                    {isStudent && (
                      <>
                        <Link
                          to="/student/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Student Dashboard
                        </Link>
                        <Link
                          to="/student/my-courses"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          My Courses
                        </Link>
                        <Link
                          to="/student/certificates"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <Award className="w-4 h-4 text-slate-400" />
                          Earned Certificates
                        </Link>
                      </>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login?role=admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition shadow-xs"
                title="Access Admin Control Center"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin Login</span>
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-md shadow-indigo-200 transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm border-0 focus:ring-2 focus:ring-indigo-500"
            />
          </form>

          <div className="space-y-1 pt-2">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Catalog
            </Link>

            {isStudent && (
              <>
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/student/my-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
                >
                  My Courses
                </Link>
                <Link
                  to="/student/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
                >
                  Wishlist
                </Link>
                <Link
                  to="/student/certificates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100"
                >
                  Certificates
                </Link>
              </>
            )}

            {isInstructor && (
              <Link
                to="/instructor"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-indigo-700 bg-indigo-50"
              >
                Instructor Studio
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-medium text-rose-700 bg-rose-50"
              >
                Admin Control Center
              </Link>
            )}

            {!user && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link
                  to="/login?role=admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-rose-700 bg-rose-50 border border-rose-200"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  Admin Login
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl font-bold text-white bg-indigo-600 text-center shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
