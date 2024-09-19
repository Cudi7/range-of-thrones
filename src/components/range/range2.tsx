"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { type RangeFixedData, type rangeType } from "@/lib/types";
import { canMove, exceedsLimit } from "@/lib/utils";

export type RangeProps = {
  type: typeof rangeType.NORMAL | typeof rangeType.FIXED;
  data: RangeFixedData;
};

export function Range2({ type, data }: RangeProps) {
  const [leftPosition, setLeftPosition] = useState<number>(0);
  const [rightPosition, setRightPosition] = useState<number>(data.length - 1);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeBullet, setActiveBullet] = useState<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const leftBulletRef = useRef<HTMLDivElement>(null);
  const rightBulletRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (bullet: string) => {
    setIsDragging(true);
    setActiveBullet(bullet);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !activeBullet) return;

      document.body.style.cursor = "grabbing";

      const barRect = barRef.current?.getBoundingClientRect();
      const barOffset = barRect?.left || 0;
      const barWidth = barRect?.width || 0;
      const windowXPosition = e.clientX;

      if (!barWidth) return;

      const relativePosition = (windowXPosition - barOffset) / barWidth;
      const newIndex = Math.round(relativePosition * (data.length - 1));

      if (newIndex < 0 || newIndex > data.length - 1) return;

      if (activeBullet === "left") {
        if (
          canMove(newIndex) &&
          !exceedsLimit(newIndex, rightPosition, "left")
        ) {
          setLeftPosition(newIndex);
        }
      }

      if (activeBullet === "right") {
        if (
          canMove(newIndex) &&
          !exceedsLimit(newIndex, leftPosition, "right")
        ) {
          setRightPosition(newIndex);
        }
      }
    },
    [isDragging, activeBullet, data.length, leftPosition, rightPosition],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveBullet(null);
    document.body.style.removeProperty("cursor");
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  const getBulletStyle = (position: number) => {
    const percentage = (position / (data.length - 1)) * 100;
    if (percentage <= 0) return { left: "0" };
    if (percentage >= 100) return { right: "0" };
    return { left: `${percentage}%` };
  };

  return (
    <div className="relative h-2 rounded-xl">
      <div
        className="absolute inset-0 h-8 max-w-2xl rounded-md bg-white/70"
        ref={barRef}
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="text-md absolute -left-[70px] top-1/2 max-w-[60px] -translate-y-1/2 rounded-md bg-white p-1 font-semibold text-black">
          {data[leftPosition]?.toFixed(2)}
        </label>
        <label className="text-md absolute -right-[70px] top-1/2 max-w-[60px] -translate-y-1/2 rounded-md bg-white p-1 font-semibold text-black">
          {data[rightPosition]?.toFixed(2)}
        </label>

        <div
          ref={leftBulletRef}
          draggable
          onMouseDown={() => handleMouseDown("left")}
          className="absolute top-1/2 size-8 -translate-y-1/2 cursor-grab rounded-md bg-indigo-400 hover:size-10 active:z-10 active:size-10 active:cursor-grabbing"
          style={getBulletStyle(leftPosition)}
        />
        <div
          ref={rightBulletRef}
          onMouseDown={() => handleMouseDown("right")}
          className="absolute top-1/2 size-8 -translate-y-1/2 cursor-grab rounded-md bg-indigo-700 hover:size-10 active:size-10 active:cursor-grabbing"
          style={getBulletStyle(rightPosition)}
        />
      </div>
    </div>
  );
}
