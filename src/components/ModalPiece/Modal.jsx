import styles from "./style.module.scss";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePieceStore } from "../store/store";

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
          role="dialog"
          aria-label={selectedPiece.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <button type="button" className={styles.closeButton} onClick={closePiece} aria-label="Fermer les informations de la pièce">
            ×
          </button>
          <h2>{selectedPiece.title}</h2>
          {selectedPiece.description && <p>{selectedPiece.description}</p>}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
