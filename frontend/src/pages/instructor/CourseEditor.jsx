import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';

const CourseEditor = () => {
  const { id } = useParams(); // If id exists, edit mode, else create mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Course Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
  );
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [level, setLevel] = useState('All Levels');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('8 hours');
  const [requirements, setRequirements] = useState(['Basic computer knowledge']);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(['Core technical fundamentals']);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          if (!isEditMode && catRes.data.categories.length > 0) {
            setCategory(catRes.data.categories[0]._id);
          }
        }

        if (isEditMode) {
          const courseRes = await api.get(`/courses/${id}`);
          if (courseRes.data.success) {
            const c = courseRes.data.course;
            setTitle(c.title || '');
            setSubtitle(c.subtitle || '');
            setDescription(c.description || '');
            setThumbnail(c.thumbnail || '');
            setCategory(c.category?._id || c.category || '');
            setPrice(c.price || 0);
            setDiscountPrice(c.discountPrice || 0);
            setLevel(c.level || 'All Levels');
            setLanguage(c.language || 'English');
            setDuration(c.duration || '8 hours');
            setRequirements(c.requirements?.length > 0 ? c.requirements : ['']);
            setWhatYouWillLearn(c.whatYouWillLearn?.length > 0 ? c.whatYouWillLearn : ['']);
          }
        }
      } catch (err) {
        console.error('Error fetching course editor data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleArrayChange = (setter, list, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const handleAddArrayItem = (setter, list) => {
    setter([...list, '']);
  };

  const handleRemoveArrayItem = (setter, list, index) => {
    if (list.length > 1) {
      setter(list.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      title,
      subtitle,
      description,
      thumbnail,
      category,
      price: Number(price),
      discountPrice: Number(discountPrice),
      level,
      language,
      duration,
      requirements: requirements.filter((r) => r.trim() !== ''),
      whatYouWillLearn: whatYouWillLearn.filter((w) => w.trim() !== ''),
    };

    try {
      if (isEditMode) {
        const res = await api.put(`/courses/${id}`, payload);
        if (res.data.success) {
          navigate(`/instructor/courses/${id}/curriculum`);
        }
      } else {
        const res = await api.post('/courses', payload);
        if (res.data.success) {
          navigate(`/instructor/courses/${res.data.course._id}/curriculum`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading course editor..." size="large" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/instructor/courses"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEditMode ? 'Edit Course Details' : 'Create New Course'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure course metadata, pricing, and learning objectives.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-xs bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900">Course Information</h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Full-Stack React & Node.js"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Course Subtitle (Brief Headline)
            </label>
            <input
              type="text"
              required
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Build and deploy enterprise web architectures from scratch."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Category
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Course Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Description
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="In-depth details about the curriculum, projects, and target audience..."
              className="w-full p-4 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Media & Pricing */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900">Media & Pricing</h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Thumbnail Image URL
            </label>
            <input
              type="url"
              required
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Standard Price ($ USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Set 0 for Free course</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Discount Price ($ USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 12 hours"
                className="w-full px-4 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Learning Objectives & Requirements */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">What Students Will Learn</h2>
            <button
              type="button"
              onClick={() => handleAddArrayItem(setWhatYouWillLearn, whatYouWillLearn)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Objective
            </button>
          </div>

          <div className="space-y-2">
            {whatYouWillLearn.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(setWhatYouWillLearn, whatYouWillLearn, index, e.target.value)
                  }
                  placeholder={`Learning outcome #${index + 1}`}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveArrayItem(setWhatYouWillLearn, whatYouWillLearn, index)
                  }
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Requirements</h2>
            <button
              type="button"
              onClick={() => handleAddArrayItem(setRequirements, requirements)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Requirement
            </button>
          </div>

          <div className="space-y-2">
            {requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(setRequirements, requirements, index, e.target.value)
                  }
                  placeholder={`Requirement #${index + 1}`}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveArrayItem(setRequirements, requirements, index)
                  }
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/instructor/courses"
            className="px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-200 transition"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving Course...' : isEditMode ? 'Save & Continue to Curriculum' : 'Create & Build Curriculum'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEditor;
