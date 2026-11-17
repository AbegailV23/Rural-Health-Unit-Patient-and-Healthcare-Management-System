import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  LogOut,
  CalendarDays,
  ClipboardList
} from "lucide-react";
import "./styles.css";

const demoAccounts = [
  {
    username: "pharmacist",
    password: "PR123",
    name: "System Administrator",
    role: "Admin"
  },
  {
    username: "doctor",
    password: "doctor123",
    name: "Dr. Alex Reyes",
    role: "Doctor"
  },
  {
    username: "nurse",
    password: "nurse123",
    name: "Nurse Jamie Santos",
    role: "Nurse"
  },
  {
    username: "patient",
    password: "patient123",
    name: "Juan Dela Cruz",
    role: "Patient"
  }
];

const roleDetails = {
  Admin: {
    icon: ShieldCheck,
    description: "Manage users and health center records"
  },
  Doctor: {
    icon: Stethoscope,
    description: "View consultations and patient records"
  },
  Nurse: {
    icon: HeartPulse,
    description: "Manage patient care and vital signs"
  },
  Patient: {
    icon: UserRound,
    description: "Access appointments and health information"
  }
};

export default function App() {
  const [accounts, setAccounts] = useState(() => {
    try {
      const savedAccounts = JSON.parse(
        localStorage.getItem("healthAccounts")
      );

      return Array.isArray(savedAccounts)
        ? savedAccounts
        : demoAccounts;
    } catch {
      return demoAccounts;
    }
  });

  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("healthAppointments")) || [];
  } catch {
    return [];
  }
});

const [appointmentService, setAppointmentService] = useState("");
const [appointmentDate, setAppointmentDate] = useState("");
const [appointmentTime, setAppointmentTime] = useState("");
const [appointmentReason, setAppointmentReason] = useState("");
const [appointmentMessage, setAppointmentMessage] = useState("");
const [appointmentError, setAppointmentError] = useState("");

function bookAppointment(event) {
  event.preventDefault();
  setAppointmentMessage("");
  setAppointmentError("");

  if (!appointmentService || !appointmentDate || !appointmentTime) {
    setAppointmentError("Please complete all required fields.");
    return;
  }

  const selectedDateTime = new Date(
    `${appointmentDate}T${appointmentTime}`
  );

  if (selectedDateTime <= new Date()) {
    setAppointmentError("Please choose a future date and time.");
    return;
  }

  const newAppointment = {
    id: Date.now(),
    patientUsername: user.username,
    patientName: user.name,
    service: appointmentService,
    date: appointmentDate,
    time: appointmentTime,
    reason: appointmentReason.trim(),
    status: "Pending"
  };

  const updatedAppointments = [...appointments, newAppointment];

  setAppointments(updatedAppointments);
  localStorage.setItem(
    "healthAppointments",
    JSON.stringify(updatedAppointments)
  );

  setAppointmentService("");
  setAppointmentDate("");
  setAppointmentTime("");
  setAppointmentReason("");

  setAppointmentMessage(
    "Appointment request submitted successfully!"
  );
}

