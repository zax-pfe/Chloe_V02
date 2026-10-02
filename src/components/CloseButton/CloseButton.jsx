import styles from "./style.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";

const closeButtonVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export default function CloseButton() {
  const router = useRouter();
  const isRootPage = router.pathname === "/";

  return (
    <AnimatePresence>
      {!isRootPage && (
        <motion.div
          className={styles.closeButtonContainer}
          variants={closeButtonVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Link href="/" className={styles.closeButton}>
            x
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
