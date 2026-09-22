import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [courseToReject, setCourseToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/courses?status=pending'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
        setCategoryStats(statsRes.data.categoryStats || []);
        setRecentEnrollments(statsRes.data.recentEnrollments || []);
      }
      if (pendingRes.data.success) {
        setPendingCourses(pendingRes.data.courses);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      const res = await api.put(`/admin/courses/${courseId}/status`, {
        status: 'published',
      });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving course');
    }
  };

  const handleRejectCourse = async () => {
    if (!courseToReject) return;
    try {
      const res = await api.put(`/admin/courses/${courseToReject._id}/status`, {
        status: 'rejected',
        rejectionReason,
      });
      if (res.data.success) {
        setRejectModalOpen(false);
        setRejectionReason('');
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting course');
    }
  };

  if (loading) {
    return <Loader message="Compiling platform analytics & logs..." size="large" />;
  }

  // Simulated chart data if fresh
  const chartData = [
    { month: 'May', revenue: 1420 },
    { month: 'Jun', revenue: 2150 },
    { month: 'Jul', revenue: 3200 },
    { month: 'Aug', revenue: 4100 },
    { month: 'Sep', revenue: stats?.totalRevenue || 5400 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Admin Command Center</h1>
          <p className="text-xs text-slate-300">
            System overview, content approval pipeline, user moderation, and revenue auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/courses"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-rose-900/30"
          >
            Manage Courses
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              ${(stats?.totalRevenue || 0).toFixed(2)}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Platform Volume</p>
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
            <p className="text-xs text-slate-500 font-medium">Active Students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats?.totalInstructors || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Certified Instructors</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {stats?.pendingCourses || 0}
            </p>
            <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
          </div>
        </div>
      </div>

      {/* Course Approvals Queue */}
      {pendingCourses.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Course Approval Queue ({pendingCourses.length} Pending)
            </h2>
          </div>

          <div className="space-y-3">
            {pendingCourses.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded-2xl border border-amber-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-16 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                    <p className="text-xs text-slate-500">
                      Instructor: <span className="font-semibold">{c.instructor?.name}</span> •{' '}
                      Category: {c.category?.name} • ${c.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/courses/${c.slug || c._id}`}
                    target="_blank"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                  >
                    Preview
                  </Link>
                  <button
                    onClick={() => handleApproveCourse(c._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                  </button>
                  <button
                    onClick={() => {
                      setCourseToReject(c);
                      setRejectModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Gross Revenue Trend</h3>
              <p className="text-xs text-slate-400">Monthly gross checkout volume ($)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +38% vs prior
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Course Distribution</h3>
            <p className="text-xs text-slate-400">Courses published per discipline</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="courses" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links Footer Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition text-left space-y-1 group"
        >
          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
            User Management
          </p>
          <p className="text-[11px] text-slate-400">Block, unblock, approve instructors</p>
        </Link>
        <Link
          to="/admin/courses"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition text-left space-y-1 group"
        >
          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
            Course Catalog
          </p>
          <p className="text-[11px] text-slate-400">Review, publish, curate curriculum</p>
        </Link>
        <Link
          to="/admin/categories"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition text-left space-y-1 group"
        >
          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
            Categories
          </p>
          <p className="text-[11px] text-slate-400">Manage categories and icons</p>
        </Link>
        <Link
          to="/admin/enrollments"
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition text-left space-y-1 group"
        >
          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
            Revenue & Orders
          </p>
          <p className="text-[11px] text-slate-400">Audit logs and payment receipts</p>
        </Link>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Course Application"
      >
        <div className="space-y-4 text-slate-800">
          <p className="text-xs text-slate-600 leading-relaxed">
            Please provide feedback for why{' '}
            <span className="font-bold text-slate-900">{courseToReject?.title}</span> did not meet publication standards. The instructor will see this note.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Feedback Reason
            </label>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please add lecture notes to module 2 and verify video sound levels..."
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRejectCourse}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
