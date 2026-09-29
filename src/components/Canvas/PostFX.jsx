import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useEnvironment } from "@react-three/drei";
import { RenderPipeline, Vector2 } from "three/webgpu";
import {
  Fn,
  abs,
  clamp,
  color,
  dot,
  equirectUV,
  float,
  length,
  max,
  min,
  mix,
  normalize,
  pass,
  pow,
  reflect,
  refract,
  saturate,
  screenUV,
  smoothstep,
  texture,
  uniform,
  vec2,
  vec3,
  vec4,
} from "three/tsl";

// Dimensions en pixels CSS. Les reglages de l'effet sont regroupes ici.
const glass = {
  strength: 1,
  cornerRadius: 10,
  bevelWidth: 90, // Largeur de la zone deformee depuis les bords (px CSS).
  bevelSlope: 0.34, // Pente independante de la largeur et de l'epaisseur optique.
  bevelPower: 2.5,
  thickness: 22,
  ior: 1.45,
  dispersion: 0.035,
  refractStrength: 2.2,
  fresnelF0: 0.04,
  envIntensity: 0.35,
  rimWidth: 2,
  rimIntensity: 0.22,
  tint: "#ffffff",
  rimColor: "#ffffff",
  rimColorTop: "#ffffff",
};

export default function PostFX() {
  const { gl, scene, camera } = useThree();
  const envMap = useEnvironment({ preset: "sunset" });
  const renderRef = useRef(null);

  useEffect(() => {
    const pipeline = new RenderPipeline(gl);
    const scenePass = pass(scene, camera);
    const map = scenePass.getTextureNode("output");
    const planeSize = uniform(new Vector2(1, 1));
    const cameraWorld = uniform(camera.matrixWorld);
    const halfSize = planeSize.mul(0.5);
    const width = max(min(glass.bevelWidth, min(halfSize.x, halfSize.y)), 0.001);

    const roundedBoxDistance = Fn(([point]) => {
      const radius = min(glass.cornerRadius, min(halfSize.x, halfSize.y));
      const q = abs(point).sub(halfSize).add(radius);
      return length(max(q, vec2(0)))
        .add(min(max(q.x, q.y), 0))
        .sub(radius);
    });
    const bevelHeight = Fn(([point]) => {
      const edge = saturate(float(1).add(roundedBoxDistance(point).div(width)));
      return pow(max(float(1).sub(pow(edge, glass.bevelPower)), 0), 1 / glass.bevelPower).mul(
        width.mul(glass.bevelSlope),
      );
    });

    pipeline.outputNode = Fn(() => {
      const baseUv = screenUV;
      const rgba = map.sample(baseUv);
      const point = baseUv.sub(0.5).mul(planeSize);
      const distance = roundedBoxDistance(point).toVar();
      // Normale du biseau, calculee a partir de sa hauteur.
      const dx = bevelHeight(point.add(vec2(1, 0)))
        .sub(bevelHeight(point.sub(vec2(1, 0))))
        .mul(0.5);
      const dy = bevelHeight(point.add(vec2(0, 1)))
        .sub(bevelHeight(point.sub(vec2(0, 1))))
        .mul(0.5);
      const normal = normalize(vec3(dx.negate(), dy.negate(), 1)).toVar();
      const viewDir = vec3(0, 0, 1);
      const samples = [0, 1, 2].map((index) => {
        const eta = 1 / Math.max(glass.ior + glass.dispersion * (index - 1), 1.0001);
        const ray = refract(viewDir.negate(), normal, eta).toVar();
        const travel = float(glass.thickness).div(max(abs(ray.z), 0.05));
        const displaced = baseUv.add(ray.xy.mul(travel).mul(glass.refractStrength).div(planeSize));
        return map.sample(clamp(displaced, vec2(0), vec2(1))).toVar();
      });
      const refracted = vec3(samples[0].r, samples[1].g, samples[2].b);
      // Match coverage to the displaced RGB samples, including dispersion.
      const refractedAlpha = max(max(samples[0].a, samples[1].a), samples[2].a);

      // Passage de l'espace ecran (Y vers le bas) a l'espace monde du HDR.
      const reflection = reflect(viewDir.negate(), normal);
      const reflectionWorld = cameraWorld.mul(vec4(reflection.mul(vec3(1, -1, 1)), 0)).xyz;
      const environment = texture(envMap, equirectUV(normalize(reflectionWorld))).rgb;
      const fresnel = float(glass.fresnelF0).add(
        float(1 - glass.fresnelF0).mul(pow(saturate(float(1).sub(dot(normal, viewDir))), 5)),
      );
      const rim = smoothstep(float(-glass.rimWidth), float(0), distance).mul(glass.rimIntensity);
      const rimColor = mix(color(glass.rimColor), color(glass.rimColorTop), baseUv.y.oneMinus());
      const finished = mix(
        refracted.mul(color(glass.tint)),
        environment.mul(refractedAlpha),
        saturate(fresnel.mul(glass.envIntensity)),
      ).add(rimColor.mul(rim).mul(refractedAlpha));
      // Fondu uniquement sur le quart interieur du biseau.
      const mask = smoothstep(width.negate(), width.mul(-0.75), distance).mul(
        float(1).sub(smoothstep(float(-0.75), float(0.75), distance)),
      );
      const effectStrength = mask.mul(glass.strength);
      return vec4(
        mix(rgba.rgb, finished, effectStrength),
        mix(rgba.a, refractedAlpha, effectStrength),
      );
    })();

    renderRef.current = (size) => {
      planeSize.value.set(Math.max(size.width, 1), Math.max(size.height, 1));
      pipeline.render();
    };
    return () => {
      renderRef.current = null;
      pipeline.dispose();
      scenePass.dispose();
    };
  }, [gl, scene, camera, envMap]);

  useFrame(({ size }) => {
    if (renderRef.current) renderRef.current(size);
    else gl.render(scene, camera);
  }, 1);
  return null;
}
