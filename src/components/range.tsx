"use client";

import { type DragEvent, useRef, useState } from "react";

const rangeType = {
  NORMAL: "normal",
  FIXED: "fixed",
} as const;

interface RangeProps {
  type: typeof rangeType.NORMAL | typeof rangeType.FIXED;
}

export function Range({ type }: RangeProps) {
  const leftBulletRef = useRef<HTMLDivElement>(null);
  const rightBulletRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [leftMinPosition, setLeftMinPosition] = useState<number>(0);
  const [rightMinPosition, setRightMinPosition] = useState<number>(100);

  //   if (type === rangeType.NORMAL) console.log(rangeType.NORMAL);
  //   else if (type === rangeType.FIXED) console.log(rangeType.FIXED);

  const handleLeftDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const barOffset = barRef.current?.getBoundingClientRect().left;
    const barWidth = barRef.current?.getBoundingClientRect().width;
    const windowXPosition = e.pageX;

    if (!barOffset || !barWidth || !windowXPosition) return;

    const leftBulletPosition = (
      ((windowXPosition - barOffset) / barWidth) *
      100
    ).toFixed(0);
    if (Number(leftBulletPosition) < 0 || Number(leftBulletPosition) > 100)
      return;

    setLeftMinPosition(Number(leftBulletPosition));

    leftBulletRef.current.style.left = `${leftBulletPosition}%`;
  };

  const handleRightDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const barOffset = barRef.current?.getBoundingClientRect().left;
    const barWidth = barRef.current?.getBoundingClientRect().width;
    const windowXPosition = e.pageX;

    if (!barOffset || !barWidth || !windowXPosition) return;

    const rightBulletPosition = (
      ((windowXPosition - barOffset) / barWidth) *
      100
    ).toFixed(0);
    if (Number(rightBulletPosition) < 0 || Number(rightBulletPosition) > 100)
      return;

    setRightMinPosition(Number(rightBulletPosition));

    rightBulletRef.current.style.left = `${rightBulletPosition}%`;
  };

  const handleInputChange = () => {
    console.log("input change");
  };

  return (
    <div className="relative h-2 rounded-xl border border-slate-200">
      <div
        className="absolute inset-0 h-2 max-w-2xl rounded-xl bg-white"
        ref={barRef}
      >
        <span
          onClick={handleInputChange}
          className="text-md absolute -left-10 top-[50%] translate-y-[-50%] cursor-pointer font-semibold text-white"
        >
          {leftMinPosition}
        </span>
        <span
          onClick={handleInputChange}
          className="text-md absolute -right-10 top-[50%] translate-y-[-50%] cursor-pointer font-semibold text-white"
        >
          {rightMinPosition}
        </span>
        <div
          ref={leftBulletRef}
          onDrag={handleLeftDrag}
          draggable
          className={`absolute left-[0] top-[50%] block size-4 translate-y-[-50%] rounded-full bg-red-500`}
        />
        <div
          ref={rightBulletRef}
          onDrag={handleRightDrag}
          draggable
          className="absolute right-0 top-[50%] block size-4 translate-y-[-50%] rounded-full bg-red-500"
        ></div>
      </div>
    </div>
  );
}
