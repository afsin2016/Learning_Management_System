import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  Filter,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, search, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      params.append('page', page);

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`);
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  const handleApproveInstructor = async (userId, isApproved) => {
    try {
      const res = await api.put(`/admin/instructors/${userId}/approval`, {
        isApproved,
      });
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating instructor approval');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, moderate, block/unblock accounts, and approve instructor onboarding.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader message="Loading platform users..." size="large" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Instructor Approval</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                          }
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block uppercase text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : u.role === 'instructor'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.status === 'blocked' ? 'Suspended' : 'Active'}
                      </span>
                    </td>

                    <td className="p-4">
                      {u.role === 'instructor' ? (
                        u.instructorDetails?.isApproved ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveInstructor(u._id, true)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproveInstructor(u._id, false)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(u._id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            u.status === 'blocked'
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {u.status === 'blocked' ? 'Unblock User' : 'Block User'}
                        </button>
                      )}
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

export default ManageUsers;
