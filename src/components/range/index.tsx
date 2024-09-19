"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  type RangeFixedData,
  type RangeNormalData,
  type rangeType,
  rangeValues,
} from "@/lib/types";
import { exceedsLimit } from "@/lib/utils";

export type RangeProps = {
  type: typeof rangeType.NORMAL | typeof rangeType.FIXED;
  data: RangeNormalData | RangeFixedData;
};

export function Range({ type, data }: RangeProps) {
  const [leftPosition, setLeftPosition] = useState<number>(0);
  const [rightPosition, setRightPosition] = useState<number>(100);
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
      const barOffset = barRect?.left;
      const barWidth = barRect?.width;
      const windowXPosition = e.clientX;

      if (!barOffset || !barWidth || !windowXPosition) return;

      let newPosition = ((windowXPosition - barOffset) / barWidth) * 100;

      newPosition = Number(Math.max(0, Math.min(100, newPosition)).toFixed(0));

      if (activeBullet === "left") {
        if (!exceedsLimit(newPosition, rightPosition, "left")) {
          setLeftPosition(newPosition);
          leftBulletRef.current!.style.left = `${newPosition}%`;
        }
      }

      if (activeBullet === "right") {
        if (!exceedsLimit(newPosition, leftPosition, "right")) {
          setRightPosition(newPosition);
          rightBulletRef.current!.style.left = `${newPosition}%`;
        }
      }
    },
    [isDragging, activeBullet, leftPosition, rightPosition],
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: string,
  ) => {
    const inputValue = +e?.target?.value;
    console.log(leftPosition, rightPosition);

    if (inputValue < rangeValues.MIN || inputValue > rangeValues.MAX) return;

    if (side === "left" && inputValue < rightPosition) {
      setLeftPosition(inputValue);
      leftBulletRef.current!.style.left = `${inputValue}%`;
    } else if (side === "right" && inputValue > leftPosition) {
      setRightPosition(inputValue);
      rightBulletRef.current!.style.left = `${inputValue}%`;
    }
  };

  return (
    <div className="relative h-2 rounded-xl">
      <div
        className="absolute inset-0 h-8 max-w-2xl bg-white/70"
        ref={barRef}
        onMouseDown={(e) => e.preventDefault()}
      >
        <input
          value={Math.round(leftPosition)}
          className="text-md absolute -left-[90px] top-[50%] max-w-[60px] translate-y-[-50%] cursor-pointer rounded-md p-1 font-semibold text-black"
          min={rangeValues.MIN}
          max={rangeValues.MAX}
          type="number"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => handleInputChange(e, "left")}
        />
        <input
          value={Math.round(rightPosition)}
          className="text-md absolute -right-[90px] top-[50%] max-w-[60px] translate-y-[-50%] cursor-pointer rounded-md p-1 font-semibold text-black"
          min={rangeValues.MIN}
          max={rangeValues.MAX}
          type="number"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => handleInputChange(e, "right")}
        />

        <div
          ref={leftBulletRef}
          onMouseDown={() => handleMouseDown("left")}
          className="absolute left-0 top-[50%] block size-8 -translate-x-1/2 translate-y-[-50%] cursor-grab bg-indigo-400 hover:size-10 active:z-10 active:size-10 active:cursor-grabbing"
          style={{ left: `${leftPosition}%` }}
        />
        <div
          ref={rightBulletRef}
          onMouseDown={() => handleMouseDown("right")}
          className="absolute right-0 top-[50%] block size-8 -translate-x-1/2 translate-y-[-50%] cursor-grab bg-indigo-700 hover:size-10 active:size-10 active:cursor-grabbing"
          style={{ left: `${rightPosition}%` }}
        />
      </div>
    </div>
  );
}
