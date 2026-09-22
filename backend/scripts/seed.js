const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Certificate = require('../models/Certificate');
const Payment = require('../models/Payment');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/Learning_Management_System';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected! Purging existing LMS database collections...');

    // Clear all collections
    await User.deleteMany();
    await Category.deleteMany();
    await Course.deleteMany();
    await Section.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();
    await QuizAttempt.deleteMany();
    await Enrollment.deleteMany();
    await Progress.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();
    await Certificate.deleteMany();
    await Payment.deleteMany();

    console.log('Old collections purged. Creating users...');

    // Users
    const defaultPassword = 'Password123!';

    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@lms.com',
      password: defaultPassword,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      headline: 'Platform Master Administrator',
      bio: 'Administrator oversight and quality control for LMS Academy.',
      status: 'active',
    });

    const instructor1 = await User.create({
      name: 'Johnathan Vance',
      email: 'john@instructor.com',
      password: defaultPassword,
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      headline: 'Lead Cloud Architect & Full-Stack Engineer',
      bio: 'Over 14 years building distributed systems and mentoring over 85,000 developers worldwide.',
      status: 'active',
      instructorDetails: {
        expertise: ['JavaScript', 'React', 'Node.js', 'Kubernetes', 'MongoDB'],
        experienceYears: 14,
        isApproved: true,
        approvedAt: new Date(),
      },
    });

    const instructor2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@instructor.com',
      password: defaultPassword,
      role: 'instructor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      headline: 'Design Director & UX Strategist',
      bio: 'Former Design Lead at high-growth tech ventures. Passionate about human-centric interfaces.',
      status: 'active',
      instructorDetails: {
        expertise: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research'],
        experienceYears: 9,
        isApproved: true,
        approvedAt: new Date(),
      },
    });

    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@student.com',
      password: defaultPassword,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      headline: 'Software Engineering Trainee',
      bio: 'Continuous learner building projects with React and Node.',
      status: 'active',
    });

    const student2 = await User.create({
      name: 'Emma Watson',
      email: 'emma@student.com',
      password: defaultPassword,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
      headline: 'Product Design Intern',
      bio: 'Crafting delight through interface aesthetics.',
      status: 'active',
    });

    console.log('Users created successfully.');

    // Categories
    console.log('Creating categories...');
    const catWebDev = await Category.create({
      name: 'Web Development',
      slug: 'web-development',
      description: 'Master modern frontend, backend, APIs, and cloud-native full stack development.',
      icon: 'Code',
    });

    const catDataScience = await Category.create({
      name: 'Data Science & AI',
      slug: 'data-science-ai',
      description: 'Deep dive into Machine Learning, Neural Networks, Python, and Predictive Analytics.',
      icon: 'Brain',
    });

    const catDesign = await Category.create({
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'Wireframing, prototyping, Figma design systems, and user behavior psychology.',
      icon: 'Palette',
    });

    const catCloud = await Category.create({
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Containerization, Kubernetes, CI/CD pipelines, and AWS/GCP architecture.',
      icon: 'Cloud',
    });

    const catBusiness = await Category.create({
      name: 'Business & Leadership',
      slug: 'business-leadership',
      description: 'Agile management, product roadmapping, growth strategies, and enterprise leadership.',
      icon: 'Briefcase',
    });

    console.log('Categories created. Building courses with sections, lessons & quizzes...');

    // ----------------------------------------------------
    // Course 1: Full-Stack Web Development Bootcamp
    // ----------------------------------------------------
    const course1 = await Course.create({
      title: 'Complete Full-Stack Web Development Bootcamp 2026',
      slug: 'complete-full-stack-web-development-bootcamp-2026',
      subtitle: 'Become a software engineer: HTML5, CSS3, React 19, Node.js, Express, and MongoDB.',
      description: `Embark on an intensive, zero-to-hero journey into modern software engineering. In this master bootcamp, you'll learn hands-on how to build full-stack web applications from architectural conception through to live production deployment.

You will master responsive layouts, database modeling, RESTful API development, JWT session security, and dynamic UI state synchronization.`,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
      instructor: instructor1._id,
      category: catWebDev._id,
      price: 89.99,
      discountPrice: 49.99,
      level: 'All Levels',
      language: 'English',
      duration: '18.5 hours',
      requirements: [
        'A working computer (Windows, Mac, or Linux) with internet access',
        'No prior programming experience required; we start from scratch',
        'Eagerness to write code and solve real-world problems',
      ],
      whatYouWillLearn: [
        'Build and deploy full-stack modern web applications with React, Express, and MongoDB',
        'Architect scalable REST APIs with secure JWT authentication and role-based access',
        'Implement robust database schemas and relationship aggregations with Mongoose',
        'Craft responsive, mobile-first layouts using Tailwind CSS and CSS Grid',
        'Master Git version control and industry-standard deployment strategies',
      ],
      status: 'published',
      rating: 4.9,
      numReviews: 142,
      enrolledCount: 320,
      isFeatured: true,
    });

    // Sections & Lessons for Course 1
    const c1s1 = await Section.create({
      title: 'Section 1: Architecture & Semantic Web Foundations',
      course: course1._id,
      order: 1,
    });

    const c1l1 = await Lesson.create({
      title: '1. Welcome & Engineering Roadmap',
      section: c1s1._id,
      course: course1._id,
      order: 1,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', // Clean instructional video
      duration: '08:45',
      content: 'Welcome to the Full Stack Bootcamp! Let us outline the 12-week development milestone checklist and developer tooling setup.',
      isFreePreview: true,
      resources: [{ title: 'Developer Tooling Guide.pdf', url: 'https://example.com/tooling-guide.pdf' }],
    });

    const c1l2 = await Lesson.create({
      title: '2. Semantic HTML & SEO Hierarchy',
      section: c1s1._id,
      course: course1._id,
      order: 2,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU',
      duration: '14:20',
      content: 'Learn why semantic elements like section, article, nav, and header optimize browser accessibility tree and search engine crawlability.',
      isFreePreview: false,
      resources: [{ title: 'HTML5 Elements Cheatsheet', url: 'https://example.com/html5-cheat.pdf' }],
    });

    // Quiz 1 for Course 1
    const quiz1 = await Quiz.create({
      title: 'Quiz 1: Web Architecture & Semantic HTML',
      course: course1._id,
      section: c1s1._id,
      passingPercentage: 70,
      timeLimitMinutes: 10,
      questions: [
        {
          questionText: 'Which HTML tag should be used for the primary navigation block of a website?',
          options: ['<header>', '<nav>', '<sidebar>', '<menu>'],
          correctAnswerIndex: 1,
          explanation: '<nav> is the dedicated semantic element intended specifically for navigation links.',
          marks: 1,
        },
        {
          questionText: 'What is the primary role of MongoDB in the MERN software stack?',
          options: [
            'Client-side view rendering',
            'Document-oriented NoSQL database storage',
            'Server-side routing framework',
            'CSS stylesheet compilation',
          ],
          correctAnswerIndex: 1,
          explanation: 'MongoDB provides scalable, JSON-like document data persistence.',
          marks: 1,
        },
        {
          questionText: 'Why is bcrypt preferred over basic hashing functions like MD5 or SHA-256 for passwords?',
          options: [
            'It generates shorter strings',
            'It incorporates salting and an adjustable computational cost factor to resist brute-force attacks',
            'It encrypts data reversibly',
            'It runs on the GPU',
          ],
          correctAnswerIndex: 1,
          explanation: 'bcrypt is a key-derivation function that uses salts and work factor (rounds) to prevent rainbow table attacks.',
          marks: 1,
        },
      ],
    });

    const c1l3 = await Lesson.create({
      title: '3. Knowledge Check: Web Architecture Quiz',
      section: c1s1._id,
      course: course1._id,
      order: 3,
      type: 'quiz',
      duration: '10:00',
      content: 'Test your understanding of the foundational web architecture concepts covered in this module.',
      quiz: quiz1._id,
    });

    c1s1.lessons = [c1l1._id, c1l2._id, c1l3._id];
    await c1s1.save();

    // Section 2 for Course 1
    const c1s2 = await Section.create({
      title: 'Section 2: Server-Side REST APIs with Express & Mongoose',
      course: course1._id,
      order: 2,
    });

    const c1l4 = await Lesson.create({
      title: '4. Designing Clean RESTful Endpoints',
      section: c1s2._id,
      course: course1._id,
      order: 1,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/7r4xVDI2vho',
      duration: '19:10',
      content: 'We explore HTTP verbs (GET, POST, PUT, DELETE), status codes (200, 201, 400, 401, 403, 404, 500), and controller decoupling.',
      isFreePreview: false,
    });

    const c1l5 = await Lesson.create({
      title: '5. JSON Web Tokens (JWT) & Role Authorization Middleware',
      section: c1s2._id,
      course: course1._id,
      order: 2,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
      duration: '22:30',
      content: 'Step-by-step implementation of bearer tokens, stateless authentication, and multi-tier role authorization (Admin vs Instructor vs Student).',
      isFreePreview: false,
    });

    c1s2.lessons = [c1l4._id, c1l5._id];
    await c1s2.save();

    course1.sections = [c1s1._id, c1s2._id];
    await course1.save();

    // ----------------------------------------------------
    // Course 2: UI/UX Design Masterclass
    // ----------------------------------------------------
    const course2 = await Course.create({
      title: 'UI/UX Design Masterclass: From Wireframe to High-Fidelity Prototype',
      slug: 'ui-ux-design-masterclass-wireframe-to-prototype',
      subtitle: 'Design world-class digital products with Figma, design tokens, and user psychology.',
      description: `Step inside the studio of a seasoned design director. Learn user research, customer journey mapping, interactive micro-interactions, responsive typography, and how to construct scalable design systems in Figma.`,
      thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80',
      instructor: instructor2._id,
      category: catDesign._id,
      price: 69.99,
      discountPrice: 34.99,
      level: 'Beginner',
      language: 'English',
      duration: '11.0 hours',
      requirements: [
        'A computer capable of running a modern web browser or Figma app',
        'A free Figma account',
        'No previous design background required',
      ],
      whatYouWillLearn: [
        'Conduct qualitative user interviews and synthesize actionable user personas',
        'Build complete clickable high-fidelity prototypes in Figma',
        'Establish cohesive design systems with variables, tokens, and auto-layout',
        'Deliver developer-ready design specs and interactive handoffs',
      ],
      status: 'published',
      rating: 4.8,
      numReviews: 68,
      enrolledCount: 185,
      isFeatured: true,
    });

    const c2s1 = await Section.create({
      title: 'Module 1: User Experience Foundations & Mental Models',
      course: course2._id,
      order: 1,
    });

    const c2l1 = await Lesson.create({
      title: '1. What Makes an Interface Truly Intuitive?',
      section: c2s1._id,
      course: course2._id,
      order: 1,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
      duration: '12:15',
      content: 'Explore Jakob Nielsen heuristics, cognitive load reduction, and visual hierarchy laws.',
      isFreePreview: true,
    });

    const c2l2 = await Lesson.create({
      title: '2. Wireframing Mobile App Flows',
      section: c2s1._id,
      course: course2._id,
      order: 2,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
      duration: '17:40',
      content: 'Rapid sketching and low-fidelity structural blueprinting.',
      isFreePreview: false,
    });

    c2s1.lessons = [c2l1._id, c2l2._id];
    await c2s1.save();
    course2.sections = [c2s1._id];
    await course2.save();

    // ----------------------------------------------------
    // Course 3: Docker & Kubernetes for Production Microservices (FREE)
    // ----------------------------------------------------
    const course3 = await Course.create({
      title: 'Docker & Kubernetes for Production Microservices',
      slug: 'docker-kubernetes-production-microservices',
      subtitle: 'Free hands-on course mastering containers, pods, deployments, and cluster orchestration.',
      description: `Understand how modern tech enterprises package and orchestrate applications at global scale. Learn containerization from first principles, write multi-stage Dockerfiles, and manage Kubernetes clusters with ease.`,
      thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1000&auto=format&fit=crop&q=80',
      instructor: instructor1._id,
      category: catCloud._id,
      price: 0, // 100% Free course
      discountPrice: 0,
      level: 'Intermediate',
      language: 'English',
      duration: '4.5 hours',
      requirements: [
        'Basic familiarity with command line / terminal',
        'Basic understanding of web servers',
      ],
      whatYouWillLearn: [
        'Build lean, multi-stage production Docker images',
        'Run multi-container setups using Docker Compose',
        'Deploy resilient applications onto Kubernetes clusters',
        'Configure Ingress controllers and persistent volume storage',
      ],
      status: 'published',
      rating: 5.0,
      numReviews: 89,
      enrolledCount: 512,
      isFeatured: true,
    });

    const c3s1 = await Section.create({
      title: 'Module 1: Docker Containers from Scratch',
      course: course3._id,
      order: 1,
    });

    const c3l1 = await Lesson.create({
      title: '1. Why Containers Changed Cloud Infrastructure',
      section: c3s1._id,
      course: course3._id,
      order: 1,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
      duration: '15:00',
      content: 'Compare Virtual Machines vs Linux Namespaces and cgroups.',
      isFreePreview: true,
    });

    const c3l2 = await Lesson.create({
      title: '2. Writing Lean Multi-Stage Dockerfiles',
      section: c3s1._id,
      course: course3._id,
      order: 2,
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI',
      duration: '18:30',
      content: 'Shrink your image sizes from 1.2GB down to 60MB using Alpine and multi-stage builders.',
      isFreePreview: false,
    });

    c3s1.lessons = [c3l1._id, c3l2._id];
    await c3s1.save();
    course3.sections = [c3s1._id];
    await course3.save();

    // ----------------------------------------------------
    // Course 4: Draft / Pending Course for Admin Review
    // ----------------------------------------------------
    const course4 = await Course.create({
      title: 'Artificial Intelligence & Machine Learning with Python',
      slug: 'ai-machine-learning-python-deep-dive',
      subtitle: 'Neural networks, PyTorch, computer vision, and LLM fine-tuning techniques.',
      description: 'Comprehensive guide to building custom transformer models and deploying AI APIs.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000&auto=format&fit=crop&q=80',
      instructor: instructor1._id,
      category: catDataScience._id,
      price: 119.99,
      discountPrice: 69.99,
      level: 'Expert',
      language: 'English',
      duration: '24.0 hours',
      requirements: ['Python proficiency', 'Calculus and linear algebra basics'],
      whatYouWillLearn: ['Build deep neural networks in PyTorch', 'Train convolutional networks for image segmentation'],
      status: 'pending', // Pending approval so Admin can approve/reject!
      rating: 0,
      numReviews: 0,
      enrolledCount: 0,
    });

    console.log('Courses & Curriculum seeded. Setting up Enrollments, Progress, and Certificate for testing...');

    // Enroll Alex in Course 3 (Free Course) - Completed with Certificate
    const certId = 'CERT-LMS-2026-ALPHA1';
    await Enrollment.create({
      student: student1._id,
      course: course3._id,
      pricePaid: 0,
      status: 'active',
      enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      student: student1._id,
      course: course3._id,
      completedLessons: [c3l1._id, c3l2._id],
      currentLesson: c3l2._id,
      percentage: 100,
      isCompleted: true,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await Certificate.create({
      certificateId: certId,
      student: student1._id,
      course: course3._id,
      instructor: instructor1._id,
      issueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      gradeOrPercentage: 100,
    });

    // Also enroll Alex in Course 1 with in-progress state
    const payment1 = await Payment.create({
      student: student1._id,
      course: course1._id,
      amount: 49.99,
      currency: 'USD',
      paymentMethod: 'Card',
      transactionId: 'TXN-INIT-DEMO-001',
      status: 'completed',
    });

    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      payment: payment1._id,
      pricePaid: 49.99,
      status: 'active',
      enrolledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    await Progress.create({
      student: student1._id,
      course: course1._id,
      completedLessons: [c1l1._id],
      currentLesson: c1l2._id,
      percentage: 20,
      isCompleted: false,
    });

    // Seed Reviews
    await Review.create({
      student: student1._id,
      course: course1._id,
      rating: 5,
      comment: 'Hands down the most well-structured full-stack course I have ever taken! The explanations of REST architecture and JWT are second to none.',
    });

    await Review.create({
      student: student1._id,
      course: course3._id,
      rating: 5,
      comment: 'Incredible that this course is 100% free! Clear explanations and production-ready Dockerfiles.',
    });

    // Seed Wishlist for Emma
    await Wishlist.create({
      student: student2._id,
      courses: [course1._id, course2._id],
    });

    console.log('=====================================================');
    console.log('Database Seeding Completed Successfully!');
    console.log('=====================================================');
    console.log('Demo Credentials:');
    console.log('ADMIN:      admin@lms.com       / Password123!');
    console.log('INSTRUCTOR: john@instructor.com / Password123!');
    console.log('INSTRUCTOR: sarah@instructor.com/ Password123!');
    console.log('STUDENT:    alex@student.com    / Password123!');
    console.log('STUDENT:    emma@student.com    / Password123!');
    console.log('TEST CERT:  /verify-certificate/' + certId);
    console.log('=====================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
