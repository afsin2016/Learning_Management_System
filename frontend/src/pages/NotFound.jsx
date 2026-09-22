import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The lecture or resource you are looking for does not exist or may have been relocated.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
