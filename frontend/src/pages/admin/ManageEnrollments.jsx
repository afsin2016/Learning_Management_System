import React, { useState, useEffect } from 'react';
import { DollarSign, Search, CheckCircle, CreditCard } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEnrollments();
  }, [page]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/enrollments?page=${page}`);
      if (res.data.success) {
        setEnrollments(res.data.enrollments);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching admin enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading enrollment audit logs..." size="large" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Enrollments & Revenue</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete audit trail of all student course enrollments and completed transactions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4 pl-6">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Price Paid</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4 pr-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {enrollments.map((e) => (
                <tr key={e._id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          e.student?.avatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                        }
                        alt={e.student?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{e.student?.name}</p>
                        <p className="text-[11px] text-slate-400">{e.student?.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-medium text-slate-800 max-w-xs truncate">
                    {e.course?.title}
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    {e.pricePaid === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${e.pricePaid?.toFixed(2)}`
                    )}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <CreditCard className="w-3 h-3 text-slate-400" />
                      {e.payment?.paymentMethod || 'Free Checkout'}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px] text-slate-400">
                    {e.payment?.transactionId || 'N/A'}
                  </td>

                  <td className="p-4 pr-6 text-slate-400">
                    {new Date(e.enrolledAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageEnrollments;
