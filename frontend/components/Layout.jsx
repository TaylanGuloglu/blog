import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from '../styles/Layout.module.css'; // kendi css dosyanızı ekleyin

const Layout = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <Sidebar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
