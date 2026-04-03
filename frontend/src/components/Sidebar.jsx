import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

// ── SVG Icons (inline, no external dependency) ───────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg
    className="sidebar__nav-icon"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  home:    "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  blogs:   "M4 6h16M4 12h16M4 18h10",
  creators:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  contact: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  create:  "M12 5v14M5 12h14",
  update:  "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  myblogs: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8",
  logout:  "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  login:   "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4 M10 17l5-5-5-5 M15 12H3",
  menu:    "M3 12h18M3 6h18M3 18h18",
};

// ── Nav items per role ────────────────────────────────────────────────────────
const guestLinks = [
  { to: "/",         label: "Home",     icon: "home"     },
  { to: "/blogs",    label: "Blogs",    icon: "blogs"    },
  { to: "/creators", label: "Creators", icon: "creators" },
];

const userLinks = [
  { to: "/",         label: "Home",       icon: "home"     },
  { to: "/blogs",    label: "Blogs",      icon: "blogs"    },
  { to: "/creators", label: "Creators",   icon: "creators" },
  { to: "/contact",  label: "Contact Us", icon: "contact"  },
];

const adminLinks = [
  { to: "/",               label: "Home",           icon: "home",    section: "General"   },
  { to: "/blogs",          label: "Blogs",          icon: "blogs",   section: null        },
  { to: "/creators",       label: "Creators",       icon: "creators",section: null        },
  { to: "/contact",        label: "Contact Us",     icon: "contact", section: null        },
  { to: "/create-blog",    label: "Create Blog",    icon: "create",  section: "Dashboard" },
  { to: "/update-blog",    label: "Update Blogs",   icon: "update",  section: null        },
  { to: "/my-blogs",       label: "My Blogs",       icon: "myblogs", section: null        },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = !user ? guestLinks : isAdmin ? adminLinks : userLinks;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  const closeSidebar = () => setOpen(false);

  // Group admin links by section label
  const renderLinks = () => {
    if (!isAdmin || !user) {
      return links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/"}
          className={({ isActive }) =>
            "sidebar__nav-link" + (isActive ? " active" : "")
          }
          onClick={closeSidebar}
        >
          <Icon d={icons[link.icon]} />
          {link.label}
        </NavLink>
      ));
    }

    // Admin: render with section labels
    let lastSection = null;
    return links.map((link) => {
      const showSection = link.section && link.section !== lastSection;
      if (showSection) lastSection = link.section;
      return (
        <div key={link.to}>
          {showSection && (
            <p className="sidebar__section-label">{link.section}</p>
          )}
          <NavLink
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              "sidebar__nav-link" + (isActive ? " active" : "")
            }
            onClick={closeSidebar}
          >
            <Icon d={icons[link.icon]} />
            {link.label}
          </NavLink>
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="sidebar-overlay active"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${open ? " open" : ""}`}>
        {/* Logo */}
        <div className="sidebar__header">
          <NavLink to="/" onClick={closeSidebar}>
            <div className="sidebar__logo">
              Blog<span>Nest</span>
            </div>
          </NavLink>
          <p className="sidebar__tagline">Words worth reading</p>
        </div>

        {/* Nav links */}
        <nav className="sidebar__nav">{renderLinks()}</nav>

        {/* Footer: user info + action button */}
        <div className="sidebar__footer">
          {user && (
            <div className="sidebar__user-info">
              <img
                src={user.photo?.url}
                alt={user.name}
                className="sidebar__avatar"
              />
              <div>
                <p className="sidebar__user-name">{user.name}</p>
                <p className="sidebar__user-role">{user.role}</p>
              </div>
            </div>
          )}

          {user ? (
            <button className="btn btn--ghost" onClick={handleLogout}>
              <Icon d={icons.logout} size={14} />
              Logout
            </button>
          ) : (
            <NavLink to="/login" onClick={closeSidebar}>
              <button className="btn btn--login">
                <Icon d={icons.login} size={14} />
                Login
              </button>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}