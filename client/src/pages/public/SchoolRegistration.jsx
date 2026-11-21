
import { useState } from "react";
import {
  GraduationCap,
  School,
  Phone,
  MapPin,
  User,
  FileText,
  Building2,
} from "lucide-react";

import "../../App.css";

function SchoolRegistration() {
  const [form, setForm] = useState({
    schoolName: "",
    registrationNumber: "",
    affiliationNumber: "",
    board: "",
    schoolType: "",
    headName: "",
    headPhone: "",
    email: "",
    phone: "",
    alternativePhone: "",
    contactPerson: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Indian mobile number validation
  const phonePattern = /^[6-9][0-9]{9}$/;

  // Handle all input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const phoneFields = [
      "headPhone",
      "phone",
      "alternativePhone",
    ];

    // Allow only numbers in phone fields
    if (phoneFields.includes(name)) {
      const numbersOnly = value
        .replace(/[^0-9]/g, "")
        .slice(0, 10);

      setForm((previous) => ({
        ...previous,
        [name]: numbersOnly,
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  
// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const email = form.email.trim();

  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!phonePattern.test(form.headPhone)) {
    setError("Please enter a valid 10-digit Head of School mobile number.");
    return;
  }

  if (!phonePattern.test(form.phone)) {
    setError("Please enter a valid 10-digit School contact number.");
    return;
  }

  if (
    form.alternativePhone &&
    !phonePattern.test(form.alternativePhone)
  ) {
    setError("Please enter a valid 10-digit Alternative phone number.");
    return;
  }

  if (!/^[0-9]{6}$/.test(form.pincode)) {
    setError("Please enter a valid 6-digit pincode.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:5000/api/school-applications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Application submission failed.");
    }

    setSubmitted(true);
  } catch (err) {
    setError(err.message || "Unable to connect to server.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="registration-page">
      <div className="registration-card">

        {/* Logo */}
        <div className="registration-logo">
          <GraduationCap size={40} />
          <h2>EduTrack India</h2>
        </div>

        <h1>Register Your School</h1>

        <p>
          Join India's connected education ecosystem.
          Submit your school's details for verification.
        </p>

        {submitted ? (
  <div>
    <p>
      Your school application has been successfully
      submitted to EduTrack India.
    </p>

    <p>Application status: Pending verification.</p>

    <button
      type="button"
      className="registration-submit"
      onClick={() => setSubmitted(false)}
    >
      Back to Registration
    </button>
  </div>
) : (
  <form onSubmit={handleSubmit} noValidate>
    {error && (
      <div className="registration-error" role="alert">
        {error}
      </div>
    )}

            {/* SCHOOL INFORMATION */}

            <div className="registration-section">
              <Building2 size={21} />
              <h3>School Information</h3>
            </div>

            <label>School Name *</label>

            <input
              type="text"
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
              placeholder="Enter official school name"
              required
            />

            <label>School Registration Number *</label>

            <input
              type="text"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              placeholder="Enter government registration number"
              required
            />

            <label>School Affiliation Number</label>

            <input
              type="text"
              name="affiliationNumber"
              value={form.affiliationNumber}
              onChange={handleChange}
              placeholder="Enter affiliation number, if applicable"
            />

            <label>Education Board *</label>

            <select
              name="board"
              value={form.board}
              onChange={handleChange}
              required
            >
              <option value="">Select education board</option>
              <option value="CBSE">CBSE</option>
              <option value="CISCE">ICSE / CISCE</option>
              <option value="State Board">State Board</option>
              <option value="IB">IB</option>
              <option value="Cambridge">Cambridge</option>
              <option value="Other">Other</option>
            </select>

            <label>School Type *</label>

            <select
              name="schoolType"
              value={form.schoolType}
              onChange={handleChange}
              required
            >
              <option value="">Select school type</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Government Aided">
                Government Aided
              </option>
              <option value="International">
                International
              </option>
              <option value="Other">Other</option>
            </select>

            {/* HEAD OF SCHOOL */}

            <div className="registration-section">
              <User size={21} />
              <h3>Current Head of School</h3>
            </div>

            <label>
              Principal / Headmaster Full Name *
            </label>

            <input
              type="text"
              name="headName"
              value={form.headName}
              onChange={handleChange}
              placeholder="Enter current head of school name"
              required
            />

            <label>
              Principal / Headmaster Mobile Number *
            </label>

            <input
              type="tel"
              name="headPhone"
              value={form.headPhone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              required
            />

            {/* CONTACT INFORMATION */}

            <div className="registration-section">
              <Phone size={21} />
              <h3>Official Contact Information</h3>
            </div>

            <label>Official School Email *</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@school.com"
              required
            />

            <label>School Contact Number *</label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit school contact number"
              required
            />

            <label>Alternative Phone Number</label>

            <input
              type="tel"
              name="alternativePhone"
              value={form.alternativePhone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              placeholder="Optional 10-digit number"
            />

            <label>Authorized Contact Person *</label>

            <input
              type="text"
              name="contactPerson"
              value={form.contactPerson}
              onChange={handleChange}
              placeholder="Enter authorized representative name"
              required
            />

            {/* SCHOOL ADDRESS */}

            <div className="registration-section">
              <MapPin size={21} />
              <h3>School Location</h3>
            </div>

            <label>State *</label>

            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />

            <label>City / District *</label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city or district"
              required
            />
            <label>PIN Code *</label>
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit PIN code"
              required
            />

            <label>Complete School Address *</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter complete school address"
              required
            />

            {/* DISCLAIMER */}

            <div className="registration-disclaimer">
              <FileText size={20} />

              <span>
                School information will require verification
                before approval on EduTrack India.
              </span>
            </div>

            <button
              type="submit"
              className="registration-submit"
              disabled={loading}
            >
            {loading
              ? "Submitting Application..."
              : "Submit School Registration"}
            </button>

          </form>
        )}

        <p className="registration-note">
          EduTrack India · School Registration Portal
        </p>

      </div>
    </div>
  );
}

export default SchoolRegistration;