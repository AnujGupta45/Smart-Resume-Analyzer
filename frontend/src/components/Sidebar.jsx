import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">SmartResume</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>
        <div className="nav-group">
          <p className="nav-group-title">Analysis</p>
          <NavLink to="/" className="nav-item">
            <span className="nav-icon">📤</span>
            <span>New Scan</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">👤</span>
            <span>About Me</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">📜</span>
            <span>History</span>
          </NavLink>
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">U</div>
          <div className="user-info">
            <p className="user-name">Guest User</p>
            <p className="user-plan">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
