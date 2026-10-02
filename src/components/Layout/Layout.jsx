import dynamic from "next/dynamic";
import styles from "./style.module.scss";
import NavBar from "../NavBar/NavBar";

const ThreeScene = dynamic(() => import("@/components/Canvas/ThreeScene"), {
  ssr: false,
});

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <ThreeScene />
      <div className={styles.titleBackContainer}>
        <h1 className={styles.titleBack}>Chloe Girten</h1>
      </div>
      {/* <div className={styles.titleContainer}>
        <h1 className={styles.title}>Chloe Girten</h1>
        </div> */}
      <div className={styles.pageRenderContainer}>
        <NavBar />
        <div className={styles.pageRender}>
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </div>
  );
}
