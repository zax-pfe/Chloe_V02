import { Environment, OrbitControls, useEnvironment } from "@react-three/drei";
import { color } from "three/tsl";
import GLImages from "../FloatingImage/GLImages";
import TitleText from "../3dText/3dText";

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
      {/* <TitleText /> */}
      <OrbitControls />
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
