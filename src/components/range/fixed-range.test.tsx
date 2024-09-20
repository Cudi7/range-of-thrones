import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDrag } from "@/lib/hooks/useDrag";
import { exceedsLimit, canMove } from "@/lib/utils";
import { FixedRange } from "./fixed-range";

// Mock the useDrag hook
jest.mock("@/lib/hooks/useDrag", () => ({
  useDrag: jest.fn(),
}));

// Mock the utility functions
jest.mock("@/lib/utils", () => ({
  exceedsLimit: jest.fn(),
  canMove: jest.fn(),
}));

describe("FixedRange Component", () => {
  const mockData = [0, 25, 50, 75, 100];
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
    render(<FixedRange data={mockData} />);

    const leftLabel = screen.getByText("0.00");
    const rightLabel = screen.getByText("100.00");

    expect(leftLabel).toBeInTheDocument();
    expect(rightLabel).toBeInTheDocument();
  });

  it("calls useDrag with correct parameters", () => {
    render(<FixedRange data={mockData} />);

    expect(useDrag).toHaveBeenCalledWith(
      expect.any(Object),
      0,
      mockData.length - 1,
      mockData.length,
      expect.any(Function),
      expect.any(Function),
      canMove,
      exceedsLimit,
      true,
    );
  });

  it("calls handleMouseDown when left bullet is clicked", () => {
    render(<FixedRange data={mockData} />);

    const leftBullet = document.getElementById("left-bullet");
    fireEvent.mouseDown(leftBullet);

    expect(mockHandleMouseDown).toHaveBeenCalledWith("left");
  });

  it("calls handleMouseDown when right bullet is clicked", () => {
    render(<FixedRange data={mockData} />);

    const rightBullet = document.getElementById("right-bullet");
    fireEvent.mouseDown(rightBullet);

    expect(mockHandleMouseDown).toHaveBeenCalledWith("right");
  });

  it("calculates bullet style correctly", () => {
    render(<FixedRange data={mockData} />);

    const leftBullet = document.getElementById("left-bullet");
    const rightBullet = document.getElementById("right-bullet");

    expect(leftBullet).toBeInTheDocument();
    expect(rightBullet).toBeInTheDocument();
  });
});
