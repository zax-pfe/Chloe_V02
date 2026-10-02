import { motion } from "framer-motion";
import styles from "./style.module.scss";

const opacityVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  exit: { opacity: 0 },
};

export default function Inner({ children, withPanel = true }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={opacityVariants}
      className={`${styles.inner} ${withPanel ? styles.panel : ""}`.trim()}
    >
      {children}
    </motion.div>
  );
}
