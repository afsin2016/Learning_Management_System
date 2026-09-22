import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Users,
  BookOpen,
  Star,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const InstructorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [coursesSummary, setCoursesSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const res = await api.get('/instructor/stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentEnrollments(res.data.recentEnrollments);
          setCoursesSummary(res.data.coursesSummary);
        }
      } catch (err) {
        console.error('Error fetching instructor stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

  if (loading) {
    return <Loader message="Loading Instructor Studio analytics..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
            Instructor Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Teaching Overview</h1>
          <p className="text-xs text-slate-300">
            Monitor course performance, student engagement, and revenue analytics.
          </p>
        </div>

        <Link
          to="/instructor/courses/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Course
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              ${(stats?.totalEarnings || 0).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats?.totalStudents || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats?.totalCourses || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Created Courses</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats?.averageRating || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Grid: Course Performance & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Performance List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Courses</h2>
            <Link
              to="/instructor/courses"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {coursesSummary.map((c) => (
              <div
                key={c._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{c.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span
                      className={`uppercase text-[10px] font-black px-2 py-0.5 rounded-full ${
                        c.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : c.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span>{c.enrolledCount} enrolled</span>
                    <span>★ {c.rating} ({c.numReviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/instructor/courses/${c._id}/curriculum`}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    Curriculum
                  </Link>
                  <Link
                    to={`/instructor/courses/${c._id}/edit`}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-900">Recent Enrollments</h2>
          {recentEnrollments.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No recent student enrollments.</p>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100">
              {recentEnrollments.map((e) => (
                <div key={e._id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={e.student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={e.student?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {e.student?.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Enrolled in {e.course?.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
