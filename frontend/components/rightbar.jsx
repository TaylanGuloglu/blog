import React from "react";
import rightbarStyles from "../styles/rightbar.module.css";

const Rightbar = () => {
  return (
    <aside className={rightbarStyles.rightbar}>
      <h2>Notifications</h2>
      <ul>
        <li>New user registered</li>
        <li>Server rebooted</li>
        <li>Application updated</li>
      </ul>
    </aside>
  );
};

export default Rightbar;
