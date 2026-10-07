import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePieceStore } from "../store/store";
import { useFrame } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import {
  mx_noise_float,
  positionLocal,
  texture as textureNode,
  time,
  uniform,
  vec3,
} from "three/tsl";

function mod(n, m) {
  return ((n % m) + m) % m;
}

const PIECE_SCALE = [1, 1, 1];
const MIN_DEPTH = -2;
const MAX_DEPTH = 1.5;
const TARGET_POSITION = [0.3, 0, 1.3];
const TRANSITION_DURATION = 1.2;
const WAVE_AMPLITUDE = 0.1;
const RESUME_DURATION = 0.8;
const BASE_SPEED = 0.05;
const IMAGE_CONFIGS = [
  {
    url: "/img/1.png",
    basePosition: [0, 0],
    rotationSpeed: 0.08,
  },
  {
    url: "/img/2.png",
    basePosition: [-0.6, 0.6],
    rotationSpeed: -0.06,
  },
  {
    url: "/img/3.png",
    basePosition: [0.6, -0.6],
    rotationSpeed: 0.05,
  },
  {
    url: "/img/5.png",
    basePosition: [0.5, 0.35],
    rotationSpeed: -0.08,
  },
  {
    url: "/img/4.png",
    basePosition: [-0.4, -0.4],
    rotationSpeed: 0.07,
  },
];

function Material({ map, deformation }) {
  const colorNode = useMemo(() => textureNode(map), [map]);
  const positionNode = useMemo(() => {
    const noise = mx_noise_float(vec3(positionLocal.xy.mul(3), time.mul(0.8)));
    const wave = positionLocal.x.mul(5).add(positionLocal.y.mul(3)).sub(time.mul(5)).sin();
    const displacement = wave.add(noise.mul(0.3)).mul(deformation).mul(WAVE_AMPLITUDE);
    return positionLocal.add(vec3(0, 0, displacement));
  }, [deformation]);

  return (
    <meshStandardNodeMaterial
      colorNode={colorNode}
      positionNode={positionNode}
      // PNG cutouts use per-pixel depth rather than whole-plane transparent sorting.
      transparent={false}
      alphaTest={0.5}
      depthTest
      depthWrite
    />
  );
}

function GLImage({
  url,
  elementRef,
  index,
  basePosition = [0, 0, 0],
  angle,
  rotationSpeed,
  onSelect,
}) {
  const [hovered, setHovered] = useState(false);
  const isSelected = usePieceStore(
    (state) => state.isModalOpen && state.selectedPiece?.id === index,
  );
  const clearPiece = usePieceStore((state) => state.clearPiece);
  useCursor(hovered);

  const meshRef = useRef(null);
  const selectedRef = useRef(false);
  const returningRef = useRef(false);
  const originalTransform = useRef(null);
  const floatMotion = useRef({ speed: 1 });
  const deformation = useMemo(() => uniform(0), []);
  const deformationTween = useRef(null);
  const map = useTexture(url);
  const aspect = map.image.width / map.image.height;
  const [randomAngle] = useState(() => Math.random() * Math.PI * 2);
  const [randomSpeed] = useState(() => Math.random() * 0.1 + BASE_SPEED);

  useEffect(() => {
    const mesh = meshRef.current;
    const motion = floatMotion.current;
    return () => {
      gsap.killTweensOf(mesh.position);
      gsap.killTweensOf(mesh.rotation);
      gsap.killTweensOf(motion);
      deformationTween.current?.kill();
    };
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    const options = { duration: TRANSITION_DURATION, ease: "power3.inOut", overwrite: true };
    const motion = floatMotion.current;
    if (isSelected || (selectedRef.current && originalTransform.current)) {
      deformationTween.current?.kill();
      // Half a sine wave: zero at both ends, maximum halfway through.
      deformationTween.current = gsap.fromTo(
        deformation,
        { value: 0 },
        {
          value: 1,
          duration: TRANSITION_DURATION,
          ease: (progress) => Math.sin(Math.PI * progress),
          onComplete: () => {
            deformation.value = 0;
          },
        },
      );
    }
    if (isSelected) {
      gsap.killTweensOf(motion);
      motion.speed = 0;
      // Keep the same orientation while avoiding a full spin toward zero.
      mesh.rotation.z = Math.atan2(Math.sin(mesh.rotation.z), Math.cos(mesh.rotation.z));
      originalTransform.current = {
        position: mesh.position.clone(),
        rotation: mesh.rotation.clone(),
      };
      selectedRef.current = true;
      gsap.to(mesh.position, {
        x: TARGET_POSITION[0],
        y: TARGET_POSITION[1],
        z: TARGET_POSITION[2],
        ...options,
      });
      gsap.to(mesh.rotation, { x: 0, y: 0, z: 0, ...options });
    } else if (selectedRef.current && originalTransform.current) {
      returningRef.current = true;
      const original = originalTransform.current;
      gsap.to(mesh.position, {
        x: original.position.x,
        y: original.position.y,
        z: original.position.z,
        ...options,
      });
      gsap.to(mesh.rotation, {
        x: original.rotation.x,
        y: original.rotation.y,
        z: original.rotation.z,
        ...options,
        onComplete: () => {
          selectedRef.current = false;
          returningRef.current = false;
          gsap.to(motion, {
            speed: 1,
            duration: RESUME_DURATION,
            ease: "power2.inOut",
            overwrite: true,
          });
          clearPiece();
        },
      });
    }
  }, [isSelected, clearPiece, deformation]);

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={basePosition}
      userData={{
        basePosition: basePosition,
        angle: angle ?? randomAngle,
        randomSpeed: randomSpeed,
        rotationSpeed,
        selectedRef,
        floatMotion,
        wrapRadius: (Math.hypot(aspect, 1) * PIECE_SCALE[0]) / 2,
      }}
      ref={(element) => {
        meshRef.current = element;
        elementRef.current[index] = element;
      }}
      scale={PIECE_SCALE}
      onClick={(event) => {
        event.stopPropagation();
        if (!returningRef.current) onSelect(index);
      }}
    >
      <planeGeometry args={[aspect, 1, 32, 32]} />

      <Material map={map} deformation={deformation} />
    </mesh>
  );
}

