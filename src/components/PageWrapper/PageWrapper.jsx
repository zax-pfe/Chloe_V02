import styles from "./style.module.scss";

export default function PageWrapper({ children }) {
  return (
    <div className={styles.pageWrapper} data-lenis-prevent>
      {children}
    </div>
  );
}
