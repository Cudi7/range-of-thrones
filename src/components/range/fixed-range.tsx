"use client";
import React, { useState, useRef } from "react";
import { type FixedRangeData } from "@/lib/types";
import { canMove, exceedsLimit } from "@/lib/utils";
import { useDrag } from "@/lib/hooks/useDrag";

interface RangeProps {
  data: FixedRangeData;
}

export function FixedRange({ data }: RangeProps) {
  const [leftPosition, setLeftPosition] = useState<number>(0);
  const [rightPosition, setRightPosition] = useState<number>(data.length - 1);

  const barRef = useRef<HTMLDivElement>(null);
  const leftBulletRef = useRef<HTMLDivElement>(null);
  const rightBulletRef = useRef<HTMLDivElement>(null);

  const { handleMouseDown } = useDrag(
    barRef,
    leftPosition,
    rightPosition,
    data.length,
    setLeftPosition,
    setRightPosition,
    canMove,
    exceedsLimit,
    true,
  );

  /**
   * Calculates the bullet position as a percentage of the total length of the data.
   * Adjusts the bullet position to either left or right based on its percentage position.
   *
   * @param position - The current bullet position (number)
   * @returns An object containing the CSS style for the bullet's position
   *
   * Example:
   * For a bullet at position 2 in a data set of length 5:
   * getBulletStyle(2) returns { left: "50%" }
   */
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
