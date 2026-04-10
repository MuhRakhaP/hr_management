import React from "react";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../../utils/useAuth";
import "./navbar.css"; // Bagian: Import CSS

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left"></div>

      <div className="navbar-right">
        <button className="icon-btn-ghost">
          <Bell size={20} className="bell-icon" />
          <span className="notif-dot"></span>
        </button>

        <div className="profile-wrapper">
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?u=admin"}
            alt="Profile"
            className="avatar"
          />
          <div className="profile-text">
            <span className="name">{user?.name || "John Admin"}</span>
            <span className="role">{user?.role || "Administrator"}</span>
          </div>
        </div>

        <button
          className="icon-btn-ghost"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
