import dynamic from "next/dynamic";
import styles from "./style.module.scss";

const ThreeScene = dynamic(() => import("@/components/Canvas/ThreeScene"), {
  ssr: false,
});

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <ThreeScene />
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Chloe Girten</h1>
      </div>
      <main>{children}</main>
    </div>
  );
}
