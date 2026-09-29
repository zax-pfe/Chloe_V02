import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useFrame } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import { positionLocal, texture as textureNode } from "three/tsl";

function mod(n, m) {
  return ((n % m) + m) % m;
}

const CANVAS_HEIGHT = 2;
const CANVAS_WDTH = 2.9;
const TARGET_POSITION = [0.5, 0, 1.1];
const TARGET_SCALE = [1, 1, 1];

function Material({ map, opacity }) {
  const colorNode = useMemo(() => textureNode(map), [map]);
  const opacityNode = useMemo(() => opacity, [opacity]);
  const positionNode = useMemo(() => positionLocal, []);

  // const opacityNode = useMemo(() => textureNode(map), [map]);

  return <meshStandardNodeMaterial colorNode={colorNode} positionNode={positionNode} transparent />;
}

function GLImage({ url, scale, elementRef, index, basePosition = [0, 0, 0], angle, onSelect }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const meshRef = useRef(null);
  const selectedRef = useRef(false);
  const returningRef = useRef(false);
  const originalTransform = useRef(null);
  const map = useTexture(url);
  const aspect = map.image.width / map.image.height;
  const [randomAngle] = useState(() => Math.random() * Math.PI * 2);
  const [randomSpeed] = useState(() => Math.random() * 0.1);

  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.scale);
    };
  }, []);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={basePosition}
      userData={{
        basePosition: basePosition,
        angle: angle ?? randomAngle,
        randomSpeed: randomSpeed,
        selectedRef,
      }}
      ref={(element) => {
        meshRef.current = element;
        elementRef.current[index] = element;
      }}
      scale={scale}
      onClick={(event) => {
        event.stopPropagation();
        if (returningRef.current) return;
        const mesh = meshRef.current;
        const options = { duration: 1.2, ease: "power3.inOut", overwrite: true };
        if (selectedRef.current) {
          returningRef.current = true;
          const original = originalTransform.current;
          gsap.to(mesh.position, {
            x: original.position.x,
            y: original.position.y,
            z: original.position.z,
            ...options,
          });
          gsap.to(mesh.scale, {
            x: original.scale.x,
            y: original.scale.y,
            z: original.scale.z,
            ...options,
            onComplete: () => {
              selectedRef.current = false;
              returningRef.current = false;
              onSelect(null);
            },
          });
          return;
        }
        if (!onSelect(index)) return;
        originalTransform.current = {
          position: mesh.position.clone(),
          scale: mesh.scale.clone(),
        };
        selectedRef.current = true;
        gsap.to(mesh.position, {
          x: TARGET_POSITION[0],
          y: TARGET_POSITION[1],
          z: TARGET_POSITION[2],
          ...options,
        });
        gsap.to(mesh.scale, {
          x: TARGET_SCALE[0],
          y: TARGET_SCALE[1],
          z: TARGET_SCALE[2],
          ...options,
        });
      }}
    >
      <planeGeometry args={[aspect, 1]} />

      <Material map={map} />
    </mesh>
  );
}

export default function GLImages() {
  const imageSpeed = useRef(0.05);
  const activeImage = useRef(null);

  const elementRef = useRef([]);
  const gridRef = useRef(null);

  const handleSelect = (index) => {
    if (index !== null && activeImage.current !== null) return false;
    activeImage.current = index;
    // imageSpeed.current = index === null ? 0.05 : 0;
    return true;
  };

  useFrame(({ clock }, delta) => {
    const time = clock.elapsedTime;
    const wobble = (Math.sin(time) - Math.sin(time - delta)) * 0.01;

    elementRef.current.forEach((element) => {
      if (!element || element.userData.selectedRef.current) return;

      const { angle, randomSpeed } = element.userData;
      // Advance from the current position so floating resumes smoothly after deselection.
      const distance = delta * (randomSpeed + imageSpeed.current);
      const offsetX = Math.cos(angle) * distance + wobble;
      const offsetY = Math.sin(angle) * distance + wobble;

      element.position.x =
        mod(element.position.x + offsetX + CANVAS_WDTH / 2, CANVAS_WDTH) - CANVAS_WDTH / 2;
      element.position.y =
        mod(element.position.y + offsetY + CANVAS_HEIGHT / 2, CANVAS_HEIGHT) - CANVAS_HEIGHT / 2;
    });
  });

  return (
    <group ref={gridRef}>
      <GLImage
        url="/img/1.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={0}
        onSelect={handleSelect}
        basePosition={[0, 0, 0.1]}
      />

      <GLImage
        url="/img/2.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={1}
        onSelect={handleSelect}
        basePosition={[-0.6, 0.6, 0.9]}
      />
      <GLImage
        url="/img/3.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={2}
        onSelect={handleSelect}
        basePosition={[0.6, -0.6, 0.8]}
      />
      <GLImage
        url="/img/5.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={3}
        onSelect={handleSelect}
        basePosition={[8, 8, 0.7]}
      />
      <GLImage
        url="/img/4.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={elementRef}
        index={4}
        onSelect={handleSelect}
        basePosition={[-0.4, -0.4, 0.6]}
      />
      {/* 
      <GLImage
        url="/img/1.png"
        scale={[0.6, 0.6, 0.6]}
        elementRef={null}
        index={0}
        basePosition={[0, 0, 0]}
      /> */}
    </group>
  );
}
