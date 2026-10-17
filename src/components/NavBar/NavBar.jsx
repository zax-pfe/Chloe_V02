import Link from "next/link";
import { useRouter } from "next/router";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./style.module.scss";

const MotionLink = motion.create(Link);

const navLinks = [
  { href: "/pieces", label: "Pieces" },
  { href: "/drawings", label: "Drawings" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBar}>
        {navLinks.map(({ href, label }) => {
          const isActive =
            router.pathname === href || router.pathname.startsWith(`${href}/`);

          return (
            <MotionLink
              key={href}
              href={href}
              className={styles.navLink}
              initial={false}
              animate={{
                backgroundColor: isActive ? "#000000" : "#fffbf6",
                color: isActive ? "#ffffff" : "#000000",
              }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeInOut" }}
              aria-current={isActive ? "page" : undefined}
            >
              <p>{label}</p>
            </MotionLink>
          );
        })}
      </div>
    </div>
  );
}
