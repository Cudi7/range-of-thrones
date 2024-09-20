"use client";
import { useState, useCallback, useEffect } from "react";
import { clamp } from "@/lib/utils";

/**
 * Handles the dragging logic for updating the left or right bullet's position.
 *
 * @param activeBullet - A string representing which bullet is being dragged ("left" or "right")
 * @param newIndex - The new calculated position for the bullet (number)
 * @param leftPosition - The current position of the left bullet (number)
 * @param rightPosition - The current position of the right bullet (number)
 * @param onLeftDrag - A callback to update the left bullet's position
 * @param onRightDrag - A callback to update the right bullet's position
 * @param canMove - A function to check if the new position is valid (boolean)
 * @param exceedsLimit - A function to check if the new position exceeds the limit (boolean)
 *
 * Example:
 * If `activeBullet = "left"` and `newIndex = 40`, the function will move the left bullet to
 * position 40 if it passes all validation checks.
 *
 * Usage:
 * handleDragging("left", 40, 20, 60, onLeftDrag, onRightDrag, canMove, exceedsLimit);
 */
export const handleDragging = (
  activeBullet: string | null,
  newIndex: number,
  leftPosition: number,
  rightPosition: number,
  onLeftDrag: (newPosition: number) => void,
  onRightDrag: (newPosition: number) => void,
  canMove: (newPosition: number) => boolean,
  exceedsLimit: (
    newPosition: number,
    otherPosition: number,
    side: string,
  ) => boolean,
) => {
  if (!canMove(newIndex)) return;

  if (
    activeBullet === "left" &&
    !exceedsLimit(newIndex, rightPosition, "left")
  ) {
    onLeftDrag(newIndex);
  } else if (
    activeBullet === "right" &&
    !exceedsLimit(newIndex, leftPosition, "right")
  ) {
    onRightDrag(newIndex);
  }
};

/**
 * Calculates the new position index based on the mouse position relative to the range bar.
 * This function converts the mouse's X position into a normalized value between 0 and 1,
 * then scales it according to the data length (or total range).
 *
 * @param e - The mouse event triggered by the user's drag
 * @param barRef - A reference to the range bar element (HTMLDivElement)
 * @param dataLength - The length of the data, typically the max range
 * @param isFixedRange - A boolean indicating whether the range is fixed (discrete values)
 * @returns {number | null} - The new index of the bullet based on the mouse position, or `null` if the reference is invalid
 *
 * Example:
 * If `dataLength = 100` and `isFixedRange = false`, dragging the bullet to the middle of the bar
 * would calculate a new index around 50.
 *
 * Usage:
 * calculateNewIndex(e, barRef, 100, false); // Returns a number between 0 and 100
 */
export const calculateNewIndex = (
  e: MouseEvent,
  barRef: React.RefObject<HTMLDivElement>,
  dataLength: number,
  isFixedRange: boolean,
): number | null => {
  // Get the dimensions and position of the bar element
  const barRect = barRef.current?.getBoundingClientRect();
  if (!barRect) return null;

  // Calculate the mouse position relative to the left edge of the bar
  const barOffset = barRect.left || 0;
  const barWidth = barRect.width || 0;
  const windowXPosition = e.clientX;

  // Calculate the relative position between 0 and 1 (normalized)
  const relativePosition = clamp(
    (windowXPosition - barOffset) / barWidth,
    0,
    1,
  );

  // If it's a fixed range (discrete values), scale the position based on the total number of steps
  if (isFixedRange) {
    return Math.round(relativePosition * (dataLength - 1));
  } else {
    // For a non-fixed range, scale normally based on the data length
    return Math.round(relativePosition * dataLength);
  }
};

/**
 * Hook to manage the dragging state, including which bullet is active
 * and whether dragging is currently occurring.
 *
 * @returns {object} - Returns `isDragging`, `activeBullet`, `handleMouseDown`, and `handleMouseUp`
 *
 * Example:
 * const { isDragging, activeBullet, handleMouseDown, handleMouseUp } = useDraggingState();
 */
