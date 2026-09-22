import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  Save,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import api from '../../api/axios';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';

const CurriculumBuilder = () => {
  const { id: courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Section Modal
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [editingSection, setEditingSection] = useState(null);

  // Lesson Modal
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonType, setLessonType] = useState('video');
  const [videoUrl, setVideoUrl] = useState('');
  const [lessonDuration, setLessonDuration] = useState('10:00');
  const [lessonContent, setLessonContent] = useState('');
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [resources, setResources] = useState([]);

  // Quiz Builder Modal
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizTargetLesson, setQuizTargetLesson] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [passingPercentage, setPassingPercentage] = useState(70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      explanation: '',
      marks: 1,
    },
  ]);

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const [courseRes, curRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/curriculum/course/${courseId}`),
      ]);
      if (courseRes.data.success) setCourse(courseRes.data.course);
      if (curRes.data.success) setSections(curRes.data.sections);
    } catch (err) {
      console.error('Error fetching curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- Section Handlers ---
  const handleOpenAddSection = () => {
    setEditingSection(null);
    setSectionTitle('');
    setSectionModalOpen(true);
  };

  const handleOpenEditSection = (section) => {
    setEditingSection(section);
    setSectionTitle(section.title);
    setSectionModalOpen(true);
  };

  const handleSaveSection = async (e) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await api.put(`/curriculum/sections/${editingSection._id}`, {
          title: sectionTitle,
        });
      } else {
        await api.post('/curriculum/sections', {
          title: sectionTitle,
          courseId,
        });
      }
      setSectionModalOpen(false);
      fetchCurriculum();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving section');
    }
  };

  const handleDeleteSection = async (secId) => {
    if (window.confirm('Delete this section and all contained lessons?')) {
      try {
        await api.delete(`/curriculum/sections/${secId}`);
        fetchCurriculum();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting section');
      }
    }
  };

  // --- Lesson Handlers ---
  const handleOpenAddLesson = (sectionId) => {
    setSelectedSectionId(sectionId);
    setEditingLesson(null);
    setLessonTitle('');
    setLessonType('video');
    setVideoUrl('');
    setLessonDuration('10:00');
    setLessonContent('');
    setIsFreePreview(false);
    setResources([]);
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson) => {
    setSelectedSectionId(lesson.section);
    setEditingLesson(lesson);
    setLessonTitle(lesson.title);
    setLessonType(lesson.type || 'video');
    setVideoUrl(lesson.videoUrl || '');
    setLessonDuration(lesson.duration || '10:00');
    setLessonContent(lesson.content || '');
    setIsFreePreview(Boolean(lesson.isFreePreview));
    setResources(lesson.resources || []);
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: lessonTitle,
        sectionId: selectedSectionId,
        type: lessonType,
        videoUrl,
        duration: lessonDuration,
        content: lessonContent,
        isFreePreview,
        resources,
      };

      if (editingLesson) {
        await api.put(`/curriculum/lessons/${editingLesson._id}`, payload);
      } else {
        await api.post('/curriculum/lessons', payload);
      }
      setLessonModalOpen(false);
      fetchCurriculum();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving lesson');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Delete this lecture?')) {
      try {
        await api.delete(`/curriculum/lessons/${lessonId}`);
        fetchCurriculum();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting lesson');
      }
    }
  };

  // --- Quiz Builder Handlers ---
  const handleOpenQuizBuilder = async (lesson) => {
    setQuizTargetLesson(lesson);
    if (lesson.quiz) {
      try {
        const res = await api.get(`/quizzes/${lesson.quiz._id || lesson.quiz}`);
        if (res.data.success) {
          const q = res.data.quiz;
          setQuizTitle(q.title);
          setPassingPercentage(q.passingPercentage || 70);
          setTimeLimitMinutes(q.timeLimitMinutes || 15);
          setQuestions(q.questions || []);
        }
      } catch (err) {
        console.error('Error fetching existing quiz:', err);
      }
    } else {
      setQuizTitle(`Quiz: ${lesson.title}`);
      setPassingPercentage(70);
      setTimeLimitMinutes(15);
      setQuestions([
        {
          questionText: 'What is the main topic of this lecture?',
          options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
          correctAnswerIndex: 0,
          explanation: 'Concept A is thoroughly explained in the video lecture.',
          marks: 1,
        },
      ]);
    }
    setQuizModalOpen(true);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswerIndex: 0,
        explanation: '',
        marks: 1,
      },
    ]);
  };

  const handleQuestionTextChange = (idx, text) => {
    const updated = [...questions];
    updated[idx].questionText = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, text) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = text;
    setQuestions(updated);
  };

  const handleCorrectAnswerSelect = (qIdx, optIdx) => {
    const updated = [...questions];
    updated[qIdx].correctAnswerIndex = optIdx;
    setQuestions(updated);
  };

  const handleExplanationChange = (qIdx, text) => {
    const updated = [...questions];
    updated[qIdx].explanation = text;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== idx));
    }
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/quizzes', {
        quizId: quizTargetLesson.quiz?._id || quizTargetLesson.quiz || null,
        lessonId: quizTargetLesson._id,
        courseId,
        sectionId: quizTargetLesson.section,
        title: quizTitle,
        passingPercentage: Number(passingPercentage),
        timeLimitMinutes: Number(timeLimitMinutes),
        questions,
      });

      if (res.data.success) {
        setQuizModalOpen(false);
        fetchCurriculum();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving quiz');
    }
  };

  if (loading) {
    return <Loader message="Loading curriculum studio..." size="large" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/instructor/courses"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Curriculum Builder</h1>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-lg">
              Course: <span className="font-bold text-indigo-700">{course?.title}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddSection}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition"
        >
          <Plus className="w-4 h-4" /> Add Section / Module
        </button>
      </div>

      {/* Sections and Lessons Tree */}
      {sections.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Your curriculum is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Add Section" above to define chapters, video lectures, and quizzes for this course.
          </p>
          <button
            onClick={handleOpenAddSection}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Add First Section
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section, sIdx) => (
            <div
              key={section._id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-slate-50/80 p-5 border-b border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {sIdx + 1}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base">{section.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddLesson(section._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lecture
                  </button>
                  <button
                    onClick={() => handleOpenEditSection(section)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    title="Rename Section"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lessons List in Section */}
              <div className="divide-y divide-slate-100 p-2">
                {section.lessons?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-4 text-center">
                    No lectures in this module yet. Click "Add Lecture".
                  </p>
                ) : (
                  section.lessons?.map((lesson, lIdx) => (
                    <div
                      key={lesson._id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-2xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          {lesson.type === 'quiz' ? (
                            <HelpCircle className="w-4 h-4 text-violet-600" />
                          ) : (
                            <Video className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-xs sm:text-sm">
                              {lIdx + 1}. {lesson.title}
                            </span>
                            {lesson.isFreePreview && (
                              <span className="text-[10px] uppercase font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.duration || '10:00'}
                            </span>
                            {lesson.type === 'quiz' && (
                              <span className="text-violet-600 font-semibold">Interactive Quiz</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* If quiz type, button to configure questions */}
                        {lesson.type === 'quiz' && (
                          <button
                            onClick={() => handleOpenQuizBuilder(lesson)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold rounded-lg transition"
                          >
                            <HelpCircle className="w-3.5 h-3.5" /> Questions ({lesson.quiz ? 'Configured' : 'Empty'})
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditLesson(lesson)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                          title="Edit Lecture"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Delete Lecture"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section Create/Edit Modal */}
      <Modal
        isOpen={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        title={editingSection ? 'Rename Section' : 'Create New Section'}
      >
        <form onSubmit={handleSaveSection} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Section Title
            </label>
            <input
              type="text"
              required
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g. Module 1: Introduction & Fundamentals"
              className="w-full px-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setSectionModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              Save Section
            </button>
          </div>
        </form>
      </Modal>

      {/* Lesson Create/Edit Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? 'Edit Lecture' : 'Add New Lecture'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Lecture Title
            </label>
            <input
              type="text"
              required
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="e.g. 1. Deep Dive into Middleware"
              className="w-full px-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Lecture Type
              </label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 font-medium"
              >
                <option value="video">Video Lecture</option>
                <option value="article">Article / Reading</option>
                <option value="quiz">Interactive Quiz</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={lessonDuration}
                onChange={(e) => setLessonDuration(e.target.value)}
                placeholder="10:00"
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {lessonType === 'video' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Video Embed URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Lecture Notes / Content
            </label>
            <textarea
              rows={3}
              value={lessonContent}
              onChange={(e) => setLessonContent(e.target.value)}
              placeholder="Summary, markdown notes, code snippets..."
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="freePreview"
              checked={isFreePreview}
              onChange={(e) => setIsFreePreview(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="freePreview" className="text-xs font-medium text-slate-700 cursor-pointer">
              Allow Free Preview for non-enrolled students
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setLessonModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              Save Lecture
            </button>
          </div>
        </form>
      </Modal>

      {/* Quiz Builder Modal */}
      <Modal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        title="Interactive Quiz Builder"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveQuiz} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                required
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-6 max-h-96 overflow-y-auto pr-1">
            {questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Question #{qIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Enter the question text..."
                  value={q.questionText}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-200 font-semibold"
                />

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Options (Select radio for correct answer):
                  </span>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctAnswerIndex === optIdx}
                        onChange={() => handleCorrectAnswerSelect(qIdx, optIdx)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Explanation for the correct answer (optional)..."
                    value={q.explanation || ''}
                    onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 text-slate-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Another Question
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQuizModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
              >
                Save Assessment
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CurriculumBuilder;
