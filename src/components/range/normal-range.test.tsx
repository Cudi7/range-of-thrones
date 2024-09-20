import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDrag } from "@/lib/hooks/useDrag";
import { exceedsLimit, canMove } from "@/lib/utils";
import { NormalRange } from "./normal-range";

// Mock the useDrag hook
jest.mock("@/lib/hooks/useDrag", () => ({
  useDrag: jest.fn(),
}));

// Mock the utility functions
jest.mock("@/lib/utils", () => ({
  exceedsLimit: jest.fn(),
  canMove: jest.fn(),
}));

describe("NormalRange Component", () => {
  const mockData = { min: 0, max: 100 };
  const mockHandleMouseDown = jest.fn();

  beforeEach(() => {
    (useDrag as jest.Mock).mockReturnValue({
      handleMouseDown: mockHandleMouseDown,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with initial data", () => {
    render(<NormalRange data={mockData} />);

    const leftInput = screen.getByDisplayValue("0");
    const rightInput = screen.getByDisplayValue("100");

    expect(leftInput).toBeInTheDocument();
    expect(rightInput).toBeInTheDocument();
  });

  it("calls useDrag with correct parameters", () => {
    render(<NormalRange data={mockData} />);

    expect(useDrag).toHaveBeenCalledWith(
      expect.any(Object),
      0,
      100,
      100,
      expect.any(Function),
      expect.any(Function),
      canMove,
      exceedsLimit,
      false,
    );
  });

  it("updates left position when left input changes", () => {
    render(<NormalRange data={mockData} />);

    const leftInput = screen.getByDisplayValue("0");
    fireEvent.change(leftInput, { target: { value: "20" } });

    expect(screen.getByDisplayValue("20")).toBeInTheDocument();
  });

  it("updates right position when right input changes", () => {
    render(<NormalRange data={mockData} />);

    const rightInput = screen.getByDisplayValue("100");
    fireEvent.change(rightInput, { target: { value: "80" } });

    expect(screen.getByDisplayValue("80")).toBeInTheDocument();
  });

  it("does not update left position if new value is greater than right position", () => {
    render(<NormalRange data={mockData} />);

    const leftInput = screen.getByDisplayValue("0");
    fireEvent.change(leftInput, { target: { value: "110" } });

    expect(screen.getByDisplayValue("0")).toBeInTheDocument();
  });

  it("does not update right position if new value is less than left position", () => {
    render(<NormalRange data={mockData} />);

    const rightInput = screen.getByDisplayValue("100");
    fireEvent.change(rightInput, { target: { value: "-10" } });

    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it("calls handleMouseDown when left bullet is clicked", () => {
    render(<NormalRange data={mockData} />);

    const leftBullet = document.getElementById("left-bullet");

    if (leftBullet) {
      fireEvent.mouseDown(leftBullet);
      expect(mockHandleMouseDown).toHaveBeenCalledWith("left");
    } else {
      throw new Error("Left bullet not found");
    }
  });

  it("calls handleMouseDown when right bullet is clicked", () => {
    render(<NormalRange data={mockData} />);

    const rightBullet = document.getElementById("right-bullet");

    if (rightBullet) {
      fireEvent.mouseDown(rightBullet);
      expect(mockHandleMouseDown).toHaveBeenCalledWith("right");
    } else {
      throw new Error("Right bullet not found");
    }
  });

  it("should not update left position if input value is less than min", () => {
    render(<NormalRange data={mockData} />);

    const leftInput = screen.getByDisplayValue("0");
    fireEvent.change(leftInput, { target: { value: "-10" } });

    expect(screen.getByDisplayValue("0")).toBeInTheDocument(); // Left position should remain unchanged
  });
  it("should not update right position if input value is greater than max", () => {
    render(<NormalRange data={mockData} />);

    const rightInput = screen.getByDisplayValue("100");
    fireEvent.change(rightInput, { target: { value: "120" } });

    expect(screen.getByDisplayValue("100")).toBeInTheDocument(); // Right position should remain unchanged
  });
  it("should update the bullet positions when input values change", () => {
    render(<NormalRange data={mockData} />);

    const leftInput = screen.getByDisplayValue("0");
    fireEvent.change(leftInput, { target: { value: "25" } });

    const leftBullet = document.getElementById("left-bullet");
    if (leftBullet) {
      expect(leftBullet.style.left).toBe("25%"); // Check that the left bullet has moved
    } else {
      throw new Error("Left bullet not found");
    }

    const rightInput = screen.getByDisplayValue("100");
    fireEvent.change(rightInput, { target: { value: "75" } });

    const rightBullet = document.getElementById("right-bullet");
    if (rightBullet) {
      expect(rightBullet.style.left).toBe("75%"); // Check that the right bullet has moved
    } else {
      throw new Error("Right bullet not found");
    }
  });
  it("should stop propagation when input is clicked", () => {
    render(<NormalRange data={mockData} />);

    const leftInput = screen.getByDisplayValue("0");
    const rightInput = screen.getByDisplayValue("100");

    // We simulate the event object and mock stopPropagation within it
    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });

    // Spy on stopPropagation
    const stopPropagationSpy = jest.spyOn(mouseDownEvent, "stopPropagation");

    // Trigger the event on the element
    fireEvent(leftInput, mouseDownEvent);
    fireEvent(rightInput, mouseDownEvent);

    // Expect stopPropagation to have been called
    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
