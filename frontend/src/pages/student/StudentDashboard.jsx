import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, certsRes] = await Promise.all([
          api.get('/enrollments/my-courses'),
          api.get('/certificates/my-certificates'),
        ]);

        if (coursesRes.data.success) {
          setEnrolledCourses(coursesRes.data.courses);
        }
        if (certsRes.data.success) {
          setCertificates(certsRes.data.certificates);
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader message="Loading your student learning dashboard..." size="large" />;
  }

  const completedCount = enrolledCourses.filter((c) => c.progress?.isCompleted).length;
  const inProgressCount = enrolledCourses.length - completedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Student Learning Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-indigo-100 text-sm leading-relaxed">
            You are making steady progress! Continue where you left off or explore new courses to expand your technical competencies.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{enrolledCourses.length}</p>
            <p className="text-xs text-slate-500 font-medium">Enrolled Courses</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{inProgressCount}</p>
            <p className="text-xs text-slate-500 font-medium">In Progress</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{completedCount}</p>
            <p className="text-xs text-slate-500 font-medium">Completed</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{certificates.length}</p>
            <p className="text-xs text-slate-500 font-medium">Certificates Earned</p>
          </div>
        </div>
      </div>

      {/* In-Progress Courses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
          <Link
            to="/student/my-courses"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            All Courses ({enrolledCourses.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">You haven't enrolled in any courses yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our comprehensive course catalog to kickstart your learning journey.
            </p>
            <Link
              to="/courses"
              className="inline-flex px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((item) => {
              const { course, progress } = item;
              const percentage = progress?.percentage || 0;
              return (
                <div
                  key={item.enrollmentId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="aspect-video relative bg-slate-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                        {percentage}% Complete
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              progress?.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                          <span>{progress?.isCompleted ? 'Completed' : 'In Progress'}</span>
                          <span>{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      to={`/learn/${course._id}`}
                      className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
                        progress?.isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                      }`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {progress?.isCompleted ? 'Review Lectures' : 'Resume Lesson'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Earned Certificates Highlight */}
      {certificates.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Earned Credentials</h2>
            <Link
              to="/student/certificates"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All Certificates ({certificates.length}) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {cert.course?.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Issued on {new Date(cert.issueDate).toLocaleDateString()} • ID: {cert.certificateId}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/verify-certificate/${cert.certificateId}`}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition shrink-0"
                >
                  View Credential
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
