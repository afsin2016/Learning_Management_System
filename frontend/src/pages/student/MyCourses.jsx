import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, PlayCircle, Search, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'in-progress', 'completed'
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/enrollments/my-courses');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Loader message="Loading your enrolled courses..." size="large" />;
  }

  const filteredCourses = courses.filter((item) => {
    const matchesSearch = item.course.title
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'in-progress') return !item.progress?.isCompleted;
    if (filter === 'completed') return item.progress?.isCompleted;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Courses</h1>
        <p className="text-sm text-slate-500 mt-1">
          Access your enrolled technical curriculum and resume your progress anytime.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {[
            { id: 'all', label: `All (${courses.length})` },
            {
              id: 'in-progress',
              label: `In Progress (${courses.filter((c) => !c.progress?.isCompleted).length})`,
            },
            {
              id: 'completed',
              label: `Completed (${courses.filter((c) => c.progress?.isCompleted).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                filter === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or explore the catalog to enroll in exciting new topics.
          </p>
          <Link
            to="/courses"
            className="inline-flex px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((item) => {
            const { course, progress } = item;
            const percentage = progress?.percentage || 0;
            const isCompleted = progress?.isCompleted;

            return (
              <div
                key={item.enrollmentId}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition duration-300"
              >
                <div>
                  <div className="aspect-video relative bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {isCompleted ? (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                        {percentage}% Complete
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>{isCompleted ? 'Course Finished' : `${percentage}% Completed`}</span>
                        <span>{course.duration || 'Self-paced'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <Link
                    to={`/learn/${course._id}`}
                    className={`w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
                      isCompleted
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                    }`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    {isCompleted ? 'Review Classroom' : 'Continue Learning'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
