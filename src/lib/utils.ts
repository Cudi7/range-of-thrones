import { rangeValues } from "@/lib/types";

/**
 * Checks if the bullet position is within the defined range limits.
 *
 * @param bulletPosition - The current position of the bullet (number)
 * @returns `true` if the bullet position is within the range, `false` otherwise
 *
 * Example:
 * rangeValues.MIN = 0, rangeValues.MAX = 100
 * canMove(50); // returns true (within the range)
 * canMove(120); // returns false (out of the range)
 */
export const canMove = (bulletPosition: number): boolean => {
  return bulletPosition >= rangeValues.MIN && bulletPosition <= rangeValues.MAX;
};

/**
 * Determines whether the value exceeds the threshold for a bullet (left or right).
 *
 * @param value - The current value of the bullet (number)
 * @param threshold - The threshold to compare against (number)
 * @param side - Indicates whether it's the "left" or "right" bullet
 * @returns `true` if the value exceeds the threshold, `false` otherwise
 *
 * Example:
 * exceedsLimit(30, 50, "left");  // returns false (30 < 50)
 * exceedsLimit(60, 50, "left");  // returns true (60 >= 50)
 * exceedsLimit(40, 50, "right"); // returns true (40 <= 50)
 */
export const exceedsLimit = (
  value: number,
  threshold: number,
  side: string,
): boolean => {
  return side === "left" ? value >= threshold : value <= threshold;
};

/**
 * Validates if the input value is allowed to be written based on the minimum and maximum range values and bullet references.
 *
 * @param val - The current input value (number)
 * @param leftBulletRef - A reference to the left bullet (HTMLDivElement)
 * @param rightBulletRef - A reference to the right bullet (HTMLDivElement)
 * @returns `true` if the input is invalid or bullets are not properly referenced, `false` if everything is valid
 *
 * Example:
 * rangeValues.MIN = 0, rangeValues.MAX = 100
 * canWriteInput(110, leftBulletRef, rightBulletRef); // returns true (value is out of range)
 * canWriteInput(50, leftBulletRef, rightBulletRef);  // returns false (valid input)
 */
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

/**
 * Clamps a value between the specified minimum and maximum values.
 *
 * @param value - The value to clamp (number)
 * @param min - The minimum allowed value (number)
 * @param max - The maximum allowed value (number)
 * @returns The clamped value (number)
 *
 * Example:
 * clamp(150, 0, 100);  // returns 100 (clamped to max)
 * clamp(-10, 0, 100);  // returns 0 (clamped to min)
 * clamp(50, 0, 100);   // returns 50 (within range)
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};
