"use client";

import React, { useState, useRef } from "react";
import { type NormalRangeData } from "@/lib/types";
import { exceedsLimit, canMove } from "@/lib/utils";
import { useDrag } from "@/lib/hooks/useDrag";

interface NormalRangeProps {
  data: NormalRangeData;
}

export function NormalRange({ data }: NormalRangeProps) {
  const [leftPosition, setLeftPosition] = useState<number>(data.min);
  const [rightPosition, setRightPosition] = useState<number>(data.max);

  const barRef = useRef<HTMLDivElement>(null);
  const leftBulletRef = useRef<HTMLDivElement>(null);
  const rightBulletRef = useRef<HTMLDivElement>(null);

  const { handleMouseDown } = useDrag(
    barRef,
    leftPosition,
    rightPosition,
    data.max,
    setLeftPosition,
    setRightPosition,
    canMove,
    exceedsLimit,
    false,
  );

  /**
   * Handles the input change when the user manually enters a value.
   *
   * @param e - The input change event
   * @param side - Indicates whether it's the "left" or "right" input (string)
   *
   * Example:
   * When the user changes the left input to 20:
   * handleInputChange(event, "left");
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: string,
  ) => {
    const inputValue = +e?.target?.value;

    if (inputValue < data.min || inputValue > data.max) return;

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
        className="absolute inset-0 h-8 max-w-2xl rounded-md bg-white/70"
        ref={barRef}
        onMouseDown={(e) => e.preventDefault()}
        role="slider"
        aria-valuenow={leftPosition}
      >
        <input
          value={Math.round(leftPosition)}
          className="text-md absolute -left-[90px] top-[50%] max-w-[60px] translate-y-[-50%] cursor-pointer rounded-md p-1 font-semibold text-black"
          min={data.min}
          max={data.max}
          type="number"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => handleInputChange(e, "left")}
        />
        <input
          value={Math.round(rightPosition)}
          className="text-md absolute -right-[90px] top-[50%] max-w-[60px] translate-y-[-50%] cursor-pointer rounded-md p-1 font-semibold text-black"
          min={data.min}
          max={data.max}
          type="number"
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => handleInputChange(e, "right")}
        />

        <div
          ref={leftBulletRef}
          onMouseDown={() => handleMouseDown("left")}
          className="absolute left-0 top-[50%] block size-8 -translate-x-1/2 translate-y-[-50%] cursor-grab rounded-md bg-indigo-400 hover:size-10 active:z-10 active:size-10 active:cursor-grabbing"
          style={{ left: `${leftPosition}%` }}
          id="left-bullet"
        />
        <div
          ref={rightBulletRef}
          onMouseDown={() => handleMouseDown("right")}
          className="absolute right-0 top-[50%] block size-8 -translate-x-1/2 translate-y-[-50%] cursor-grab rounded-md bg-indigo-700 hover:size-10 active:size-10 active:cursor-grabbing"
          style={{ left: `${rightPosition}%` }}
          id="right-bullet"
        />
      </div>
    </div>
  );
}
