import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ExternalLink, Copy, Check, Calendar, User, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await api.get('/certificates/my-certificates');
        if (res.data.success) {
          setCertificates(res.data.certificates);
        }
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleCopyLink = (certId) => {
    const url = `${window.location.origin}/verify-certificate/${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return <Loader message="Loading your earned credentials..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Award className="w-8 h-8 text-amber-500" /> Earned Certificates
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Official, digitally signed completion certificates verifying your technical mastery.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No certificates earned yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Complete 100% of all lectures and quizzes in any enrolled course to automatically unlock your official certificate.
          </p>
          <Link
            to="/student/my-courses"
            className="inline-flex px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-200"
          >
            Resume Learning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-5 hover:shadow-xl hover:border-indigo-200 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Verified Credential
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {cert.certificateId}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
                    {cert.course?.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={cert.instructor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={cert.instructor?.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-slate-600">
                      Taught by <span className="font-semibold">{cert.instructor?.name}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>100% Completion</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/verify-certificate/${cert.certificateId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition"
                >
                  <ExternalLink className="w-4 h-4" /> View Diploma
                </Link>

                <button
                  onClick={() => handleCopyLink(cert.certificateId)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                  title="Copy shareable link"
                >
                  {copiedId === cert.certificateId ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Check className="w-4 h-4" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-4 h-4" /> Share Link
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