export function useDraggingState(): {
  isDragging: boolean;
  activeBullet: string | null;
  handleMouseDown: (bullet: string) => void;
  handleMouseUp: () => void;
} {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeBullet, setActiveBullet] = useState<string | null>(null);

  /**
   *
   * @param bullet - Either "left" or "right", representing which bullet is active.
   */
  const handleMouseDown = (bullet: string) => {
    setIsDragging(true);
    setActiveBullet(bullet);
  };

  /**
   * Ends dragging and resets the state.
   * Removes the custom cursor styling.
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveBullet(null);
    document.body.style.removeProperty("cursor");
  };

  return { isDragging, activeBullet, handleMouseDown, handleMouseUp };
}

/**
 * Hook to handle mouse dragging behavior, updating the bullet's position
 * when dragging is in progress.
 *
 * @param barRef - A reference to the range bar (HTMLDivElement)
 * @param leftPosition - The current position of the left bullet (number)
 * @param rightPosition - The current position of the right bullet (number)
 * @param dataLength - The length of the data or range (number)
 * @param onLeftDrag - A callback to update the left bullet's position
 * @param onRightDrag - A callback to update the right bullet's position
 * @param canMove - A function to validate if the bullet can move to a new position
 * @param exceedsLimit - A function to validate if the bullet exceeds the limits
 * @param isFixedRange - Boolean to indicate if the range is fixed (discrete values)
 * @param isDragging - Boolean indicating if dragging is in progress
 * @param activeBullet - String representing which bullet is being dragged ("left" or "right")
 *
 * @returns The `handleMouseMove` function for mouse dragging.
 */
function useMouseDragHandler(
  barRef: React.RefObject<HTMLDivElement>,
  leftPosition: number,
  rightPosition: number,
  dataLength: number,
  onLeftDrag: (newPosition: number) => void,
  onRightDrag: (newPosition: number) => void,
  canMove: (newPosition: number) => boolean,
  exceedsLimit: (
    newPosition: number,
    otherPosition: number,
    side: string,
  ) => boolean,
  isFixedRange: boolean,
  isDragging: boolean,
  activeBullet: string | null,
) {
  /**
   * Handles mouse movement while dragging and updates the bullet position accordingly.
   *
   * @param e - The mouse event
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !activeBullet) return;

      document.body.style.cursor = "grabbing";
      const newIndex = calculateNewIndex(e, barRef, dataLength, isFixedRange);
      if (newIndex === null || newIndex < 0 || newIndex > dataLength) return;

      handleDragging(
        activeBullet,
        newIndex,
        leftPosition,
        rightPosition,
        onLeftDrag,
        onRightDrag,
        canMove,
        exceedsLimit,
      );
    },
    [
      isDragging,
      activeBullet,
      barRef,
      dataLength,
      leftPosition,
      rightPosition,
      onLeftDrag,
      onRightDrag,
      canMove,
      exceedsLimit,
      isFixedRange,
    ],
  );

  return handleMouseMove;
}

/**
 * Custom hook for handling the drag behavior of bullets in a range slider.
 * This hook combines both the dragging state management and mouse movement logic.
 *
 * @param barRef - A reference to the range bar (HTMLDivElement)
 * @param leftPosition - The current position of the left bullet (number)
 * @param rightPosition - The current position of the right bullet (number)
 * @param dataLength - The length of the data or range (number)
 * @param onLeftDrag - A callback to update the left bullet's position
 * @param onRightDrag - A callback to update the right bullet's position
 * @param canMove - A function to validate if the bullet can move to a new position
 * @param exceedsLimit - A function to validate if the bullet exceeds the limits
 * @param isFixedRange - Boolean to indicate if the range is fixed (discrete values)
 *
 * @returns {object} - Returns `handleMouseDown`, `isDragging`, and `activeBullet`
 *
 * Example:
 * const { handleMouseDown, isDragging } = useDrag(ref, 0, 100, 100, setLeftPos, setRightPos, canMove, exceedsLimit, false);
 */
export function useDrag(
  barRef: React.RefObject<HTMLDivElement>,
  leftPosition: number,
  rightPosition: number,
  dataLength: number,
  onLeftDrag: (newPosition: number) => void,
  onRightDrag: (newPosition: number) => void,
  canMove: (newPosition: number) => boolean,
  exceedsLimit: (
    newPosition: number,
    otherPosition: number,
    side: string,
  ) => boolean,
  isFixedRange = false,
): {
  handleMouseDown: (bullet: string) => void;
  isDragging: boolean;
  activeBullet: string | null;
} {
  // Manages the dragging state (isDragging and activeBullet)
  const { isDragging, activeBullet, handleMouseDown, handleMouseUp } =
    useDraggingState();

  // Handles the mouse movement while dragging
  const handleMouseMove = useMouseDragHandler(
    barRef,
    leftPosition,
    rightPosition,
    dataLength,
    onLeftDrag,
    onRightDrag,
    canMove,
    exceedsLimit,
    isFixedRange,
    isDragging,
    activeBullet,
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { handleMouseDown, isDragging, activeBullet };
}
