import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Calendar,
  User,
  BookOpen,
  Search,
  CheckCircle2,
  Printer,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import api from '../api/axios';
import Loader from '../components/common/Loader';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(certificateId || '');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (certificateId) {
      const fetchCert = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get(`/certificates/verify/${certificateId}`);
          if (res.data.success && res.data.certificate) {
            setCertData(res.data.certificate);
          }
        } catch (err) {
          setError(
            err.response?.data?.message || 'Certificate not found. This credential could not be verified.'
          );
          setCertData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchCert();
    } else {
      setLoading(false);
    }
  }, [certificateId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/verify-certificate/${searchId.trim()}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search header bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                ApexLMS Credential Verification
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify the authenticity of any completion certificate issued by ApexLMS.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Certificate ID..."
                className="px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-60"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition"
              >
                Verify
              </button>
            </form>
          </div>
        </div>

        {/* Certificate Result */}
        {loading ? (
          <Loader message="Verifying digital signature & credentials..." size="large" />
        ) : error ? (
          <div className="bg-white p-12 rounded-3xl border border-rose-200 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Verification Failed</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">{error}</p>
            <div className="pt-2">
              <Link
                to="/courses"
                className="inline-flex px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition"
              >
                Explore Valid Courses
              </Link>
            </div>
          </div>
        ) : certData ? (
          <div className="space-y-6">
            {/* Status Pill & Action Buttons */}
            <div className="flex items-center justify-between print:hidden">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Officially Verified Credential
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>

            {/* Official Diploma Certificate Layout */}
            <div className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-slate-800 shadow-2xl relative overflow-hidden print:border-4 print:p-8">
              {/* Corner Watermarks */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-50/50 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-50/50 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-6 relative">
                {/* Crest */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-200">
                  <Award className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">
                    ApexLMS Academy of Technology
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif">
                    Certificate of Completion
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    This credential certifies that
                  </p>
                </div>

                {/* Recipient Name */}
                <div className="py-2 border-b-2 border-indigo-600/30 max-w-md mx-auto">
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-wide">
                    {certData.student?.name}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                  has successfully completed 100% of all lectures, assignments, and comprehensive
                  assessments for the technical course
                </p>

                {/* Course Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-indigo-950 font-serif">
                  {certData.course?.title}
                </h3>

                {/* Footer Signatures & Metadata */}
                <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-slate-200">
                  {/* Instructor */}
                  <div className="text-center sm:text-left space-y-1">
                    <p className="text-sm font-bold text-slate-900">
                      {certData.instructor?.name || 'Lead Instructor'}
                    </p>
                    <p className="text-[11px] text-slate-400">Course Instructor & Expert</p>
                  </div>

                  {/* Stamp / Seal */}
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-dashed border-amber-500 flex items-center justify-center mx-auto text-amber-600 p-2">
                      <span className="text-[9px] font-black uppercase text-center leading-tight">
                        ApexLMS Verified Seal
                      </span>
                    </div>
                  </div>

                  {/* Date & ID */}
                  <div className="text-center sm:text-right space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      {new Date(certData.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      ID: {certData.certificateId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-md text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Search for a Certificate</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Please enter an official Certificate ID in the search box above to verify its authenticity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
