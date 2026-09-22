import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/common/CourseCard';
import Loader from '../components/common/Loader';

const BrowseCourses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || 'All Levels');
  const [priceType, setPriceType] = useState(searchParams.get('priceType') || 'all');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Data states
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses whenever filters change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedLevel && selectedLevel !== 'All Levels') params.append('level', selectedLevel);
        if (priceType && priceType !== 'all') params.append('priceType', priceType);
        if (minRating) params.append('minRating', minRating);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 9);

        setSearchParams(params, { replace: true });

        const res = await api.get(`/courses?${params.toString()}`);
        if (res.data.success) {
          setCourses(res.data.courses);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [keyword, selectedCategory, selectedLevel, priceType, minRating, sort, page]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedLevel('All Levels');
    setPriceType('all');
    setMinRating('');
    setSort('popular');
    setPage(1);
  };

  const hasActiveFilters =
    keyword !== '' ||
    selectedCategory !== '' ||
    selectedLevel !== 'All Levels' ||
    priceType !== 'all' ||
    minRating !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Explore Courses</h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover high-yield technical and creative courses taught by industry practitioners.
        </p>
      </div>

      {/* Main layout with sticky filter sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filter Courses
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Category
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                  }}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
                    selectedCategory === ''
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      setPage(1);
                    }}
                    className={`w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition ${
                      selectedCategory === cat._id
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">
                      {cat.courseCount || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Course Level
              </label>
              <div className="space-y-1">
                {['All Levels', 'Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                  <label
                    key={lvl}
                    className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="level"
                      checked={selectedLevel === lvl}
                      onChange={() => {
                        setSelectedLevel(lvl);
                        setPage(1);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    {lvl}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Price
              </label>
              <div className="space-y-1">
                {[
                  { label: 'All Prices', val: 'all' },
                  { label: 'Free Only', val: 'free' },
                  { label: 'Paid Only', val: 'paid' },
                ].map((p) => (
                  <label
                    key={p.val}
                    className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="priceType"
                      checked={priceType === p.val}
                      onChange={() => {
                        setPriceType(p.val);
                        setPage(1);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(e.target.value);
                  setPage(1);
                }}
                className="w-full p-2 bg-slate-50 text-xs rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">★ 4.5 and up</option>
                <option value="4.0">★ 4.0 and up</option>
                <option value="3.5">★ 3.5 and up</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Bar: Results Count, Mobile Filter Trigger, Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-sm font-semibold text-slate-700">
                Showing <span className="text-indigo-600 font-bold">{total}</span> courses
              </span>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                Filters
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Course Grid */}
          {loading ? (
            <Loader message="Fetching course catalog..." />
          ) : courses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We couldn't find any courses matching your specific filter criteria. Try resetting or broadening your search.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                    page === i + 1
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseCourses;
