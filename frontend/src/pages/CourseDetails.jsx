import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Check,
  PlayCircle,
  Clock,
  Globe,
  Award,
  BarChart,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Heart,
  FileText,
  HelpCircle,
  Lock,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/common/RatingStars';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';

const CourseDetails = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { user, isStudent } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [openSections, setOpenSections] = useState({});
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${identifier}`);
        if (res.data.success) {
          setCourse(res.data.course);
          setIsEnrolled(res.data.isEnrolled);

          // Open first section by default
          if (res.data.course.sections?.length > 0) {
            setOpenSections({ [res.data.course.sections[0]._id]: true });
          }

          // Fetch reviews
          const reviewsRes = await api.get(`/reviews/course/${res.data.course._id}`);
          if (reviewsRes.data.success) {
            setReviews(reviewsRes.data.reviews);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [identifier]);

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (course.price > 0 && course.discountPrice !== 0) {
      // Open mock payment checkout modal
      setCheckoutModalOpen(true);
    } else {
      // Direct free enrollment
      executeEnrollment('Free');
    }
  };

  const executeEnrollment = async (paymentMethod = 'Card') => {
    try {
      setEnrolling(true);
      const res = await api.post('/enrollments', {
        courseId: course._id,
        paymentMethod,
      });

      if (res.data.success) {
        setIsEnrolled(true);
        setCheckoutModalOpen(false);
        navigate(`/learn/${course._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/wishlist/toggle/${course._id}`);
      if (res.data.success) {
        setIsWishlisted(res.data.isWishlisted);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  if (loading) {
    return <Loader message="Loading course curriculum & details..." size="large" />;
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Course not found</h2>
        <Link to="/courses" className="text-indigo-600 font-semibold mt-4 inline-block">
          Return to Course Catalog
        </Link>
      </div>
    );
  }

  const isFree = course.price === 0;
  const currentPrice = course.discountPrice > 0 ? course.discountPrice : course.price;
  const totalLessons = (course.sections || []).reduce(
    (acc, sec) => acc + (sec.lessons?.length || 0),
    0
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Dark Header */}
      <section className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              {/* Category & Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Link to="/courses" className="hover:underline">
                  Courses
                </Link>
                <span>/</span>
                <span>{course.category?.name || 'Category'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed">{course.subtitle}</p>

              {/* Rating and Instructor row */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                <RatingStars
                  rating={course.rating || 0}
                  reviewsCount={course.numReviews || 0}
                />
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">
                  Created by{' '}
                  <span className="font-semibold text-white">
                    {course.instructor?.name || 'Instructor'}
                  </span>
                </span>
                <span className="text-slate-400">•</span>
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <Globe className="w-3.5 h-3.5" />
                  {course.language || 'English'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <BarChart className="w-3.5 h-3.5" />
                  {course.level || 'All Levels'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 lg:-mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Details Column */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1 pt-6 lg:pt-0">
            {/* What You'll Learn Box */}
            {course.whatYouWillLearn?.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">What you'll learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-700 leading-normal">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Course Curriculum</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.sections?.length || 0} sections • {totalLessons} lectures •{' '}
                    {course.duration || 'Flexible'} total length
                  </p>
                </div>
              </div>

              {/* Accordion */}
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden mt-4">
                {(course.sections || []).map((section, sIndex) => {
                  const isOpen = !!openSections[section._id];
                  return (
                    <div key={section._id || sIndex} className="bg-white">
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="w-full flex items-center justify-between p-4 text-left bg-slate-50/70 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                          <span className="text-sm font-bold text-slate-800">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {section.lessons?.length || 0} lectures
                        </span>
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-50 bg-white px-4 py-2">
                          {(section.lessons || []).map((lesson, lIndex) => (
                            <div
                              key={lesson._id || lIndex}
                              className="py-2.5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5">
                                {lesson.type === 'quiz' ? (
                                  <HelpCircle className="w-4 h-4 text-violet-500 shrink-0" />
                                ) : (
                                  <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="font-medium text-slate-700">
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {lesson.isFreePreview && (
                                  <button
                                    onClick={() => setPreviewVideoUrl(lesson.videoUrl || 'https://www.youtube.com/embed/SqcY0GlETPk')}
                                    className="text-indigo-600 font-bold hover:underline"
                                  >
                                    Preview
                                  </button>
                                )}
                                {!lesson.isFreePreview && !isEnrolled && (
                                  <Lock className="w-3 h-3 text-slate-300" />
                                )}
                                <span className="text-slate-400 font-medium">
                                  {lesson.duration || '10:00'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Requirements */}
            {course.requirements?.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Description */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Description</h3>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>

            {/* Instructor Bio */}
            {course.instructor && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Your Instructor</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={course.instructor.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-800">
                      {course.instructor.name}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-600">
                      {course.instructor.headline || 'Course Instructor'}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {course.instructor.bio ||
                        'Industry expert and technology educator passionate about teaching modern architectures.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Student Reviews */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Student Feedback</h3>
                <span className="text-xs text-slate-400 font-medium">
                  {reviews.length} total reviews
                </span>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No reviews submitted yet for this course.
                </p>
              ) : (
                <div className="space-y-4 divide-y divide-slate-100">
                  {reviews.map((r) => (
                    <div key={r._id} className="pt-4 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.student?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={r.student?.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-800">
                            {r.student?.name}
                          </span>
                        </div>
                        <RatingStars rating={r.rating} showScore={false} />
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Floating Purchase Box */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="sticky top-20 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Video Thumbnail & Preview Trigger */}
              <div
                className="relative aspect-video bg-slate-900 cursor-pointer group"
                onClick={() => setPreviewVideoUrl('https://www.youtube.com/embed/SqcY0GlETPk')}
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-8 h-8 fill-indigo-600 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-3 inset-x-0 text-center">
                  <span className="text-[11px] font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur">
                    Preview this course
                  </span>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-6 space-y-6">
                <div>
                  {isFree ? (
                    <span className="text-3xl font-black text-emerald-600">Free</span>
                  ) : (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-slate-900">
                        ${currentPrice.toFixed(2)}
                      </span>
                      {course.discountPrice > 0 && (
                        <span className="text-base line-through text-slate-400 font-medium">
                          ${course.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                {isEnrolled ? (
                  <Link
                    to={`/learn/${course._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition"
                  >
                    Go to Classroom <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 transition"
                    >
                      {enrolling
                        ? 'Enrolling...'
                        : isFree
                        ? 'Enroll for Free'
                        : `Enroll Now - $${currentPrice.toFixed(2)}`}
                    </button>

                    {(!user || isStudent) && (
                      <button
                        onClick={handleWishlistToggle}
                        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                          isWishlisted
                            ? 'border-rose-200 bg-rose-50 text-rose-600'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`}
                        />
                        {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                      </button>
                    )}
                  </div>
                )}

                {/* Guarantee & Highlights */}
                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                  <p className="font-bold text-slate-900">This course includes:</p>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{course.duration || '10 hours'} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Downloadable learning resources</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>Official Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Full lifetime access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Free Video Preview Modal */}
      {previewVideoUrl && (
        <Modal
          isOpen={!!previewVideoUrl}
          onClose={() => setPreviewVideoUrl(null)}
          title="Free Course Preview"
          maxWidth="max-w-3xl"
        >
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe
              src={previewVideoUrl}
              title="Course Preview"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Modal>
      )}

      {/* Mock Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Complete Course Enrollment"
      >
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-xs text-slate-500 font-medium">Selected Course</p>
            <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {course.title}
            </p>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-indigo-200/50">
              <span className="text-xs font-bold text-slate-700">Total Due Today:</span>
              <span className="text-lg font-black text-indigo-700">
                ${currentPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Payment Method (Simulated Test Checkout)
            </label>
            <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-800">
                  Instant Test Card (No actual charge)
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Clicking Confirm will immediately process your enrollment and grant 100% full lifetime access to lectures and assessments.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => executeEnrollment('Card')}
              disabled={enrolling}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200"
            >
              {enrolling ? 'Confirming...' : `Pay $${currentPrice.toFixed(2)} & Enroll`}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetails;
