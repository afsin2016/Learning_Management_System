import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, CheckCircle, Globe, Share2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Apex<span className="text-indigo-400">LMS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              The premier learning management ecosystem for modern software engineers, design leaders, and tech pioneers. Learn by building real production architectures.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> MongoDB Powered
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-3 py-1 rounded-full">
                <Shield className="w-3.5 h-3.5" /> JWT Secured
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-white transition">
                  Browse All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses?level=Beginner" className="hover:text-white transition">
                  Beginner Friendly
                </Link>
              </li>
              <li>
                <Link to="/courses?priceType=free" className="hover:text-white transition">
                  Free Workshops
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate/CERT-LMS-2026-ALPHA1" className="hover:text-white transition">
                  Verify Credentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register?role=instructor" className="hover:text-white transition">
                  Become an Instructor
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Instructor Studio
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Admin Control Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> React 19 + Vite
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Node.js + Express
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> MongoDB & Mongoose
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Tailwind CSS
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Recharts Analytics
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ApexLMS. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with modern MERN Architecture for production deployment.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
