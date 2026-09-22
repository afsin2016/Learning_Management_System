# ApexLMS - Enterprise Learning Management System (MERN Stack)

A complete, production-ready Learning Management System built from scratch with separate `frontend` (React + Tailwind CSS) and `backend` (Node.js + Express + MongoDB) architectures.

---

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), React Router v6, Tailwind CSS, Lucide React, Recharts, Canvas-Confetti
- **Backend**: Node.js, Express.js (RESTful API), Mongoose ODM
- **Database**: MongoDB (`mongodb://localhost:27017/Learning_Management_System`), inspectable via **MongoDB Compass**
- **Authentication**: Stateless JSON Web Tokens (JWT) + bcrypt password hashing
- **API Client**: Axios with request/response Bearer interceptors

---

## 👥 Three Specialized Roles & Demo Credentials

The database comes pre-seeded with rich, ready-to-test accounts for all three roles:

| Role | Email | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@lms.com` | `Password123!` | `/admin` - Platform KPIs, Course Approval Queue, Block/Unblock Users, Category CRUD, Revenue Audit Logs |
| **Instructor 1** | `john@instructor.com` | `Password123!` | `/instructor` - Instructor Studio, Course Creator, Section/Lecture/Quiz Builder, Student Tracker, Reviews |
| **Instructor 2** | `sarah@instructor.com` | `Password123!` | `/instructor` - UI/UX Specialist Instructor |
| **Student 1** | `alex@student.com` | `Password123!` | `/student/dashboard` - Classroom, Watch Videos, Take Quizzes, 100% Certificate Claim, Wishlist |
| **Student 2** | `emma@student.com` | `Password123!` | `/student/dashboard` - Enrolled Student |

> 💡 **Quick Login**: The Login screen (`/login`) includes 1-click Fast-Fill buttons for Admin, Instructor, and Student.

---

## 📂 Project Architecture

```
d:/massclick/New App 1/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/              # 12 REST API Controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── certificateController.js
│   │   ├── courseController.js
│   │   ├── curriculumController.js
│   │   ├── enrollmentController.js
│   │   ├── instructorController.js
│   │   ├── progressController.js
│   │   ├── quizController.js
│   │   ├── reviewController.js
│   │   └── wishlistController.js
│   ├── middleware/               # Auth, Roles, Central Error Handlers
│   ├── models/                   # 13 Mongoose Database Models
│   │   ├── Category.js
│   │   ├── Certificate.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Lesson.js
│   │   ├── Payment.js
│   │   ├── Progress.js
│   │   ├── Quiz.js
│   │   ├── QuizAttempt.js
│   │   ├── Review.js
│   │   ├── Section.js
│   │   ├── User.js
│   │   └── Wishlist.js
│   ├── routes/                   # RESTful API route declarations
│   ├── scripts/
│   │   └── seed.js               # Comprehensive database seeder
│   ├── .env                      # Backend environment variables
│   └── server.js                 # Express Application Entrypoint
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios client with JWT interceptor
    │   ├── components/
    │   │   └── common/           # Navbar, Footer, CourseCard, RatingStars, Modal, Loader, ProtectedRoute
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state & session persistence
    │   ├── pages/
    │   │   ├── admin/            # Admin Dashboard, Users, Courses, Categories, Enrollments, Reviews
    │   │   ├── instructor/       # Instructor Studio, Courses, Editor, Curriculum/Quiz Builder, Students, Reviews
    │   │   ├── student/          # Student Dashboard, MyCourses, CoursePlayer, Wishlist, Certificates, Profile
    │   │   ├── BrowseCourses.jsx
    │   │   ├── CourseDetails.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── VerifyCertificate.jsx
    │   ├── App.jsx               # React Router route registry
    │   └── main.jsx
    └── tailwind.config.js
```

---

## ⚡ Quick Start Guide

### 1. Start MongoDB
Ensure MongoDB is running locally on port `27017`:
```bash
# Verify connection string
mongodb://localhost:27017/Learning_Management_System
```
Open **MongoDB Compass** and connect to `mongodb://localhost:27017` to inspect all 13 collections.

### 2. Backend Setup & Seeding
```bash
cd backend
npm install
npm run seed      # Seeds Admin, Instructors, Students, Courses, Quizzes & Certificates
npm start         # Starts REST API on http://localhost:5001
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Starts Vite Dev Server on http://localhost:3000
```

---

## 🎓 Core Feature Highlights

1. **Course Catalog & Multi-Filter**:
   - Live search by keyword
   - Category filtering with course count
   - Level filters (Beginner, Intermediate, Expert, All Levels)
   - Price filters (Free vs Paid)
   - Minimum rating filter & sorting options

2. **Interactive Classroom & Course Player (`/learn/:courseId`)**:
   - Distraction-free full-width video and article player
   - Live section & lecture drawer with completion checkmarks
   - "Mark as Completed" with automated progress calculation
   - Downloadable attachments & learning resources

3. **In-Class Quiz Engine**:
   - Multiple-choice questions with radio options
   - Instant automated grading & percentage calculation
   - Pass / Fail status badge
   - Detailed answers breakdown with explanations for every option
   - Automatically marks the lesson completed upon passing!

4. **100% Completion & Verifiable Credentials**:
   - Reaching 100% progress automatically issues a tamper-proof digital Certificate
   - Celebration confetti modal
   - Public verification page (`/verify-certificate/:certificateId`)
   - Print-ready official diploma view

5. **Instructor Studio**:
   - Course Creation & Edit wizard
   - Curriculum & Section Builder (drag & drop reordering, add video URLs, lecture notes)
   - Interactive Quiz Builder (configure questions, options, mark correct answer, set passing marks)
   - Student progress tracker & course ratings

6. **Admin Control Center**:
   - Real-time revenue & enrollment charts (Recharts)
   - Course approval queue (Approve or Reject with instructor feedback)
   - User moderation: Block / Unblock users, review instructor applications
   - Category management with icons
