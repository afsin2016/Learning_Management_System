import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import CourseCard from '../../components/common/CourseCard';
import Loader from '../../components/common/Loader';

const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist');
        if (res.data.success) {
          setCourses(res.data.wishlist);
        }
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleWishlistChange = (courseId, isWishlisted) => {
    if (!isWishlisted) {
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
    }
  };

  if (loading) {
    return <Loader message="Loading your wishlist..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Wishlist
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Courses you have saved for later study.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our curriculum catalog and click the heart icon on courses you want to enroll in later.
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-200"
          >
            Explore Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
