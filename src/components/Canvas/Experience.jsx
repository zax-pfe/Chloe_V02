import { Environment, OrbitControls, useEnvironment } from "@react-three/drei";
import { color } from "three/tsl";
import GLImages from "../FloatingImage/GLImages";
export const Experience = () => {
  // Wait for the HDR and keep its lifetime managed by the loader cache.
  const environment = useEnvironment({ preset: "sunset" });

  return (
    <>
      <OrbitControls />
      <Environment map={environment} />
      {/* <mesh>
        <boxGeometry />
        <meshStandardNodeMaterial colorNode={color("pink")} />
      </mesh> */}
      <GLImages />
    </>
  );
};
