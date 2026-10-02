import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./style.module.scss";

const navLinks = [
  { href: "/pieces", label: "Pieces" },
  { href: "/drawings", label: "Drawings" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const router = useRouter();

  return (
    <div className={styles.navBarContainer}>
      <div className={styles.navBar}>
        {navLinks.map(({ href, label }) => {
          const isActive = router.pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <p>{label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
