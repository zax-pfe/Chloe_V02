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

const TARGET_POSITION = [0.2, 0, 1.5];
const TRANSITION_DURATION = 1.2;
const WAVE_AMPLITUDE = 0.1;
const WAVE_ATTACK_DURATION = 0.3;
const WAVE_SETTLE_DURATION = 0.9;
const WAVE_FREQUENCY = 0.8; // Approximately one cycle over the full animation.
const RESUME_DURATION = 0.8;
// Fixed variations: positions are XYZ; rotation and direction are in degrees.
// Amplitude is in scene units, frequency in Hz, and phase in radians.
const IMAGE_CONFIGS = [
  {
    url: "/img/1.png",
    basePosition: [0, 0, -1.73],
    scale: [1, 1, 1],
    rotation: -18,
    direction: 37,
    speed: 0.137,
    amplitude: 0.014,
    frequency: 0.085,
    phase: [0.72, 4.18],
  },
  {
    url: "/img/2.png",
    basePosition: [-0.6, 0.6, 0.76],
    scale: [1, 1, 1],
    rotation: 24,
    direction: 158,
    speed: 0.182,
    amplitude: 0.022,
    frequency: 0.132,
    phase: [2.39, 5.61],
  },
  {
    url: "/img/3.png",
    basePosition: [0.6, -0.6, -0.91],
    scale: [1, 1, 1],
    rotation: -7,
    direction: 263,
    speed: 0.116,
    amplitude: 0.011,
    frequency: 0.068,
    phase: [4.83, 1.27],
  },
  {
    url: "/img/5.png",
    basePosition: [0.5, 0.35, 0.08],
    scale: [1, 1, 1],
    rotation: 13,
    direction: 319,
    speed: 0.164,
    amplitude: 0.018,
    frequency: 0.112,
    phase: [5.94, 3.06],
  },
  {
    url: "/img/4.png",
    basePosition: [-0.4, -0.4, -0.38],
    scale: [1, 1, 1],
    rotation: -26,
    direction: 104,
    speed: 0.193,
    amplitude: 0.016,
    frequency: 0.149,
    phase: [1.56, 0.43],
  },
];

function Material({ map, deformation }) {
  const colorNode = useMemo(() => textureNode(map), [map]);
  const positionNode = useMemo(() => {
    const noise = mx_noise_float(vec3(positionLocal.xy.mul(3), time.mul(0.8)));
    const wave = positionLocal.x
      .mul(5)
      .add(positionLocal.y.mul(3))
      .sub(time.mul(WAVE_FREQUENCY * Math.PI * 2))
      .sin();
    const displacement = wave.add(noise.mul(0.3)).mul(deformation).mul(WAVE_AMPLITUDE);
    return positionLocal.add(vec3(0, 0, displacement));
  }, [deformation]);

  return (
    <meshStandardNodeMaterial
      colorNode={colorNode}
      positionNode={positionNode}
      // PNG cutouts use per-pixel depth rather than whole-plane transparent sorting.
      transparent={true}
      alphaTest={0.5}
      // depthTest
      // depthWrite
    />
  );
}

function GLImage({
  url,
  elementRef,
  index,
  basePosition = [0, 0, 0],
  direction,
  speed,
  scale,
  rotation,
  amplitude,
  frequency,
  phase,
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
  const floatTime = useRef(0);
  const deformation = useMemo(() => uniform(0), []);
  const deformationTween = useRef(null);
  const map = useTexture(url);
  const aspect = map.image.width / map.image.height;
  const initialRotation = useMemo(() => [0, 0, (rotation * Math.PI) / 180], [rotation]);

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
      // Keep the current amplitude if interrupted, then let the wave settle gradually.
      deformationTween.current = gsap
        .timeline()
        .to(deformation, {
          value: 1,
          duration: WAVE_ATTACK_DURATION,
          ease: "power2.out",
        })
        .to(deformation, {
          value: 0,
          duration: WAVE_SETTLE_DURATION,
          ease: "power2.inOut",
        });
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
        angle: (direction * Math.PI) / 180,
        speed,
        selectedRef,
        floatMotion,
        floatTime,
        amplitude,
        frequency,
        phase,
      }}
      ref={(element) => {
        meshRef.current = element;
        elementRef.current[index] = element;
      }}
      scale={scale}
      rotation={initialRotation}
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
  const globalSpeed = useRef(0.3);

  const elementRef = useRef([]);
  const gridRef = useRef(null);

  const handleSelect = (index) => {
    const { selectedPiece, isModalOpen, openPiece, closePiece } = usePieceStore.getState();
    if (selectedPiece) {
      if (isModalOpen && selectedPiece.id === index) closePiece();
      return;
    }
    openPiece({ id: index, title: `Pièce ${index + 1}`, ...IMAGE_CONFIGS[index] });
  };

  useFrame(({ camera, viewport }, delta) => {
    elementRef.current.forEach((element) => {
      if (!element || element.userData.selectedRef.current) return;

      const {
        angle,
        speed: imageSpeed,
        floatMotion,
        floatTime,
        amplitude,
        frequency,
        phase,
      } = element.userData;
      const { width, height } = viewport.getCurrentViewport(camera, [0, 0, element.position.z]);
      const speed = globalSpeed.current * floatMotion.current.speed;
      // Advance from the current position so floating resumes smoothly after deselection.
      const distance = delta * imageSpeed * speed;
      const previousTime = floatTime.current;
      floatTime.current += delta * floatMotion.current.speed;
      const angularFrequency = frequency * Math.PI * 2;
      // Independent waves on each axis, paused during selection and resumed smoothly.
      const wobbleX =
        amplitude *
        (Math.sin(floatTime.current * angularFrequency + phase[0]) -
          Math.sin(previousTime * angularFrequency + phase[0]));
      const wobbleY =
        amplitude *
        (Math.sin(floatTime.current * angularFrequency * 0.83 + phase[1]) -
          Math.sin(previousTime * angularFrequency * 0.83 + phase[1]));
      const offsetX = Math.cos(angle) * distance + wobbleX;
      const offsetY = Math.sin(angle) * distance + wobbleY;

      element.position.x = mod(element.position.x + offsetX + width / 2, width) - width / 2;
      element.position.y = mod(element.position.y + offsetY + height / 2, height) - height / 2;
    });
  });

  return (
    <group ref={gridRef}>
      {IMAGE_CONFIGS.map((image, index) => (
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