export default function GLImages() {
  const [images] = useState(() => {
    // Sample one depth per band so every loading has a broad size variation.
    const bandWidth = (MAX_DEPTH - MIN_DEPTH) / IMAGE_CONFIGS.length;
    const depths = IMAGE_CONFIGS.map((_, index) => MIN_DEPTH + (index + Math.random()) * bandWidth);
    for (let index = depths.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [depths[index], depths[other]] = [depths[other], depths[index]];
    }
    return IMAGE_CONFIGS.map((image, index) => ({
      ...image,
      basePosition: [...image.basePosition, depths[index]],
    }));
  });
  const globalSpeed = useRef(0.3);

  const elementRef = useRef([]);
  const gridRef = useRef(null);

  const handleSelect = (index) => {
    const { selectedPiece, isModalOpen, openPiece, closePiece } = usePieceStore.getState();
    if (selectedPiece) {
      if (isModalOpen && selectedPiece.id === index) closePiece();
      return;
    }
    openPiece({ id: index, title: `Pièce ${index + 1}`, ...images[index] });
  };

  useFrame(({ clock, camera, viewport }, delta) => {
    const time = clock.elapsedTime;
    const wobble = (Math.sin(time) - Math.sin(time - delta)) * 0.01;

    elementRef.current.forEach((element) => {
      if (!element || element.userData.selectedRef.current) return;

      const { angle, randomSpeed, rotationSpeed, floatMotion, wrapRadius } = element.userData;
      const { width, height } = viewport.getCurrentViewport(camera, [0, 0, element.position.z]);
      // Wrap only once the whole piece is offscreen, at its own depth.
      const wrapWidth = width + wrapRadius * 2;
      const wrapHeight = height + wrapRadius * 2;
      const speed = globalSpeed.current * floatMotion.current.speed;
      // Advance from the current position so floating resumes smoothly after deselection.
      const distance = delta * randomSpeed * speed;
      const offsetX = Math.cos(angle) * distance + wobble * floatMotion.current.speed;
      const offsetY = Math.sin(angle) * distance + wobble * floatMotion.current.speed;

      element.position.x =
        mod(element.position.x + offsetX + wrapWidth / 2, wrapWidth) - wrapWidth / 2;
      element.position.y =
        mod(element.position.y + offsetY + wrapHeight / 2, wrapHeight) - wrapHeight / 2;
      element.rotation.z += delta * rotationSpeed * speed;
    });
  });

  return (
    <group ref={gridRef}>
      {images.map((image, index) => (
        <GLImage
          key={image.url}
          {...image}
          elementRef={elementRef}
          index={index}
          onSelect={handleSelect}
        />
      ))}
    </group>
  );
}
