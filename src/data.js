// All portfolio content lives here — edit this file to update the site.

export const profile = {
  name: 'Charan Teja Reddy Panakanapalli',
  shortName: 'Charan Teja Reddy',
  roles: ['Full-Stack Developer', 'React Developer', 'Java & Spring Boot Learner', 'Problem Solver'],
  intro:
    'Computer Science undergrad at IIIT Sri City who enjoys turning ideas into complete web applications - React on the front, Spring Boot and Node.js on the back.',
  email: 'charantejareddy.p23@iiits.in',
  phone: '+91 8374591104',
  github: 'https://github.com/pcharan2006',
  linkedin: 'https://linkedin.com/in/charan-teja-reddy-panakanapalli',
  // Put your resume PDF in /public and name it resume.pdf to enable the button
  resume: './resume.pdf',
}

export const stats = [
  { label: 'CGPA', value: 7, decimals: 2, suffix: '' },
  { label: 'MPC', value: 88.6, decimals: 1, suffix: '%' },
  { label: 'Projects', value: 3, decimals: 0, suffix: '' },
  { label: 'Class X GPA', value: 10, decimals: 0, suffix: '/10' },
]

export const education = [
  {
    school: 'Indian Institute of Information Technology, Sri City',
    degree: 'B.Tech — Computer Science and Engineering',
    period: '08/2023 – 06/2027',
    score: 'CGPA: 7.00',
  },
  {
    school: 'Narayana Junior College',
    degree: 'MPC',
    period: '06/2021 – 06/2023',
    score: '88.6%',
  },
  {
    school: 'Gautam High School',
    degree: 'Spark Batch',
    period: '06/2016 – 06/2020',
    score: 'GPA: 10/10',
  },
]

export const projects = [
  {
    title: 'SplitSmart',
    emoji: '💸',
    type: 'Full-Stack',
    tech: ['React', 'Node.js', 'Express.js', 'MySQL', 'Tailwind CSS', 'Docker'],
    summary: 'Expense splitter for roommates, friends and trips: groups, smart splits, debt simplification and budgets.',
    points: [
      'Built a full-stack expense-sharing app with React 19 (Vite), Tailwind CSS, Node.js, Express 5 and MySQL 8.',
      'Supports four split types (equal, exact, percentage, shares) and a greedy debt-simplification algorithm that minimises the number of payments.',
      'Stores all money as integer paise with the largest-remainder method, so shares always add up exactly - no floating-point errors.',
      'Added confirmed settlements (payer records, receiver confirms) using transactions and per-group locks to prevent double settling.',
      'Built groups with invite codes and admin/member roles, budgets with 80% / 100% alerts, notifications, and dashboard charts with Recharts.',
      'Secured with JWT auth, bcrypt, parameterised SQL, input validation, rate limiting, Helmet and strict CORS.',
      'Wrote 194 Jest + Supertest tests (about 97% line coverage) plus a Postman/Newman suite; containerised with Docker Compose.',
    ],
    github: 'https://github.com/pcharan2006/SplitSmart',
  },
  {
    title: 'PETVERSE',
    emoji: '🐾',
    type: 'Full-Stack',
    tech: ['React', 'Node.js', 'Express.js', 'MySQL'],
    summary: 'A full-stack pet care marketplace with four user roles and complete e-commerce flows.',
    points: [
      'Developed a full-stack pet care marketplace using React, Node.js, Express.js, and MySQL.',
      'Built RESTful APIs supporting authentication, cart, checkout, orders, payments, reviews, and service booking.',
      'Implemented secure backend logic and complete e-commerce workflows.',
      'Developed admin dashboards supporting four user roles: Customer, Pet Owner, Pet Seller, and Administrator.',
    ],
    github: 'https://github.com/pcharan2006',
  },
  {
    title: 'Automated Task Reminder',
    emoji: '⏰',
    type: 'Full-Stack',
    tech: ['Java Spring Boot', 'React', 'MySQL'],
    summary: 'Task management app with scheduling, reminders and status tracking.',
    points: [
      'Built a full-stack task management application using Spring Boot, React, and MySQL.',
      'Designed REST APIs for task scheduling, reminders, updates, and status tracking.',
      'Integrated Spring Boot backend with React frontend for seamless task management.',
      'Designed dashboards for efficient task monitoring and productivity.',
    ],
    github: 'https://github.com/pcharan2006',
  },
]

export const skills = {
  Programming: ['Java', 'Python', 'JavaScript', 'C'],
  Backend: ['Spring Boot', 'Node.js', 'Express.js', 'REST APIs'],
  Frontend: ['React.js', 'HTML', 'CSS'],
  Database: ['MySQL', 'SQL'],
  'Dev Tools': ['Git', 'GitHub', 'VS Code', 'Postman'],
  'Core CS': ['DSA', 'DBMS', 'OOP', 'Operating Systems', 'Computer Networks'],
  'Soft Skills': ['Problem Solving', 'Analytical Thinking', 'Teamwork', 'Communication'],
}

export const achievements = [
  {
    icon: '🎓',
    text: 'Completed the GeeksforGeeks Generative AI & Prompt Engineering Program covering LangChain, RAG, MCP, Transformers, Embeddings, Vector Databases, and LLM Deployment.',
  },
  { icon: '💼', text: 'Selected for Infosys Springboard Virtual Internship 6.0 Program.' },
  { icon: '☕', text: 'Certified in Infosys Springboard Java with a score of 76%.' },
  { icon: '🎤', text: 'Core Member of Proshows Committee, Abhisarga 2026.' },
]
