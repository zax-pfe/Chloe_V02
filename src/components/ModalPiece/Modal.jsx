import styles from "./style.module.scss";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePieceStore } from "../store/store";
import ButtonSVG from "./ButtonSVG";

export default function Modal() {
  const selectedPiece = usePieceStore((state) => state.selectedPiece);
  const isModalOpen = usePieceStore((state) => state.isModalOpen);
  const closePiece = usePieceStore((state) => state.closePiece);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePiece();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closePiece]);

  return (
    <AnimatePresence>
      {isModalOpen && selectedPiece && (
        <motion.section
          key={selectedPiece.id}
          className={styles.modalContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className={styles.topContainer}>
            <h2 className={styles.pieceName}>{selectedPiece.title}</h2>
            <button type="button" className={styles.closeButton} onClick={closePiece}>
              <ButtonSVG />
            </button>
          </div>

          <div className={styles.botContainer}>
            <div className={styles.year}>
              <p>{selectedPiece.date}</p>
            </div>
            <div className={styles.description}>
              <p>{selectedPiece.description}</p>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
