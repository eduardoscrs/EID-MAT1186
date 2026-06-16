import { useEffect, useState } from "react";

export function useElementHeight(ref) {
  const [height, setHeight] = useState(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const updateHeight = () => {
      setHeight(Math.ceil(element.getBoundingClientRect().height));
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [ref]);

  return height;
}
