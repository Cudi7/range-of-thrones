import { rangeValues } from "@/lib/types";

export const canMove = (bulletPosition: number): boolean => {
  return bulletPosition >= rangeValues.MIN && bulletPosition <= rangeValues.MAX;
};

export const exceedsLimit = (
  value: number,
  threshold: number,
  side: string,
): boolean => {
  return side === "left" ? value >= threshold : value <= threshold;
};

export const canWriteInput = (
  val: number,
  leftBulletRef: React.RefObject<HTMLDivElement>,
  rightBulletRef: React.RefObject<HTMLDivElement>,
): boolean => {
  return (
    val < rangeValues.MIN ||
    val > rangeValues.MAX ||
    !val ||
    !leftBulletRef.current ||
    !rightBulletRef.current
  );
};
