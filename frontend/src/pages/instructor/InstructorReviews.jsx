import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import RatingStars from '../../components/common/RatingStars';
import Loader from '../../components/common/Loader';

const InstructorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/instructor/reviews');
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching instructor reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <Loader message="Loading student reviews & ratings..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Student Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">
          Feedback and star ratings submitted by students across all your courses.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No reviews received yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Reviews posted by your enrolled students will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      r.student?.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                    }
                    alt={r.student?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.student?.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <RatingStars rating={r.rating} showScore={false} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                "{r.comment}"
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                <span>Course:</span>
                <span className="font-bold text-slate-700 truncate max-w-xs">
                  {r.course?.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;
