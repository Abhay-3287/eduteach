import { Routes, Route, Link } from "react-router-dom";
import SchoolRegistration from "./pages/public/SchoolRegistration";
import Applications from "./pages/superadmin/Applications";
import {
  GraduationCap,
  School,
  Users,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Menu
} from "lucide-react";

import Login from "./pages/Login";
import "./App.css";

function HomePage() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <GraduationCap size={32} />
          <span>
            EduTrack<span className="brand-highlight"> India</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register-school" className="register-btn">
             Register School
          </Link>
        </div>

        <Menu className="mobile-menu" />
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              ONE PLATFORM · EVERY SCHOOL
            </span>

            <h1>
              Transforming Education,
              <span> Connecting India.</span>
            </h1>

            <p>
              A unified digital platform connecting schools, teachers,
              students and parents across India. Manage education smarter,
              simpler and more transparently.
            </p>

            <div className="hero-actions">
              <button className="primary-btn">
                Explore Platform <ArrowRight size={18} />
              </button>

              <button className="secondary-btn">
                Find Your School
              </button>
            </div>

            <div className="trust-line">
              <ShieldCheck size={19} />
              Secure · Transparent · Connected
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-circle"></div>

            <div className="visual-card main-card">
              <GraduationCap size={55} />
              <h3>Education for Everyone</h3>
              <p>One connected ecosystem</p>
            </div>

            <div className="floating-card card-one">
              <School size={22} /> Schools
            </div>

            <div className="floating-card card-two">
              <Users size={22} /> Parents
            </div>

            <div className="floating-card card-three">
              <BookOpen size={22} /> Students
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <span>OUR ECOSYSTEM</span>
            <h2>Everything Education Needs</h2>
            <p>
              One platform designed for India's education community.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <School size={30} />
              <h3>School Management</h3>
              <p>
                Manage school profiles, classes, admissions and administration.
              </p>
            </article>

            <article className="feature-card">
              <Users size={30} />
              <h3>Parent Connect</h3>
              <p>
                Help parents stay informed about attendance, results and progress.
              </p>
            </article>

            <article className="feature-card">
              <BookOpen size={30} />
              <h3>Academic Records</h3>
              <p>
                Organize examinations, marks, subjects and student records.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer id="about">
        <div className="brand">
          <GraduationCap size={25} />
          <span>EduTrack India</span>
        </div>

        <p>Connecting India's education ecosystem.</p>
        <p>© 2026 EduTrack India. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/register-school"
        element={<SchoolRegistration />}
      />
      <Route
        path="/superadmin/applications"
        element={<Applications />}
      />
    </Routes>
  );
}

export default App;