import React from "react";
import Navbar from "../../../components/navbar";
import Sidebar from "../../../components/sidebar";
import Rightbar from "../../../components/rightbar";
//import Leftbar from "../../components/leftbar";
import dashboardStyles from "../../../styles/dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={dashboardStyles.dashboardContainer}>
      <Navbar />
      <div className={dashboardStyles.mainContent}>
        <Sidebar />
        <div className={dashboardStyles.contentArea}>
          {/* Buraya Dashboard içerikleri gelecek */}
          <h1>Dashboard</h1>
        </div>
        {/* <Rightbar /> */}
      </div>
      {/* <Leftbar /> */}
    </div>
  );
};

export default Dashboard;
