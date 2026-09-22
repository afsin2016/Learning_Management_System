import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Code');
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Code');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Code');
    setModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setActionMsg({ type: '', text: '' });
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, {
          name,
          description,
          icon,
        });
        setActionMsg({ type: 'success', text: 'Category updated successfully!' });
      } else {
        await api.post('/categories', { name, description, icon });
        setActionMsg({ type: 'success', text: 'Category created successfully!' });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.message || 'Error saving category',
      });
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${catId}`);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize knowledge domains, disciplines, and curriculum classifications.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
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

      {loading ? (
        <Loader message="Loading platform categories..." size="large" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-4 pl-6">Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Published Courses</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900">{cat.name}</span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-400">/{cat.slug}</td>

                    <td className="p-4 text-slate-500 max-w-sm truncate">
                      {cat.description || '—'}
                    </td>

                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                        {cat.courseCount || 0}
                      </span>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Category Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cybersecurity & Cloud"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Icon Key
            </label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 font-medium"
            >
              <option value="Code">Code</option>
              <option value="Brain">Brain (AI)</option>
              <option value="Palette">Palette (Design)</option>
              <option value="Cloud">Cloud (DevOps)</option>
              <option value="Briefcase">Briefcase (Business)</option>
              <option value="BookOpen">BookOpen (General)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of this subject area..."
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
