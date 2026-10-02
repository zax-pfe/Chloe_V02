import { Text3D } from "@react-three/drei";

export default function TitleText() {
  return (
    <Text3D font={"./3DFonts/Ranade_Medium.json"}>
      Chloe Girten
      <meshStandardMaterial color="black" />
    </Text3D>
  );
}
