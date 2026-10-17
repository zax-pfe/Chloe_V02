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
  const environment = useEnvironment({ preset: "sunset" });

  return (
    <>
      <OrbitControls />
      <Environment map={environment} />
      <GLImages />
      {/* <TestCanvas /> */}
    </>
  );
};
