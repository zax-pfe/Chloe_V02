import { Environment, OrbitControls, useEnvironment } from "@react-three/drei";
import { color } from "three/tsl";
import GLImages from "../FloatingImage/GLImages";

function TestCanvas() {
  return (
    <mesh position={[0, 0, 0]}>
      <meshNormalMaterial wireframe />
      <planeGeometry args={[4, 2, 2]} />
    </mesh>
  );
}

export const Experience = () => {
  // Wait for the HDR and keep its lifetime managed by the loader cache.
  const environment = useEnvironment({ preset: "sunset" });

  return (
    <>
      {/* <OrbitControls /> */}
      <Environment map={environment} />
      {/* <mesh>
        <boxGeometry />
        <meshStandardNodeMaterial colorNode={color("pink")} />
      </mesh> */}
      <GLImages />
      {/* <TestCanvas /> */}
    </>
  );
};
