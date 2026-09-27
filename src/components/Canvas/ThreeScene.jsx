import { Canvas, extend } from "@react-three/fiber";
import { Experience } from "./Experience";
import * as THREE from "three/webgpu";
import styles from "./style.module.scss";

export default function ThreeScene() {
  return (
    <div className={styles.canvas}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [3, 3, 3], fov: 30 }}
        gl={async (props) => {
          extend(THREE);
          const renderer = new THREE.WebGPURenderer({
            ...props,
            // Let WebGPU choose the adapter; Windows ignores this preference.
            powerPreference: undefined,
          });
          await renderer.init();
          return renderer;
        }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </div>
  );
}
