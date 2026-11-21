
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  School,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  LogOut,
} from "lucide-react";

import "../../App.css";



function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login as Super Admin.");
      }

      const response = await fetch(
        "http://localhost:5000/api/school-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch applications.");
      }

      const formattedApplications = data.applications.map((item) => ({
        id: item._id,
        name: item.schoolName,
        board: item.board,
        city: item.city,
        state: item.state,
        email: item.email,
        phone: item.phone,
        principal: item.headName,
        registration: item.registrationNumber,
        status:
          item.status.charAt(0).toUpperCase() + item.status.slice(1),
        date: new Date(item.createdAt).toLocaleDateString("en-IN"),
      }));

      setApplications(formattedApplications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, []);
  const updateStatus = async (id, newStatus) => {
  try {
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again.");
    }

    const status = newStatus.toLowerCase();

    const response = await fetch(
      `http://localhost:5000/api/school-applications/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update status.");
    }

    setApplications((prev) =>
      prev.map((application) =>
        application.id === id
          ? { ...application, status: status.charAt(0).toUpperCase() + status.slice(1) }
          : application
      )
    );

    setSelectedSchool((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: status.charAt(0).toUpperCase() + status.slice(1),
          }
        : prev
    );

  } catch (error) {
    setError(error.message);
  }
};

  const filteredApplications = applications.filter((school) => {
    const matchesStatus =
      filter === "All" || school.status === filter;

    const matchesSearch =
      school.name.toLowerCase().includes(search.toLowerCase()) ||
      school.id.toLowerCase().includes(search.toLowerCase()) ||
      school.city.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pending = applications.filter(
    (school) => school.status === "Pending"
  ).length;

  const approved = applications.filter(
    (school) => school.status === "Approved"
  ).length;

  const rejected = applications.filter(
    (school) => school.status === "Rejected"
  ).length;

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <GraduationCap size={32} />
          <div>
            <strong>EduTrack</strong>
            <span>INDIA</span>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">SA</div>
          <div>
            <strong>Super Admin</strong>
            <span>Platform Administrator</span>
          </div>
        </div>

        <nav className="admin-navigation">
          <a href="/superadmin/applications" className="active">
            <School size={19} />
            School Applications
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <ShieldCheck size={18} />
          Secure Admin Portal
        </div>
      </aside>

      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <h1>School Applications</h1>
            <p>Review and manage school registration requests.</p>
          </div>

          <div className="admin-top-actions">
            <span className="admin-demo-label">
              DEMO MODE
            </span>
            <LogOut size={20} />
          </div>
        </header>

        <section className="admin-welcome">
          <div>
            <h2>Welcome, Super Admin!</h2>
            <p>
              Manage school applications from across India.
            </p>
          </div>
          <ShieldCheck size={48} />
        </section>

        <section className="admin-stats">

          <div className="admin-stat-card">
            <div className="stat-icon blue">
              <School />
            </div>
            <span>Total Applications</span>
            <h2>{applications.length}</h2>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon orange">
              <Clock />
            </div>
            <span>Pending</span>
            <h2>{pending}</h2>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon green">
              <CheckCircle />
            </div>
            <span>Approved</span>
            <h2>{approved}</h2>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon red">
              <XCircle />
            </div>
            <span>Rejected</span>
            <h2>{rejected}</h2>
          </div>

        </section>

        <section className="applications-panel">

          <div className="applications-heading">
            <div>
              <h2>Registration Requests</h2>
              <p>Review submitted school applications.</p>
            </div>

            <div className="application-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search school or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="application-filters">
            {["All", "Pending", "Approved", "Rejected"].map(
              (status) => (
                <button
                  key={status}
                  className={filter === status ? "selected" : ""}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>

          <div className="application-table-wrapper">
            <table className="application-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>School ID</th>
                  <th>Board</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>  
                {loading && (
                <tr>
                  <td colSpan="7">Loading applications...</td>
                </tr>
              )}

              {error && (
              <tr>
                  <td colSpan="7">{error}</td>
                </tr>
                )}
                {filteredApplications.map((school) => (
                  <tr key={school.id}>
                    <td>
                      <strong>{school.name}</strong>
                    </td>
                    <td>{school.id}</td>
                    <td>{school.board}</td>
                    <td>{school.city}, {school.state}</td>
                    <td>{school.date}</td>
                    <td>
                      <span
                        className={`application-status ${school.status.toLowerCase()}`}
                      >
                        {school.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-application"
                        onClick={() => setSelectedSchool(school)}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-applications">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

        <p className="admin-footer">
          © 2026 EduTrack India · Super Admin Portal
        </p>

      </main>

      {selectedSchool && (
        <div className="application-modal-overlay">
          <div className="application-modal">

            <button
              className="modal-close"
              onClick={() => setSelectedSchool(null)}
            >
              ×
            </button>

            <h2>School Application Details</h2>

            <h3>{selectedSchool.name}</h3>

            <p><strong>Application ID:</strong> {selectedSchool.id}</p>
            <p><strong>Registration Number:</strong> {selectedSchool.registration}</p>
            <p><strong>Board:</strong> {selectedSchool.board}</p>
            <p>
              <MapPin size={16} /> {selectedSchool.city}, {selectedSchool.state}
            </p>
            <p>
              <Mail size={16} /> {selectedSchool.email}
            </p>
            <p>
              <Phone size={16} /> {selectedSchool.phone}
            </p>
            <p><strong>Principal:</strong> {selectedSchool.principal}</p>
            <p><strong>Status:</strong> {selectedSchool.status}</p>

            {selectedSchool.status === "Pending" && (
              <div className="modal-actions">
                <button
                  className="approve-button"
                  onClick={() =>
                    updateStatus(selectedSchool.id, "Approved")
                  }
                >
                  <CheckCircle size={17} /> Approve
                </button>

                <button
                  className="reject-button"
                  onClick={() =>
                    updateStatus(selectedSchool.id, "Rejected")
                  }
                >
                  <XCircle size={17} /> Reject
                </button>
              </div>
            )}

            <p className="modal-demo-note">
              Demo data only. Approval is not persisted or official.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default Applications;