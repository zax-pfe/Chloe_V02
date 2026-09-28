import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { positionLocal, texture as textureNode } from "three/tsl";

function Material({ map }) {
  const colorNode = useMemo(() => textureNode(map), [map]);

  return (
    <meshStandardNodeMaterial colorNode={colorNode} positionNode={positionLocal} transparent />
  );
}

function GLImage({ url, scale, elementRef, index, basePosition = [0, 0, 0] }) {
  const meshRef = useRef(null);
  const map = useTexture(url);
  const aspect = map.image.width / map.image.height;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.elapsedTime;
    // Float around each image's base position, keeping its depth unchanged.
    meshRef.current.position.x = basePosition[0] + Math.sin(time * 0.6) * 0.08;
    meshRef.current.position.y = basePosition[1] + Math.sin(time * 0.8) * 0.12;
  });

  return (
    <mesh
      position={basePosition}
      ref={(element) => {
        meshRef.current = element;
        elementRef.current[index] = element;
      }}
      scale={scale}
    >
      <planeGeometry args={[aspect, 1]} />
      <Material map={map} />
    </mesh>
  );
}

export default function GLImages() {
  const elementRef = useRef([]);
  const gridRef = useRef(null);

  return (
    <group ref={gridRef}>
      <GLImage
        url="/img/1.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={0}
        basePosition={[0, 0, 0]}
      />

      <GLImage
        url="/img/2.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={1}
        basePosition={[0.4, 0.4, 0]}
      />
    </group>
  );
}
