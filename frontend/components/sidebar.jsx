import React from 'react';
import sidebarStyles from '../styles/sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={sidebarStyles.sidebar}>
      <ul>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Users</a></li>
        <li><a href="#">Analytics</a></li>
        <li><a href="#">Reports</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
