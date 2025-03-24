import { useState, useEffect } from "react";

const useAccessibility = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const savedFontSize = localStorage.getItem("fontSize");
    const savedHighContrast = localStorage.getItem("highContrast");
    const savedReducedMotion = localStorage.getItem("reducedMotion");

    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedHighContrast) setHighContrast(savedHighContrast === "true");
    if (savedReducedMotion) setReducedMotion(savedReducedMotion === "true");

    // Apply accessibility settings
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.body.classList.toggle("high-contrast", highContrast);
    document.body.classList.toggle("reduced-motion", reducedMotion);
  }, [fontSize, highContrast, reducedMotion]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
    localStorage.setItem("fontSize", fontSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
    localStorage.setItem("fontSize", fontSize - 2);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
    localStorage.setItem("highContrast", !highContrast);
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
    localStorage.setItem("reducedMotion", !reducedMotion);
  };

  return {
    fontSize,
    highContrast,
    reducedMotion,
    increaseFontSize,
    decreaseFontSize,
    toggleHighContrast,
    toggleReducedMotion,
  };
};

export default useAccessibility;
