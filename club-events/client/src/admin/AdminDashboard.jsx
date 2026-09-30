import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Sparkles,
  ArrowUpRight,
  LogOut,
  X,
  Eye,
  Filter,
} from "lucide-react";
import { signOut } from "firebase/auth";
import Button from "../components/Button.jsx";
import Badge from "../components/Badge.jsx";
import FormField from "../components/FormField.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorState from "../components/ErrorState.jsx";
import {
  CATEGORIES,
  getAllEventsAdmin,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventsApi.js";
import { getRegistrations } from "../services/registrationsApi.js";
import { auth } from "../services/firebase.js";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading"); // 'loading' | 'error' | 'ready'
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'registrations'

  // Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Workshop",
    date: new Date().toISOString().slice(0, 10),
    time: "5:00 PM",
    venue: "",
    description: "",
    status: "open",
    featured: false,
  });

  // Selected event for registration view
  const [selectedEventForRegs, setSelectedEventForRegs] = useState(null);

  // Statistics
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "open").length;
  const totalRegistrations = registrations.length;

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((e) => {
      const matchesSearch =
        !term ||
        e.name.toLowerCase().includes(term) ||
        e.venue.toLowerCase().includes(term);
      const matchesCategory = !category || e.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  const filteredRegistrations = useMemo(() => {
    if (!selectedEventForRegs) return registrations;
    return registrations.filter((r) => r.eventId === selectedEventForRegs);
  }, [registrations, selectedEventForRegs]);

  const loadAll = () => {
    setLoadStatus("loading");
    Promise.all([getAllEventsAdmin(), getRegistrations()])
      .then(([evts, regs]) => {
        setEvents(evts);
        setRegistrations(regs);
        setLoadStatus("ready");
      })
      .catch((err) => {
        setLoadError(err.message);
        setLoadStatus("error");
      });
  };

  useEffect(loadAll, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Actions
  const handleLogout = async () => {
    if (auth) await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({
      name: "",
      category: "Workshop",
      date: new Date().toISOString().slice(0, 10),
      time: "5:00 PM",
      venue: "",
      description: "",
      status: "open",
      featured: false,
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setFormData({ ...event });
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to remove this event?")) return;
    try {
      await deleteEvent(id); // soft delete on the server; registrations are kept
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.venue ||
      !formData.time ||
      !formData.description
    ) {
      alert("Please fill out Event Name, Time, Venue and Description");
      return;
    }

    setSaving(true);
    try {
      if (editingEvent) {
        const saved = await updateEvent(editingEvent.id, formData);
        setEvents((prev) =>
          prev.map((item) => (item.id === saved.id ? saved : item)),
        );
      } else {
        const saved = await createEvent(formData);
        setEvents((prev) => [saved, ...prev]);
      }
      setIsEventModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container admin-dashboard animate-fade-in">
      {/* Top Header */}
      <div className="admin-header">
        <div>
          <div className="kicker-tag">
            <Sparkles size={12} />
            Club Management Console
          </div>
          <h1 className="admin-title">Organizer Dashboard</h1>
          <p className="admin-subtitle">
            Manage events, attendee rosters, and track community engagement for
            NEXORA.
          </p>
        </div>

        <div className="admin-header-actions">
          <Button variant="primary" size="md" onClick={handleOpenAddModal}>
            <Plus size={16} /> Create Event
          </Button>
          <Link to="/" className="btn btn--secondary btn--md">
            Student View
          </Link>
          <Button variant="ghost" size="md" onClick={handleLogout}>
            <LogOut size={16} /> Log out
          </Button>
        </div>
      </div>

      {loadStatus === "loading" && (
        <Spinner label="Loading dashboard data..." />
      )}
      {loadStatus === "error" && (
        <ErrorState
          title="Couldn't load dashboard data"
          description={loadError}
          onRetry={loadAll}
        />
      )}

      {loadStatus === "ready" && (
        <>
          {/* KPI Cards */}
          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div
                className="admin-kpi-icon-wrap"
                style={{ background: "#EEF2FF", color: "#4F46E5" }}
              >
                <Calendar size={22} />
              </div>
              <div className="admin-kpi-content">
                <span className="admin-kpi-label">Total Events</span>
                <span className="admin-kpi-val">{totalEvents}</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div
                className="admin-kpi-icon-wrap"
                style={{ background: "#ECFDF5", color: "#059669" }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div className="admin-kpi-content">
                <span className="admin-kpi-label">Open for Registration</span>
                <span className="admin-kpi-val">{activeEvents}</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div
                className="admin-kpi-icon-wrap"
                style={{ background: "#ECFEFF", color: "#0891B2" }}
              >
                <Users size={22} />
              </div>
              <div className="admin-kpi-content">
                <span className="admin-kpi-label">Total RSVPs</span>
                <span className="admin-kpi-val">{totalRegistrations}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${activeTab === "events" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              <Calendar size={16} /> Event Catalog ({events.length})
            </button>
            <button
              type="button"
              className={`admin-tab ${activeTab === "registrations" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("registrations")}
            >
              <Users size={16} /> Attendee Registrations ({registrations.length}
              )
            </button>
          </div>

          {/* Events Table View */}
          {activeTab === "events" && (
            <div className="admin-table-container animate-fade-in">
              <div className="admin-table-toolbar">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="Filter events by title or venue..."
                />
                <CategoryFilter
                  categories={CATEGORIES}
                  value={category}
                  onChange={setCategory}
                />
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Category</th>
                      <th>Date & Time</th>
                      <th>Venue</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          style={{ textAlign: "center", padding: "32px" }}
                        >
                          No events found matching current criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.name}</strong>
                          </td>
                          <td>
                            <Badge tone="accent">{item.category}</Badge>
                          </td>
                          <td>
                            <div
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-ink-soft)",
                              }}
                            >
                              <div>{item.date}</div>
                              <div style={{ color: "var(--color-ink-muted)" }}>
                                {item.time}
                              </div>
                            </div>
                          </td>
                          <td>{item.venue}</td>
                          <td>
                            <Badge
                              tone={
                                item.status === "open"
                                  ? "success"
                                  : item.status === "closed"
                                    ? "warning"
                                    : "neutral"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td>
                            {item.featured ? (
                              <span className="admin-featured-pill">Yes</span>
                            ) : (
                              <span style={{ color: "var(--color-ink-light)" }}>
                                No
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="admin-table-actions">
                              <button
                                type="button"
                                className="admin-action-icon"
                                title="Edit Event"
                                onClick={() => handleOpenEditModal(item)}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                type="button"
                                className="admin-action-icon admin-action-icon--danger"
                                title="Delete Event"
                                onClick={() => handleDeleteEvent(item.id)}
                              >
                                <Trash2 size={15} />
                              </button>
                              <Link
                                to={`/events/${item.id}`}
                                className="admin-action-icon"
                                title="View Public Page"
                                target="_blank"
                              >
                                <ArrowUpRight size={15} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Registrations View */}
          {activeTab === "registrations" && (
            <div className="admin-table-container animate-fade-in">
              <div className="admin-table-toolbar">
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                    }}
                  >
                    Filter by Event:
                  </span>
                  <select
                    className="category-pill"
                    value={selectedEventForRegs || ""}
                    onChange={(e) =>
                      setSelectedEventForRegs(e.target.value || null)
                    }
                    style={{ padding: "8px 14px" }}
                  >
                    <option value="">
                      All Events ({registrations.length})
                    </option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Event</th>
                      <th>College & Year</th>
                      <th>Phone</th>
                      <th>Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "32px" }}
                        >
                          No attendee registrations recorded for this selection.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.registrationId || reg.id || reg.email}>
                          <td>
                            <strong>{reg.studentName}</strong>
                          </td>
                          <td>
                            <a
                              href={`mailto:${reg.email}`}
                              style={{ color: "var(--color-primary)" }}
                            >
                              {reg.email}
                            </a>
                          </td>
                          <td>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "var(--color-ink)",
                              }}
                            >
                              {reg.eventName}
                            </span>
                          </td>
                          <td>{reg.collegeYear}</td>
                          <td>{reg.phone}</td>
                          <td>
                            <span
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--color-ink-muted)",
                              }}
                            >
                              {new Date(
                                reg.registeredAt || reg.timestamp || Date.now(),
                              ).toLocaleDateString()}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Event Modal */}
      {isEventModalOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setIsEventModalOpen(false)}
        >
          <div
            className="admin-modal-card animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-modal-header">
              <h3>{editingEvent ? "Edit Event" : "Create New Event"}</h3>
              <button
                type="button"
                className="registration-form__close-btn"
                onClick={() => setIsEventModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="admin-modal-form">
              <FormField
                label="Event Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. AI & Robotics Workshop"
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <FormField
                  as="select"
                  label="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </FormField>

                <FormField
                  as="select"
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="open">Open (Accepting RSVPs)</option>
                  <option value="closed">Closed</option>
                  <option value="past">Past</option>
                </FormField>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <FormField
                  label="Date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                <FormField
                  label="Time"
                  placeholder="5:00 PM"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>

              <FormField
                label="Venue / Location"
                required
                placeholder="e.g. Innovation Lab Room 302"
                value={formData.venue}
                onChange={(e) =>
                  setFormData({ ...formData, venue: e.target.value })
                }
              />

              <FormField
                as="textarea"
                label="Description"
                placeholder="Details, requirements, agenda..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: 16,
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                />
                Feature this event on homepage spotlight
              </label>

              <div className="admin-modal-actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                >
                  {editingEvent ? "Save Changes" : "Publish Event"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsEventModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
