import React, { useRef, useEffect, useState } from "react";

import "./scrawlbar.css";

type ScrawlbarProps = {
  children: React.ReactNode;
};

const Scrawlbar: React.FC<ScrawlbarProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [thumbHeight, setThumbHeight] = useState(20);
  const [thumbTop, setThumbTop] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [y, setY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const BUFFER_ROTATION = 400;


  useEffect(() => {
    const update = () => {
      setRotation(0);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (rotation === 0) {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      setRotation(20);

      const visible = container.clientHeight;
      const total = content.scrollHeight;
      if (visible === total) return;
      setScrollHeight(total + (total - visible));

      const ratio = visible / total;
      setThumbHeight(Math.max(visible * ratio, 20));
    }
  }, [rotation, contentRef.current]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || scrollHeight === 0) return;

    const visible = container.clientHeight;
    const scrollable = scrollHeight - visible;

    const newY = -(scrollPercent / 100) * scrollable;
    setY(newY + BUFFER_ROTATION);

    const maxThumbTop = visible - thumbHeight;
    setThumbTop((scrollPercent / 100) * maxThumbTop);
  }, [scrollPercent, scrollHeight, thumbHeight]);

  useEffect(() => {
    const thumb = thumbRef.current;
    const container = containerRef.current;
    if (!thumb || !container) return;

    let startY = 0;
    let startPercent = 0;

    const onStart = (clientY: number) => {
      startY = clientY;
      startPercent = scrollPercent;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", onTouchEnd);
      thumb.style.cursor = "grabbing";
    };

    const onMove = (clientY: number) => {
      const delta = clientY - startY;
      const visible = container.clientHeight;
      const maxThumbTop = visible - thumbHeight;

      const deltaPercent = (delta / maxThumbTop) * 100;
      const newPercent = Math.min(
        100,
        Math.max(0, startPercent + deltaPercent)
      );
      setScrollPercent(newPercent);
    };

    const onMouseDown = (e: MouseEvent) => {
      onStart(e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => {
      onMove(e.clientY);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      thumb.style.cursor = "grab";
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      onStart(e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      onMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => {
      onMouseUp();
    };

    thumb.addEventListener("mousedown", onMouseDown);
    thumb.addEventListener("touchstart", onTouchStart, { passive: false });

    return () => {
      thumb.removeEventListener("mousedown", onMouseDown);
      thumb.removeEventListener("touchstart", onTouchStart);
    };
  }, [scrollPercent, thumbHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const visible = container.clientHeight;
      const scrollable = scrollHeight - visible;

      if (scrollable <= 0) return;

      const deltaPercent =
        (e.deltaY / visible) * (visible / scrollHeight) * 100;
      setScrollPercent((prev) =>
        Math.min(100, Math.max(0, prev + deltaPercent * 10))
      );
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [scrollHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const startYRef = { value: 0 };
    const startPercentRef = { value: 0 };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startYRef.value = e.touches[0].clientY;
      startPercentRef.value = scrollPercent;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();

      const delta = startYRef.value - e.touches[0].clientY;
      const visible = container.clientHeight;
      const scrollable = scrollHeight - visible;
      if (scrollable <= 0) return;

      const deltaPercent = (delta / visible) * (visible / scrollHeight) * 20;

      setScrollPercent((oldPercent) => oldPercent + deltaPercent);
    };

    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, [scrollHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          perspective: "400px",
          position: "relative",
          perspectiveOrigin: "bottom",
          transformOrigin: "bottom center",
          transformStyle: "preserve-3d",
        }}
      >
        <section
          style={{
            transform: `rotateX(${rotation}deg) translateY(${y}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          <section className="scroll-bar-translate-z">{children}</section>
        </section>
      </div>

      <div
        style={{
          width: "8px",
          background: "rgb(77 68 49 / 30%)",
          borderRadius: "4px",
          position: "relative",
        }}
      >
        <div
          ref={thumbRef}
          style={{
            width: "100%",
            height: `${thumbHeight}px`,
            background: "#473410",
            borderRadius: "4px",
            cursor: "grab",
            position: "absolute",
            top: `${thumbTop}px`,
          }}
        />
      </div>
    </div>
  );
};

export default Scrawlbar;
