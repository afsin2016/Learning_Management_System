import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Review modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Certificate completion modal
  const [completionModalOpen, setCompletionModalOpen] = useState(false);

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const [courseRes, curRes, progRes] = await Promise.all([
          api.get(`/courses/${courseId}`),
          api.get(`/curriculum/course/${courseId}`),
          api.get(`/progress/${courseId}`),
        ]);

        if (courseRes.data.success) setCourse(courseRes.data.course);
        if (curRes.data.success) {
          setSections(curRes.data.sections);
          // Set first section open
          if (curRes.data.sections.length > 0) {
            setOpenSections({ [curRes.data.sections[0]._id]: true });
          }
        }
        if (progRes.data.success) {
          setProgress(progRes.data.progress);
          if (progRes.data.certificate) {
            setCertificate(progRes.data.certificate);
          }
        }

        // Determine starting lesson
        const allLessons = curRes.data.sections.flatMap((s) => s.lessons);
        if (allLessons.length > 0) {
          const currentId = progRes.data.progress?.currentLesson;
          const found = allLessons.find((l) => l._id === currentId) || allLessons[0];
          loadLesson(found._id);
        }
      } catch (err) {
        console.error('Error loading classroom:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [courseId]);

  const loadLesson = async (lessonId) => {
    try {
      const res = await api.get(`/curriculum/lessons/${lessonId}`);
      if (res.data.success) {
        setActiveLesson(res.data.lesson);
        // If lesson has quiz, fetch sanitized quiz details
        if (res.data.lesson.quiz) {
          const qRes = await api.get(`/quizzes/${res.data.lesson.quiz._id || res.data.lesson.quiz}`);
          if (qRes.data.success) {
            setQuizData(qRes.data.quiz);
            setQuizAnswers({});
            setQuizResult(null);
          }
        } else {
          setQuizData(null);
        }
      }
    } catch (err) {
      console.error('Error loading lesson details:', err);
    }
  };

  const handleToggleComplete = async () => {
    if (!activeLesson) return;

    try {
      const res = await api.post(`/progress/${courseId}/lessons/${activeLesson._id}`);
      if (res.data.success) {
        setProgress(res.data.progress);

        // Check if certificate was just generated!
        if (res.data.certificate) {
          setCertificate(res.data.certificate);
          setCompletionModalOpen(true);
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Error updating lesson progress:', err);
    }
  };

  const handleQuizOptionSelect = (questionIndex, optionIndex) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    try {
      setSubmittingQuiz(true);
      const formattedAnswers = Object.entries(quizAnswers).map(([qIdx, optIdx]) => ({
        questionIndex: parseInt(qIdx, 10),
        selectedOption: optIdx,
      }));

      const res = await api.post(`/quizzes/${quizData._id}/submit`, {
        answers: formattedAnswers,
      });

      if (res.data.success) {
        setQuizResult(res.data.result);
        if (res.data.result.passed) {
          // Automatically mark quiz lesson as completed!
          handleToggleComplete();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    try {
      setReviewSubmitting(true);
      const res = await api.post('/reviews', {
        courseId,
        rating,
        comment: reviewComment,
      });
      if (res.data.success) {
        setReviewSuccess(true);
        setTimeout(() => {
          setReviewModalOpen(false);
          setReviewSuccess(false);
          setReviewComment('');
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Entering interactive classroom..." size="large" />;
  }

  const allLessons = sections.flatMap((s) => s.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l._id === activeLesson?._id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const isCurrentCompleted = progress?.completedLessons?.some(
    (id) => (id._id || id).toString() === activeLesson?._id?.toString()
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <Link
            to="/student/my-courses"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Back to My Courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="max-w-md truncate">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
              {course?.category?.name || 'Classroom'}
            </p>
            <h1 className="text-sm font-bold text-white truncate">{course?.title}</h1>
          </div>
        </div>

        {/* Progress & Certificate trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
            <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress?.percentage === 100 ? 'bg-emerald-400' : 'bg-indigo-500'
                }`}
                style={{ width: `${progress?.percentage || 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white">
              {progress?.percentage || 0}%
            </span>
          </div>

          {progress?.percentage === 100 && (
            <Link
              to={`/verify-certificate/${certificate?.certificateId || 'CERT-LMS-2026-ALPHA1'}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg transition"
            >
              <Award className="w-4 h-4" />
              Claim Certificate
            </Link>
          )}

          <button
            onClick={() => setReviewModalOpen(true)}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition"
            title="Leave a Course Review"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Classroom Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center: Lecture Content Player */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          {activeLesson ? (
            <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Media Player or Quiz Display */}
              {activeLesson.type === 'quiz' && quizData ? (
                /* Interactive Quiz View */
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950/60 border border-violet-800 px-3 py-1 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" /> Assessment
                      </span>
                      <h2 className="text-2xl font-black text-white mt-2">
                        {quizData.title}
                      </h2>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      Passing Score: {quizData.passingPercentage}%
                    </div>
                  </div>

                  {/* Quiz Results Card */}
                  {quizResult ? (
                    <div
                      className={`p-6 rounded-2xl border space-y-4 ${
                        quizResult.passed
                          ? 'bg-emerald-950/50 border-emerald-800 text-emerald-200'
                          : 'bg-rose-950/50 border-rose-800 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">
                          {quizResult.passed ? '🎉 Congratulations! You Passed!' : 'Needs Revision'}
                        </h3>
                        <span className="text-2xl font-black">{quizResult.percentage}%</span>
                      </div>
                      <p className="text-xs leading-relaxed">
                        You scored {quizResult.score} out of {quizResult.maxScore} (
                        {quizResult.correctCount} of {quizResult.totalQuestions} correct).
                      </p>

                      {/* Detailed Answers Breakdown */}
                      <div className="space-y-4 pt-4 border-t border-slate-800">
                        {quizResult.evaluatedAnswers.map((ea, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-900/90 p-4 rounded-xl text-xs space-y-2 text-slate-300"
                          >
                            <p className="font-bold text-white">
                              {idx + 1}. {ea.questionText}
                            </p>
                            <p
                              className={`font-semibold ${
                                ea.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              Your answer: {ea.options[ea.selectedOption] || 'None selected'}{' '}
                              {ea.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </p>
                            {!ea.isCorrect && (
                              <p className="text-amber-300">
                                Correct Answer: {ea.options[ea.correctAnswerIndex]}
                              </p>
                            )}
                            {ea.explanation && (
                              <p className="text-slate-400 italic text-[11px]">
                                Explanation: {ea.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setQuizResult(null);
                          setQuizAnswers({});
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
                      </button>
                    </div>
                  ) : (
                    /* Questions Form */
                    <div className="space-y-8">
                      {quizData.questions.map((q, qIndex) => (
                        <div key={q._id || qIndex} className="space-y-3">
                          <p className="text-sm sm:text-base font-bold text-slate-200">
                            {qIndex + 1}. {q.questionText}
                          </p>
                          <div className="space-y-2">
                            {q.options.map((option, optIndex) => {
                              const isSelected = quizAnswers[qIndex] === optIndex;
                              return (
                                <button
                                  key={optIndex}
                                  type="button"
                                  onClick={() => handleQuizOptionSelect(qIndex, optIndex)}
                                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                                    isSelected
                                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                                  }`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      isSelected
                                        ? 'border-indigo-400 bg-indigo-500'
                                        : 'border-slate-500'
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                  <span>{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-slate-800">
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={submittingQuiz}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition"
                        >
                          {submittingQuiz ? 'Grading Assessment...' : 'Submit Answers for Instant Grading'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Video Player / Article Viewer */
                <div className="space-y-4">
                  {activeLesson.type === 'video' && activeLesson.videoUrl ? (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                        <FileText className="w-4 h-4" /> Reading Material
                      </div>
                      <h2 className="text-xl font-bold text-white">{activeLesson.title}</h2>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {activeLesson.content || 'Comprehensive reading material for this lesson.'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Lecture Controls Bar */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleComplete}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                      isCurrentCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isCurrentCompleted ? 'Completed ✓' : 'Mark as Completed'}
                  </button>
                </div>

                {/* Prev & Next navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={!prevLesson}
                    onClick={() => prevLesson && loadLesson(prevLesson._id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    disabled={!nextLesson}
                    onClick={() => nextLesson && loadLesson(nextLesson._id)}
                    className="p-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lesson Resources & Attachments */}
              {activeLesson.resources?.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-400" />
                    Downloadable Resources ({activeLesson.resources.length})
                  </h3>
                  <div className="space-y-2">
                    {activeLesson.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-xs text-slate-300 transition"
                      >
                        <span className="font-medium">{res.title}</span>
                        <span className="text-indigo-400 font-bold flex items-center gap-1">
                          Download <Download className="w-3.5 h-3.5" />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">Select a lesson to begin.</div>
          )}
        </div>

        {/* Right: Collapsible Curriculum Sidebar */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Course Curriculum</h3>
            <span className="text-xs text-slate-400 font-medium">
              {progress?.completedLessons?.length || 0} / {allLessons.length} Completed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
            {sections.map((section, sIdx) => {
              const isOpen = !!openSections[section._id];
              return (
                <div key={section._id || sIdx}>
                  <button
                    onClick={() =>
                      setOpenSections((prev) => ({ ...prev, [section._id]: !prev[section._id] }))
                    }
                    className="w-full p-4 flex items-center justify-between text-left bg-slate-850 hover:bg-slate-800 transition"
                  >
                    <span className="text-xs font-bold text-slate-200 line-clamp-1">
                      {section.title}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="divide-y divide-slate-800/60 bg-slate-900/60">
                      {(section.lessons || []).map((lesson) => {
                        const isCompleted = progress?.completedLessons?.some(
                          (id) => (id._id || id).toString() === lesson._id.toString()
                        );
                        const isActive = activeLesson?._id === lesson._id;

                        return (
                          <button
                            key={lesson._id}
                            onClick={() => loadLesson(lesson._id)}
                            className={`w-full p-3.5 flex items-center justify-between text-left text-xs transition ${
                              isActive
                                ? 'bg-indigo-900/40 text-indigo-300 border-l-4 border-indigo-500 font-bold'
                                : 'text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {lesson.duration || '10:00'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review this Course"
      >
        {reviewSuccess ? (
          <div className="text-center py-6 space-y-2 text-emerald-600">
            <CheckCircle2 className="w-12 h-12 mx-auto" />
            <p className="text-sm font-bold">Review published successfully!</p>
          </div>
        ) : (
          <form onSubmit={handlePostReview} className="space-y-4 text-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Your Feedback
              </label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you think of the instructor and lessons?"
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                {reviewSubmitting ? 'Posting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* 100% Certificate Unlocked Celebration Modal */}
      <Modal
        isOpen={completionModalOpen}
        onClose={() => setCompletionModalOpen(false)}
        title="🎓 100% Course Completed!"
      >
        <div className="text-center py-4 space-y-4 text-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-lg">
            <Award className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Congratulations, You Did It!
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            You have successfully completed 100% of all lectures and requirements for{' '}
            <span className="font-bold text-indigo-700">{course?.title}</span>. Your official digital certificate has been issued!
          </p>

          <div className="pt-3">
            <Link
              to={`/verify-certificate/${certificate?.certificateId || 'CERT-LMS-2026-ALPHA1'}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 transition"
            >
              <Award className="w-4 h-4" /> View & Print Certificate
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoursePlayer;
