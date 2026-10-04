import { Canvas, extend } from "@react-three/fiber";
import { Experience } from "./Experience";
import * as THREE from "three/webgpu";
import styles from "./style.module.scss";
import PostFX from "./PostFX";

export default function ThreeScene() {
  return (
    <div className={styles.canvas}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [0, 0, 3], fov: 30 }}
        gl={async (props) => {
          extend(THREE);

          const renderer = new THREE.WebGPURenderer({
            ...props,
            alpha: true,
            powerPreference: undefined,
          });
          renderer.setClearColor(0x000000, 0);
          if (process.env.NODE_ENV === "development") {
            await import("three/addons/inspector/tabs/Settings.js");
            const { Inspector } = await import("three/addons/inspector/Inspector.js");
            renderer.inspector = new Inspector();
          }
          await renderer.init();
          return renderer;
        }}
      >
        <Experience />
        <PostFX />
      </Canvas>
    </div>
  );
}
