# Project rules

- Project: portfolio.
- Framework: Next.js, Pages Router (`src/pages`).
- Language: JavaScript / JSX. No TypeScript.
- Styles: SCSS Modules (`*.module.scss`), colocated with pages/components.
- Import styles: `import styles from "./page.module.scss";`.
- Apply styles: `<div className={styles.start}>start</div>`.
- Images: `import Image from "next/image";` when needed.
- Shared layout: `src/components/Layout.jsx`, mounted in `src/pages/_app.js`.
- Projects page: `src/pages/projects/index.jsx` (`/projects`).
- Planned 3D stack: Three.js, React Three Fiber (R3F), WebGPU, TSL.
- Planned animation stack: GSAP, Framer Motion.
- Install required dependencies when implementing those features; Sass is required before importing SCSS.
- Initial scope: plain shared `layout` text and `project` page text. No CSS or animations.
- Keep components minimal. No unused imports.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
