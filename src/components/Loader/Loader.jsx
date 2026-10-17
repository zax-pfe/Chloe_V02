import { motion, useReducedMotion } from "framer-motion";
import { useSceneStore } from "../store/store";
import styles from "./style.module.scss";

const loaderVariants = {
  visible: { opacity: 1 },
  hidden: (reduceMotion) => ({
    opacity: 0,
    transition: { duration: reduceMotion ? 0 : 0.3, ease: "easeInOut" },
  }),
};

export default function Loader() {
  const isSceneReady = useSceneStore((state) => state.isSceneReady);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.loader}
      initial={false}
      variants={loaderVariants}
      custom={reduceMotion}
      animate={isSceneReady ? "hidden" : "visible"}
      style={{ pointerEvents: isSceneReady ? "none" : "auto" }}
      aria-hidden={isSceneReady}
    >
      <div className={styles.titleloader}>Chloe Girten</div>
    </motion.div>
  );
}
