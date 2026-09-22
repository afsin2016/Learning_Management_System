import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CheckCircle, Search, Award } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/instructor/students');
        if (res.data.success) {
          setStudents(res.data.students);
        }
      } catch (err) {
        console.error('Error fetching instructor students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <Loader message="Loading student enrollments..." size="large" />;
  }

  const filtered = students.filter(
    (s) =>
      s.student?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.course?.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Enrolled Students</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track student progress, completions, and cohort engagement across all your courses.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No student enrollments found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once students enroll in your published courses, their real-time progress will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6">Enrolled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((item) => (
                  <tr key={item.enrollmentId} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.student?.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                          }
                          alt={item.student?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.student?.name}</p>
                          <p className="text-[11px] text-slate-400">{item.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 max-w-xs truncate">
                      {item.course?.title}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              item.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${item.progress || 0}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{item.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {item.isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          <Award className="w-3 h-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-slate-400">
                      {new Date(item.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudents;
