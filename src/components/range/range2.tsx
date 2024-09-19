"use client";
import { type RangeFixedData, rangeType } from "@/lib/types";
import { canMove, exceedsLimit } from "@/lib/utils";
import React, { useState, useRef, useEffect, useCallback } from "react";

export type RangeProps = {
  type: typeof rangeType.NORMAL | typeof rangeType.FIXED;
  data: RangeFixedData;
};

export function Range2({ type, data }: RangeProps) {
  if (type === rangeType.NORMAL) console.log(rangeType.NORMAL);
  else if (type === rangeType.FIXED) console.log(rangeType.FIXED);

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

      const barOffset = barRef.current?.getBoundingClientRect().left;
      const barWidth = barRef.current?.getBoundingClientRect().width;
      const windowXPosition = e.clientX;
      const bulletWidth = leftBulletRef.current?.offsetWidth || 0;

      if (!barOffset || !barWidth || !windowXPosition) return;

      const relativePosition =
        (windowXPosition - barOffset - bulletWidth / 2) / barWidth;

      const newIndex = Math.round(relativePosition * (data.length - 1));

      if (newIndex < 0 || newIndex > data.length - 1) return;

      if (activeBullet === "left") {
        if (
          canMove(newIndex) &&
          !exceedsLimit(newIndex, rightPosition, "left")
        ) {
          setLeftPosition(newIndex);
          leftBulletRef.current!.style.left = `${(newIndex / (data.length - 1)) * 100}%`;
        }
      }

      if (activeBullet === "right") {
        if (
          canMove(newIndex) &&
          !exceedsLimit(newIndex, leftPosition, "right")
        ) {
          setRightPosition(newIndex);
          rightBulletRef.current!.style.left = `${(newIndex / (data.length - 1)) * 100}%`;
        }
      }
    },
    [isDragging, activeBullet, barRef, leftPosition, rightPosition, data],
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
  }, [isDragging, leftPosition, rightPosition, activeBullet, handleMouseMove]);

  return (
    <div className="relative h-2 rounded-xl">
      <div
        className="absolute inset-0 h-8 max-w-2xl rounded-2xl bg-white/70"
        ref={barRef}
        onMouseDown={(e) => e.preventDefault()}
      >
        <label className="text-md absolute -left-[70px] top-[50%] max-w-[60px] translate-y-[-50%] rounded-lg bg-white p-1 px-4 py-2 font-semibold text-black">
          {data[leftPosition]!.toFixed(2)}{" "}
        </label>
        <label className="text-md absolute -right-[70px] top-[50%] max-w-[60px] translate-y-[-50%] rounded-lg bg-white p-1 px-4 py-2 font-semibold text-black">
          {data[rightPosition]!.toFixed(2)}{" "}
        </label>

        <div
          ref={leftBulletRef}
          draggable
          onMouseDown={() => handleMouseDown("left")}
          className="absolute left-0 top-[50%] block size-8 translate-y-[-50%] cursor-grab rounded-full bg-indigo-400 hover:size-10 active:z-10 active:size-10 active:cursor-grabbing"
        />
        <div
          ref={rightBulletRef}
          onMouseDown={() => handleMouseDown("right")}
          className="absolute right-0 top-[50%] block size-8 translate-y-[-50%] cursor-grab rounded-full bg-indigo-700 hover:size-10 active:size-10 active:cursor-grabbing"
        />
      </div>
    </div>
  );
}
