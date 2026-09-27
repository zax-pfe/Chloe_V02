import { createContext, useState, useEffect } from "react";

const DeviceModeContext = createContext({});

const DeviceModeProvider = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState("desktop");

  useEffect(() => {
    const thresholds = {
      phone: 750,
      m: 1300,
      l: 1920,
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= thresholds.phone) {
        setDeviceMode("phone");
      } else if (width <= thresholds.m) {
        setDeviceMode("m");
      } else if (width <= thresholds.l) {
        setDeviceMode("l");
      } else {
        setDeviceMode("xl");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DeviceModeContext.Provider value={{ deviceMode, setDeviceMode }}>
      {children}
    </DeviceModeContext.Provider>
  );
};

export { DeviceModeContext, DeviceModeProvider };
