import { useState, useEffect } from "react";


const useResponsiveLogo = () => {
  const isSmallScreen = () => window.matchMedia("(max-width: 1100px)").matches;
  const [isSmallDevice, setIsSmallDevice] = useState(isSmallScreen);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    
    const updateState = (event) => {
      setIsSmallDevice(event.matches);
    };
    
    mediaQuery.addEventListener("change", updateState);
    
    return () => mediaQuery.removeEventListener("change", updateState);
  }, []);

  return {isSmallDevice };
};

export default useResponsiveLogo;
