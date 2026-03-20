import { useEffect, useRef } from "react";

const Watermark = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 150;
    ctx.rotate((-25 * Math.PI) / 180);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
    ctx.fillText("拉卡拉-蒋晓栋", -10, 100);

    const dataUrl = canvas.toDataURL();
    if (containerRef.current) {
      containerRef.current.style.backgroundImage = `url(${dataUrl})`;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999] bg-repeat"
    />
  );
};

export default Watermark;