function cancelAppointment(id) {
  const updatedAppointments = appointments.map((appointment) =>
    appointment.id === id &&
    appointment.patientUsername === user.username
      ? { ...appointment, status: "Cancelled" }
      : appointment
  );

  setAppointments(updatedAppointments);
  localStorage.setItem(
    "healthAppointments",
    JSON.stringify(updatedAppointments)
  );
}

  function saveAccounts(updatedAccounts) {
    setAccounts(updatedAccounts);
    localStorage.setItem(
      "healthAccounts",
      JSON.stringify(updatedAccounts)
    );
  }

  function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const foundAccount = accounts.find(
      (account) =>
        account.username.toLowerCase() ===
          username.trim().toLowerCase() &&
        account.password === password
    );

    if (foundAccount) {
      setUser(foundAccount);
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  }

  function handleCreateAccount(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanUsername = username.trim();

    if (cleanName.length < 2) {
      setError("Please enter your complete name.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const usernameExists = accounts.some(
      (account) =>
        account.username.toLowerCase() ===
        cleanUsername.toLowerCase()
    );

    if (usernameExists) {
      setError("Username already exists. Please choose another.");
      return;
    }

    const newAccount = {
      name: cleanName,
      username: cleanUsername,
      password: password,
      role: "Patient"
    };

    const updatedAccounts = [...accounts, newAccount];

    saveAccounts(updatedAccounts);

    setFullName("");
    setUsername("");
    setPassword("");
    setMode("login");
    setSuccess("Account created successfully! You can now sign in.");
  }

  function openRegister() {
    setMode("register");
    setFullName("");
    setUsername("");
    setPassword("");
    setError("");
    setSuccess("");
  }

  function openLogin() {
    setMode("login");
    setFullName("");
    setUsername("");
    setPassword("");
    setError("");
    setSuccess("");
  }

  function logout() {
    setUser(null);
    setMode("login");
    setFullName("");
    setUsername("");
    setPassword("");
    setError("");
    setSuccess("");
  }

  // DASHBOARD
  if (user) {
    const RoleIcon =
      roleDetails[user.role]?.icon || UserRound;

    return (
      <main className="dashboard-shell">
        <header className="topbar">
          <a className="brand" href="#home">
            <span className="brand-mark">
              
            </span>

            <span>
              <b>Municipal Health Center</b>
              <small>HEALTH SERVICES PORTAL</small>
            </span>
          </a>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </header>

        <section className="welcome-panel">
          <div className="welcome-copy">
            <span className="eyebrow">
              YOUR HEALTH, OUR PRIORITY
            </span>

            <h1>Welcome, {user.name}!</h1>

            <p>
              You are signed in to the Municipal Health Center
              portal as <b>{user.role}</b>.
            </p>
          </div>

          <div className="welcome-icon">
            <HeartPulse size={70} />
          </div>
        </section>

        <section className="dashboard-content">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OVERVIEW</span>
              <h2>Your portal</h2>
            </div>

            <span className="role-chip">
              <RoleIcon size={15} />
              {user.role} account
            </span>
          </div>

          {user.role === "Patient" ? (
  <section className="appointment-section">
    <div className="appointment-heading">
      <div>
        <h2>Book an Appointment</h2>
        <p>Schedule your visit at the Municipal Health Center.</p>
      </div>
      <CalendarDays size={32} />
    </div>

    <form className="appointment-form" onSubmit={bookAppointment}>
      <label htmlFor="service">HEALTH SERVICE</label>
      <select
        id="service"
        value={appointmentService}
        onChange={(e) => setAppointmentService(e.target.value)}
        required
      >
        <option value="">Select a health service</option>
        <option value="General Consultation">General Consultation</option>
        <option value="Medical Check-up">Medical Check-up</option>
        <option value="Prenatal Check-up">Prenatal Check-up</option>
        <option value="Immunization">Immunization</option>
        <option value="Dental Consultation">Dental Consultation</option>
        <option value="Family Planning">Family Planning</option>
        <option value="Laboratory Request">Laboratory Request</option>
      </select>

      <div className="appointment-fields">
        <div>
          <label htmlFor="appointmentDate">PREFERRED DATE</label>
          <input
            id="appointmentDate"
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="appointmentTime">PREFERRED TIME</label>
          <select
            id="appointmentTime"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          >
            <option value="">Select time</option>
            <option value="08:00">8:00 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
          </select>
        </div>
      </div>

      <label htmlFor="appointmentReason">REASON FOR VISIT</label>
      <textarea
        id="appointmentReason"
        value={appointmentReason}
        onChange={(e) => setAppointmentReason(e.target.value)}
        placeholder="Briefly describe your concern..."
        rows="3"
      />

      {appointmentError && (
        <div className="error-message">{appointmentError}</div>
      )}

      {appointmentMessage && (
        <div className="success-message">{appointmentMessage}</div>
      )}

      <button type="submit" className="submit-btn">
        Submit Appointment <ArrowRight size={18} />
      </button>
    </form>

    <div className="my-appointments">
      <h2>My Appointments</h2>

      {appointments.filter(
        (item) => item.patientUsername === user.username
      ).length === 0 ? (
        <p className="empty-appointments">
          You don't have any appointments yet.
        </p>
      ) : (
        appointments
          .filter((item) => item.patientUsername === user.username)
          .sort((a, b) => b.id - a.id)
          .map((item) => (
            <article className="appointment-item" key={item.id}>
              <div className="appointment-item-info">
                <h3>{item.service}</h3>
                <p>
                  <CalendarDays size={15} />
                  {item.date} at {item.time}
                </p>
                {item.reason && <p>Reason: {item.reason}</p>}
                <span
                  className={`appointment-status ${
                    item.status.toLowerCase()
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {item.status === "Pending" && (
                <button
                  type="button"
                  className="cancel-appointment"
                  onClick={() => cancelAppointment(item.id)}
                >
                  Cancel
                </button>
              )}
            </article>
          ))
      )}
    </div>
  </section>
) : (
  <div className="quick-grid">
    <article className="quick-card">
      <span className="quick-icon blue"><CalendarDays /></span>
      <h3>Appointments</h3>
      <p>View and manage health center appointments.</p>
    </article>

    <article className="quick-card">
      <span className="quick-icon mint"><ClipboardList /></span>
      <h3>Health Records</h3>
      <p>Access relevant medical and consultation records.</p>
    </article>

    <article className="quick-card">
      <span className="quick-icon violet"><Users /></span>
      <h3>Health Services</h3>
      <p>See available programs and community services.</p>
    </article>
  </div>
)}

          <p className="demo-note">
            <ShieldCheck size={16} />
            Demo dashboard. Connect a secure backend before
            using real patient records.
          </p>
        </section>
      </main>
    );
  }

  // LOGIN AND REGISTRATION
  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">
            <HeartPulse size={23} />
          </span>

          <span>
            <b>Municipal Health Center</b>
            <small>HEALTH SERVICES PORTAL</small>
          </span>
        </a>

        <span className="secure-label">
          <ShieldCheck size={16} />
          Secure portal
        </span>
      </header>

      <section className="login-layout">
        {/* LEFT SIDE */}
        <div className="intro-panel">
          <div className="intro-content">
            <span className="eyebrow light">
              WELCOME TO YOUR COMMUNITY HEALTH PORTAL
            </span>

            <h1>
              Care that is
              <br />
              <em>closer to home.</em>
            </h1>

            <p>
              Connecting our community to accessible, reliable,
              and compassionate healthcare services.
            </p>

            <div className="intro-features">
              <div>
                <span>
                  <HeartPulse size={19} />
                </span>

                <div>
                  <b>Community-centered care</b>
                  <small>Health services for every family</small>
                </div>
              </div>

              <div>
                <span>
                  <ShieldCheck size={19} />
                </span>

                <div>
                  <b>Protected access</b>
                  <small>
                    Designed for authorized portal users
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="medical-art" aria-hidden="true">
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>

            <div className="cross-card">
              <span className="cross-symbol">+</span>

              <span>
                <b>HEALTH</b>
                <small>FOR EVERYONE</small>
              </span>
            </div>

            <div className="pulse-line">
              <Activity size={82} />
            </div>
          </div>

          <div className="panel-footer">
            SERVING OUR COMMUNITY WITH CARE
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="form-side">
          <div className="login-card">
            <div className="mobile-mark">
              <span className="brand-mark">
                <HeartPulse size={22} />
              </span>
            </div>

            <span className="eyebrow">
              {mode === "login"
                ? "PORTAL ACCESS"
                : "NEW ACCOUNT"}
            </span>

            <h2>
              {mode === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h2>

            <p className="form-subtitle">
              {mode === "login"
                ? "Please enter your login details."
                : "Fill in your information to register."}
            </p>

            {/* REGISTRATION NAME */}
            {mode === "register" && (
              <>
                <label
                  className="field-label"
                  htmlFor="fullName"
                >
                  FULL NAME
                </label>

                <div className="input-wrap">
                  <UserRound size={18} />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </>
            )}

            {/* LOGIN / REGISTER FORM */}
            <form
              onSubmit={
                mode === "login"
                  ? handleLogin
                  : handleCreateAccount
              }
            >
              <label
                className="field-label"
                htmlFor="username"
              >
                USERNAME
              </label>

              <div className="input-wrap">
                <UserRound size={18} />

                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder={
                    mode === "login"
                      ? "Enter your username"
                      : "Create a username"
                  }
                  required
                />
              </div>

              <label
                className="field-label password-label"
                htmlFor="password"
              >
                PASSWORD
              </label>

              <div className="input-wrap">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder={
                    mode === "login"
                      ? "Enter your password"
                      : "Create a password (at least 6 characters)"
                  }
                  required
                />

                <button
                  className="show-password"
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="success-message" role="status">
                  {success}
                </div>
              )}

              <button className="submit-btn" type="submit">
                {mode === "login"
                  ? "Sign in"
                  : "Create Account"}

                <ArrowRight size={18} />
              </button>
            </form>

            {mode === "login" ? (
              <>
                <div className="account-switch">
                  Don't have an account?
                </div>

                <button
                  type="button"
                  className="create-account-btn"
                  onClick={openRegister}
                >
                  Create New Account
                </button>
              </>
            ) : (
              <button
                type="button"
                className="create-account-btn"
                onClick={openLogin}
              >
                Back to Sign In
              </button>
            )}

            <div className="help-text">
              Having trouble signing in? Please contact your
              health center administrator.
            </div>
          </div>

          <div className="copyright">
            © 2026 Municipal Health Center. All rights reserved.
          </div>
        </div>
      </section>
    </main>
  );
}