"use client";

import { type RangeProps } from "@/lib/types";
import { canMove, exceedsLimit } from "@/lib/utils";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";

export function RangeOld({ type }: RangeProps) {
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

    const leftBulletPosition = +(
      ((windowXPosition - barOffset) / barWidth) *
      100
    ).toFixed(0);

    if (
      !canMove(leftBulletPosition) ||
      exceedsLimit(leftBulletPosition, rightMinPosition, "left")
    )
      return;

    setLeftMinPosition(leftBulletPosition);

    leftBulletRef.current.style.left = `${leftBulletPosition}%`;
  };

  const handleRightDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const barOffset = barRef.current?.getBoundingClientRect().left;
    const barWidth = barRef.current?.getBoundingClientRect().width;
    const windowXPosition = e.pageX;

    if (!barOffset || !barWidth || !windowXPosition) return;

    const rightBulletPosition = +(
      ((windowXPosition - barOffset) / barWidth) *
      100
    ).toFixed(0);

    if (
      !canMove(rightBulletPosition) ||
      exceedsLimit(rightBulletPosition, leftMinPosition, "right")
    )
      return;

    setRightMinPosition(rightBulletPosition);

    rightBulletRef.current.style.left = `${rightBulletPosition}%`;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    side: string,
  ) => {
    const inputValue = +e.target.value;

    if (inputValue < 0 || inputValue > 100) return;

    if (side === "left" && inputValue < rightMinPosition) {
      setLeftMinPosition(inputValue);

      leftBulletRef.current.style.left = `${inputValue}%`;
    } else if (side === "right" && inputValue > leftMinPosition) {
      setRightMinPosition(inputValue);

      rightBulletRef.current.style.left = `${inputValue}%`;
    }
  };

  return (
    <div className="relative h-2 rounded-xl">
      <div
        className="absolute inset-0 h-2 max-w-2xl rounded-xl bg-white/70"
        ref={barRef}
      >
        <input
          value={leftMinPosition}
          className="text-md absolute -left-[70px] top-[50%] max-w-[60px] translate-y-[-50%] cursor-pointer rounded-lg p-1 font-semibold text-black"
          onChange={(e) => handleInputChange(e, "left")}
          min="0"
          max="100"
          type="number"
        />

        <input
          value={rightMinPosition}
          className="text-md absolute -right-[70px] top-[50%] max-w-[60px] translate-y-[-50%] cursor-pointer rounded-lg p-1 font-semibold text-black"
          onChange={(e) => handleInputChange(e, "right")}
          min="0"
          max="100"
          type="number"
        />

        <div
          ref={leftBulletRef}
          onDrag={handleLeftDrag}
          draggable
          className={`absolute left-[0] top-[50%] block size-4 translate-y-[-50%] rounded-full bg-indigo-400 hover:size-6 hover:cursor-grab`}
        />
        <div
          ref={rightBulletRef}
          onDrag={handleRightDrag}
          draggable
          className="absolute right-0 top-[50%] block size-4 translate-y-[-50%] rounded-full bg-indigo-700"
        />
      </div>
    </div>
  );
}
