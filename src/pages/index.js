import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import { DeviceModeContext } from "@/context/DeviceContext";
import { useEffect, useRef, useState, useContext } from "react";

export default function Home() {
  const { deviceMode } = useContext(DeviceModeContext);
  console.log(deviceMode);

  return <div className={styles.start}>{/* <Link href="/projects">Projets</Link> */}</div>;
}
