import React from 'react';
import './Sidebar.css';
import logo from '/vite.png';

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'agents', label: 'Agents', icon: '🤖' },
    { id: 'workflows', label: 'Workflows', icon: '⚡' },
    { id: 'history', label: 'Execution History', icon: '📊' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="AgentForge" className="sidebar-logo" />
        <h3>AgentForge</h3>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item">
          <span className="sidebar-icon">⚙️</span>
          <span className="sidebar-label">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
