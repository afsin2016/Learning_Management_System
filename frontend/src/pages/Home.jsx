import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Award,
  Users,
  PlayCircle,
  CheckCircle,
  TrendingUp,
  Laptop,
  Code,
  Brain,
  Palette,
  Cloud,
  Briefcase,
  Star,
} from 'lucide-react';
import api from '../api/axios';
import CourseCard from '../components/common/CourseCard';
import Loader from '../components/common/Loader';

const iconMap = {
  Code: Code,
  Brain: Brain,
  Palette: Palette,
  Cloud: Cloud,
  Briefcase: Briefcase,
  BookOpen: BookOpen,
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catRes] = await Promise.all([
          api.get('/courses/featured'),
          api.get('/categories'),
        ]);
        if (coursesRes.data.success) {
          setFeaturedCourses(coursesRes.data.courses);
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Next-Generation Learning Experience
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Master High-Impact Skills with{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  World-Class Mentors
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Accelerate your career with interactive video classrooms, real-world capstone projects, automated quizzes, and globally verifiable completion credentials.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition group text-sm"
                >
                  Explore Course Catalog
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register?role=instructor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 shadow-sm transition text-sm"
                >
                  Teach on ApexLMS
                </Link>
              </div>

              {/* Stats badges */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-6 text-center sm:text-left max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">85,000+</p>
                  <p className="text-xs font-medium text-slate-500">Active Students</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-indigo-600">4.9 / 5.0</p>
                  <p className="text-xs font-medium text-slate-500">Student Rating</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
                  <p className="text-xs font-medium text-slate-500">Verified Certificates</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&auto=format&fit=crop&q=80"
                  alt="Students Collaborating"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-xs font-bold text-white ml-1">4.9 Star Rating</span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug">
                    "ApexLMS transformed how our engineering teams upskill in distributed systems."
                  </h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Verified Learner • Full Stack Bootcamp Graduate
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Official Certificate</p>
                  <p className="text-[11px] text-slate-400">Issued automatically at 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
              Browse by Subject
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Explore Top Categories
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => {
            const IconComponent = iconMap[cat.icon] || BookOpen;
            return (
              <div
                key={cat._id}
                onClick={() => navigate(`/courses?category=${cat._id}`)}
                className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                  <span>{cat.courseCount || 0} Courses</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
              Handpicked Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured & Trending Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Browse All {featuredCourses.length > 0 ? `(${featuredCourses.length})` : ''}{' '}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Loading curated courses..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Why ApexLMS
            </span>
            <h2 className="text-3xl font-extrabold mt-2">
              Engineered for Real-World Learning
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Everything students and educators need to build, track, and master technical skills without friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <PlayCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Distraction-Free Classroom</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Stream video lectures with instant navigation, code resources, and real-time progress syncing across all devices.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Interactive Quizzes & Grading</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Reinforce knowledge with timed multiple-choice assessments, comprehensive explanations, and instantaneous grade calculation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Verifiable Digital Certificates</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Earn a tamper-proof certificate upon 100% course completion, featuring a unique verification link for LinkedIn or resumes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Teach What You Love
            </span>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              Share Your Expertise with Millions of Global Learners
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Create curriculum modules, upload video lectures, build quizzes, and monetize your technical knowledge with our powerful Instructor Studio.
            </p>
            <div className="pt-4">
              <Link
                to="/register?role=instructor"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 shadow-md transition text-sm"
              >
                Apply as Instructor <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
