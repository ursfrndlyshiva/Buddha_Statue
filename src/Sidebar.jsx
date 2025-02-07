import React, { useState } from 'react';
import './App.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="container">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}></div>
      <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
        ☰
      </button>
    </div>
  );
};

export default Sidebar;
