import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Edit,
  Trash2,
  BookOpen,
  Send,
  AlertCircle,
  CheckCircle2,
  Layers,
  Clock,
  Eye,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/courses/instructor/my-courses');
      if (res.data.success) {
        setCourses(res.data.courses);
      }
    } catch (err) {
      console.error('Error fetching instructor courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (courseId) => {
    try {
      const res = await api.put(`/courses/${courseId}/submit`);
      if (res.data.success) {
        setActionMsg({
          type: 'success',
          text: 'Course submitted for admin review successfully!',
        });
        fetchCourses();
      }
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error submitting course',
      });
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      const res = await api.delete(`/courses/${courseToDelete._id}`);
      if (res.data.success) {
        setActionMsg({ type: 'success', text: 'Course deleted successfully' });
        setDeleteModalOpen(false);
        fetchCourses();
      }
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error deleting course',
      });
    }
  };

  if (loading) {
    return <Loader message="Loading your created courses..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Manage Courses</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build, edit, configure curriculum modules, and submit courses for platform publication.
          </p>
        </div>

        <Link
          to="/instructor/courses/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Create Course
        </Link>
      </div>

      {actionMsg.text && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            actionMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {actionMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{actionMsg.text}</span>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No courses created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't authored any courses. Start by creating your first course framework today!
          </p>
          <Link
            to="/instructor/courses/new"
            className="inline-flex px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition"
            >
              {/* Thumbnail & Title */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-24 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                        course.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : course.status === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : course.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {course.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {course.category?.name}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{course.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>${course.price.toFixed(2)}</span>
                    <span>•</span>
                    <span>{course.enrolledCount} Students</span>
                    <span>•</span>
                    <span>{course.sections?.length || 0} Sections</span>
                  </div>

                  {course.status === 'rejected' && course.rejectionReason && (
                    <div className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">
                      <strong>Rejection Note from Admin:</strong> {course.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
                {course.status !== 'published' && course.status !== 'pending' && (
                  <button
                    onClick={() => handleSubmitForApproval(course._id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit for Approval
                  </button>
                )}

                <Link
                  to={`/instructor/courses/${course._id}/curriculum`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition"
                >
                  <Layers className="w-3.5 h-3.5" /> Curriculum & Quizzes
                </Link>

                <Link
                  to={`/instructor/courses/${course._id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Link>

                <button
                  onClick={() => {
                    setCourseToDelete(course);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Course Deletion"
      >
        <div className="space-y-4 text-slate-800">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <span className="font-bold text-slate-900">{courseToDelete?.title}</span>? This will also remove all associated sections and lecture materials.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteCourse}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl"
            >
              Delete Course
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InstructorCourses;
