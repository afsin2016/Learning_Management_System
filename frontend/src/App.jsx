import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/Home';
import BrowseCourses from './pages/BrowseCourses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyCertificate from './pages/VerifyCertificate';
import NotFound from './pages/NotFound';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyCourses from './pages/student/MyCourses';
import CoursePlayer from './pages/student/CoursePlayer';
import Wishlist from './pages/student/Wishlist';
import StudentCertificates from './pages/student/StudentCertificates';
import StudentProfile from './pages/student/StudentProfile';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCourses from './pages/instructor/InstructorCourses';
import CourseEditor from './pages/instructor/CourseEditor';
import CurriculumBuilder from './pages/instructor/CurriculumBuilder';
import InstructorStudents from './pages/instructor/InstructorStudents';
import InstructorReviews from './pages/instructor/InstructorReviews';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCourses from './pages/admin/ManageCourses';
import ManageCategories from './pages/admin/ManageCategories';
import ManageEnrollments from './pages/admin/ManageEnrollments';
import ManageReviews from './pages/admin/ManageReviews';

// Layout wrapper to hide Navbar/Footer in immersive CoursePlayer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isClassroom = location.pathname.startsWith('/learn/');

  if (isClassroom) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<BrowseCourses />} />
            <Route path="/courses/:identifier" element={<CourseDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />
            <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />

            {/* Profile Route (Shared) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-courses"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learn/:courseId"
              element={
                <ProtectedRoute>
                  <CoursePlayer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/wishlist"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/certificates"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentCertificates />
                </ProtectedRoute>
              }
            />

            {/* Instructor Protected Routes */}
            <Route
              path="/instructor"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/new"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CourseEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CourseEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/curriculum"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <CurriculumBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/students"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/reviews"
              element={
                <ProtectedRoute allowedRoles={['instructor']}>
                  <InstructorReviews />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/enrollments"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageEnrollments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageReviews />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
