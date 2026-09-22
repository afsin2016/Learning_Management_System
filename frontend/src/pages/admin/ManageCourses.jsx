import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [courseToReject, setCourseToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [statusFilter, search, page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      params.append('page', page);

      const res = await api.get(`/admin/courses?${params.toString()}`);
      if (res.data.success) {
        setCourses(res.data.courses);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId) => {
    try {
      const res = await api.put(`/admin/courses/${courseId}/status`, {
        status: 'published',
      });
      if (res.data.success) {
        fetchCourses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error approving course');
    }
  };

  const handleReject = async () => {
    if (!courseToReject) return;
    try {
      const res = await api.put(`/admin/courses/${courseToReject._id}/status`, {
        status: 'rejected',
        rejectionReason,
      });
      if (res.data.success) {
        setRejectModalOpen(false);
        setRejectionReason('');
        fetchCourses();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error rejecting course');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      try {
        const res = await api.delete(`/courses/${courseId}`);
        if (res.data.success) {
          fetchCourses();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting course');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Course Governance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review curriculum quality, approve pending submissions, or reject non-compliant courses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by course title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <Loader message="Loading courses..." size="large" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Course</th>
                  <th className="p-4">Instructor</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-9 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="truncate max-w-xs">
                          <p className="font-bold text-slate-900 truncate">{course.title}</p>
                          <span className="text-[11px] text-slate-400">
                            {course.enrolledCount} enrolled
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-700">
                      {course.instructor?.name || 'Instructor'}
                    </td>

                    <td className="p-4 text-slate-500">
                      {course.category?.name || 'Category'}
                    </td>

                    <td className="p-4 font-bold text-slate-900">
                      ${course.price.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block uppercase text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          course.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : course.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : course.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/courses/${course.slug || course._id}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                          title="Preview Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {course.status !== 'published' && (
                          <button
                            onClick={() => handleApprove(course._id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                          >
                            Approve
                          </button>
                        )}

                        {course.status !== 'rejected' && (
                          <button
                            onClick={() => {
                              setCourseToReject(course);
                              setRejectModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition"
                          >
                            Reject
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Course Application"
      >
        <div className="space-y-4 text-slate-800">
          <p className="text-xs text-slate-600">
            Provide the reason why{' '}
            <span className="font-bold text-slate-900">{courseToReject?.title}</span> is being rejected:
          </p>

          <textarea
            rows={3}
            required
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Feedback for the instructor..."
            className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
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

export default ManageCourses;
