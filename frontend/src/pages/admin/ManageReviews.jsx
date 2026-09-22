import React, { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import api from '../../api/axios';
import RatingStars from '../../components/common/RatingStars';
import Loader from '../../components/common/Loader';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Delete this review permanently?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        fetchReviews();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting review');
      }
    }
  };

  if (loading) {
    return <Loader message="Loading platform review database..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Review Moderation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor community feedback, audit ratings, and remove spam or abusive reviews.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No reviews found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Student</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            r.student?.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                          }
                          alt={r.student?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900">{r.student?.name}</span>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-800 max-w-xs truncate">
                      {r.course?.title}
                    </td>

                    <td className="p-4">
                      <RatingStars rating={r.rating} showScore={true} />
                    </td>

                    <td className="p-4 text-slate-600 max-w-md truncate">
                      "{r.comment}"
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => handleDeleteReview(r._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

export default ManageReviews;
