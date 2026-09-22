import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Clock, BarChart, Users } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const CourseCard = ({ course, isWishlisted: initialWishlisted = false, onWishlistChange }) => {
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }
    if (!isStudent) return;

    try {
      setLoadingWishlist(true);
      const res = await api.post(`/wishlist/toggle/${course._id}`);
      if (res.data.success) {
        setIsWishlisted(res.data.isWishlisted);
        if (onWishlistChange) onWishlistChange(course._id, res.data.isWishlisted);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const isFree = course.price === 0;
  const hasDiscount = !isFree && course.discountPrice > 0 && course.discountPrice < course.price;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail */}
      <Link to={`/courses/${course.slug || course._id}`} className="relative overflow-hidden aspect-video block bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-full text-indigo-600 shadow-sm">
          {course.category?.name || 'General'}
        </span>

        {/* Level Badge */}
        <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-medium px-2 py-0.5 rounded">
          {course.level || 'All Levels'}
        </span>

        {/* Wishlist Button (Only for students / guests) */}
        {(!user || isStudent) && (
          <button
            onClick={handleWishlistToggle}
            disabled={loadingWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-md'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-600 shadow-sm'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`}
            />
          </button>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-2">
            <RatingStars
              rating={course.rating || 0}
              reviewsCount={course.numReviews || 0}
            />
            {course.enrolledCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <Users className="w-3 h-3 text-slate-400" />
                {course.enrolledCount} enrolled
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/courses/${course.slug || course._id}`}>
            <h3 className="font-bold text-slate-800 text-base line-clamp-2 hover:text-indigo-600 transition-colors">
              {course.title}
            </h3>
          </Link>

          {/* Instructor info */}
          <div className="flex items-center gap-2 mt-3">
            <img
              src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={course.instructor?.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-xs text-slate-600 font-medium truncate">
              {course.instructor?.name || 'Instructor'}
            </span>
          </div>
        </div>

        {/* Footer info & Price */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{course.duration || 'Flexible'}</span>
          </div>

          <div className="text-right">
            {isFree ? (
              <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Free
              </span>
            ) : hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs line-through text-slate-400 font-medium">
                  ${course.price.toFixed(2)}
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  ${course.discountPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-extrabold text-slate-900">
                ${course.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
