import styles from "./page.module.scss";
import { DeviceModeContext } from "@/context/DeviceContext";
import { useContext } from "react";

export default function Home() {
  const { deviceMode } = useContext(DeviceModeContext);
  console.log(deviceMode);

  return <div className={styles.start}></div>;
}
