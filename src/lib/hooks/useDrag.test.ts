import { renderHook, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import {
  calculateNewIndex,
  handleDragging,
  useDrag,
  useDraggingState,
} from "@/lib/hooks/useDrag";

// Mock necessary global/window events
beforeAll(() => {
  window.addEventListener = jest.fn();
  window.removeEventListener = jest.fn();
});

afterAll(() => {
  jest.clearAllMocks();
});

// Utility to create a fake mouse event for testing
const createMouseEvent = (clientX: number) => {
  return new MouseEvent("mousemove", {
    clientX,
    bubbles: true,
    cancelable: true,
  });
};

describe("handleDragging", () => {
  const mockOnLeftDrag = jest.fn();
  const mockOnRightDrag = jest.fn();
  const mockCanMove = jest.fn();
  const mockExceedsLimit = jest.fn();

  it("should not call onLeftDrag or onRightDrag if canMove returns false", () => {
    mockCanMove.mockReturnValue(false);

    handleDragging(
      "left",
      50,
      20,
      80,
      mockOnLeftDrag,
      mockOnRightDrag,
      mockCanMove,
      mockExceedsLimit,
    );

    expect(mockOnLeftDrag).not.toHaveBeenCalled();
    expect(mockOnRightDrag).not.toHaveBeenCalled();
  });

  it("should call onLeftDrag when the left bullet is moved within range", () => {
    mockCanMove.mockReturnValue(true);
    mockExceedsLimit.mockReturnValue(false);

    handleDragging(
      "left",
      50,
      20,
      80,
      mockOnLeftDrag,
      mockOnRightDrag,
      mockCanMove,
      mockExceedsLimit,
    );

    expect(mockOnLeftDrag).toHaveBeenCalledWith(50);
    expect(mockOnRightDrag).not.toHaveBeenCalled();
  });

  it("should call onRightDrag when the right bullet is moved within range", () => {
    mockCanMove.mockReturnValue(true);
    mockExceedsLimit.mockReturnValue(false);

    handleDragging(
      "right",
      70,
      20,
      80,
      mockOnLeftDrag,
      mockOnRightDrag,
      mockCanMove,
      mockExceedsLimit,
    );

    expect(mockOnRightDrag).toHaveBeenCalledWith(70);
    expect(mockOnLeftDrag).not.toHaveBeenCalled();
  });

  it("should not update bullet position if exceedsLimit returns true", () => {
    mockCanMove.mockReturnValue(true);
    mockExceedsLimit.mockReturnValue(true);

    handleDragging(
      "left",
      50,
      20,
      80,
      mockOnLeftDrag,
      mockOnRightDrag,
      mockCanMove,
      mockExceedsLimit,
    );

    expect(mockOnLeftDrag).not.toHaveBeenCalled();
    expect(mockOnRightDrag).not.toHaveBeenCalled();
  });
});

describe("calculateNewIndex", () => {
  const mockBarRef = {
    current: {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 0,
        width: 100,
      }),
      addEventListener: jest.fn(), // Add mock for addEventListener
      removeEventListener: jest.fn(), // Add mock for removeEventListener
      clientWidth: 100, // Include relevant properties
    } as unknown as HTMLDivElement, // Cast to HTMLDivElement to satisfy type
  };

  it("should return null if barRef is invalid", () => {
    const result = calculateNewIndex(
      createMouseEvent(50),
      { current: null }, // Mock invalid ref
      100,
      false,
    );
    expect(result).toBeNull();
  });

  it("should calculate the correct index when in normal range", () => {
    const result = calculateNewIndex(
      createMouseEvent(50),
      mockBarRef,
      100,
      false,
    );
    expect(result).toBe(50); // midpoint of the bar
  });

  it("should calculate the correct index when in fixed range", () => {
    const result = calculateNewIndex(createMouseEvent(50), mockBarRef, 5, true);
    expect(result).toBe(2); // midpoint of a fixed range
  });
});

describe("useDraggingState", () => {
  it("should set and reset dragging state correctly", () => {
    const { result } = renderHook(() => useDraggingState());

    act(() => {
      result.current.handleMouseDown("left");
    });

    expect(result.current.isDragging).toBe(true);
    expect(result.current.activeBullet).toBe("left");

    act(() => {
      result.current.handleMouseUp();
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.activeBullet).toBeNull();
  });
});

describe("useDrag", () => {
  const mockBarRef = { current: document.createElement("div") };
  const mockOnLeftDrag = jest.fn();
  const mockOnRightDrag = jest.fn();
  const mockCanMove = jest.fn();
  const mockExceedsLimit = jest.fn();

  beforeEach(() => {
    mockCanMove.mockReturnValue(true);
    mockExceedsLimit.mockReturnValue(false);
  });

  it("should add and remove event listeners for mousemove and mouseup", () => {
    const { result } = renderHook(() =>
      useDrag(
        mockBarRef,
        0,
        100,
        100,
        mockOnLeftDrag,
        mockOnRightDrag,
        mockCanMove,
        mockExceedsLimit,
        false,
      ),
    );

    // Simulate mouse down on left bullet to start dragging
    act(() => {
      result.current.handleMouseDown("left");
    });

    // Verify the event listeners are added
    expect(window.addEventListener).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function),
    );

    // Simulate mouse up to stop dragging
    fireEvent.mouseUp(document);

    // Verify the event listeners are removed
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "mouseup",
      expect.any(Function),
    );
  });
});
