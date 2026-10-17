import dynamic from "next/dynamic";
import styles from "./style.module.scss";
import NavBar from "../NavBar/NavBar";
import CloseButton from "../CloseButton/CloseButton";
import Modal from "../ModalPiece/Modal";
import Title from "../Title/Title";

const ThreeScene = dynamic(() => import("@/components/Canvas/ThreeScene"), {
  ssr: false,
});

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <ThreeScene />

      <div className={styles.content}>
        <Title />
        <div className={styles.topPageContainer}>
          <CloseButton />
        </div>
        <div className={styles.botPageContainer}>
          <NavBar />
          <Modal />
          <main className={styles.main}>{children}</main>
        </div>
      </div>
    </div>
  );
}
