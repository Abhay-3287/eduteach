
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("Parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      const selectedRole = role.toLowerCase().replace(" ", "");

      if (data.user.role !== selectedRole) {
        throw new Error("Selected role does not match your account.");
      }

      localStorage.setItem("token", data.token);

      if (data.user.role === "superadmin") {
        navigate("/superadmin/applications");
      } else {
        setError("This dashboard is not available yet.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <GraduationCap size={42} />
          <h2>EduTrack India</h2>
        </div>

        <h1>Welcome Back!</h1>
        <p className="login-subtitle">
          Sign in to your education dashboard.
        </p>

        <form onSubmit={handleLogin}>

          <label>Select Your Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Parent">Parent</option>
            <option value="Teacher">Teacher</option>
            <option value="School Admin">School Admin</option>
            <option value="Super Admin">Super Admin</option>
          </select>

          <label>Email Address</label>
          <div className="login-input">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <label>Password</label>
          <div className="login-input">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p role="alert" style={{ color: "red" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="login-security">
          <ShieldCheck size={18} />
          Secure Education Platform
        </div>

        <p className="login-note">
          Connecting Schools, Teachers, Students and Parents.
        </p>

      </div>
    </div>
  );
}

export default Login;
