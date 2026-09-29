import { motion } from "framer-motion";
import styles from "./style.module.scss";

export default function Inner({ children }) {
  const anim = (variants) => {
    return {
      initial: "inital",
      animate: "enter",
      exit: "exit",
      variants: variants,
    };
  };

  const opacity = {
    inital: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 1 },
  };

  const slide = {
    inital: { top: "100vh" },
    enter: { top: "100vh" },
    exit: {
      top: "0",
      transition: { duration: 0.8, ease: [0.645, 0.045, 0.355, 1] },
    },
  };

  const perspective = {
    inital: { y: 0, opacity: 1 },
    enter: { y: 0, opacity: 1 },
    exit: {
      y: -100,
      // opacity: 0.4,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const blackScreen = {
    initial: { opacity: 0 },
    enter: { opacity: 0 },
    exit: { opacity: 0.7, transition: { duration: 0.8 } },
  };

  return (
    <div className={styles.inner}>
      <motion.div {...anim(slide)} className={styles.slide} />
      <motion.div {...anim(perspective)}>
        <motion.div {...anim(opacity)} className={styles.page}>
          <motion.div {...anim(blackScreen)} className={styles.screen} />
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
