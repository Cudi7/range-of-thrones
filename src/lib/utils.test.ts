import { canMove, exceedsLimit, canWriteInput, clamp } from "@/lib/utils";

// Mock rangeValues for consistency in tests
jest.mock("@/lib/types", () => ({
  rangeValues: {
    MIN: 0,
    MAX: 100,
  },
}));

describe("Utility functions", () => {
  describe("canMove", () => {
    it("returns true when bulletPosition is within the range", () => {
      expect(canMove(50)).toBe(true); // within range
      expect(canMove(0)).toBe(true); // at MIN
      expect(canMove(100)).toBe(true); // at MAX
    });

    it("returns false when bulletPosition is out of range", () => {
      expect(canMove(-10)).toBe(false); // below MIN
      expect(canMove(120)).toBe(false); // above MAX
    });
  });

  describe("exceedsLimit", () => {
    it("returns true when left bullet exceeds the threshold", () => {
      expect(exceedsLimit(60, 50, "left")).toBe(true); // 60 >= 50
    });

    it("returns false when left bullet does not exceed the threshold", () => {
      expect(exceedsLimit(30, 50, "left")).toBe(false); // 30 < 50
    });

    it("returns true when right bullet is below or equal to the threshold", () => {
      expect(exceedsLimit(40, 50, "right")).toBe(true); // 40 <= 50
    });

    it("returns false when right bullet is above the threshold", () => {
      expect(exceedsLimit(60, 50, "right")).toBe(false); // 60 > 50
    });
  });

  describe("canWriteInput", () => {
    const leftBulletRef = { current: document.createElement("div") };
    const rightBulletRef = { current: document.createElement("div") };

    it("returns false when input value is within range and references are valid", () => {
      expect(canWriteInput(50, leftBulletRef, rightBulletRef)).toBe(false); // valid input
    });

    it("returns true when input value is out of range", () => {
      expect(canWriteInput(120, leftBulletRef, rightBulletRef)).toBe(true); // value > MAX
      expect(canWriteInput(-10, leftBulletRef, rightBulletRef)).toBe(true); // value < MIN
    });

    it("returns true when bullet references are invalid", () => {
      const invalidLeftRef = { current: null };
      const invalidRightRef = { current: null };
      expect(canWriteInput(50, invalidLeftRef, rightBulletRef)).toBe(true); // invalid left ref
      expect(canWriteInput(50, leftBulletRef, invalidRightRef)).toBe(true); // invalid right ref
    });

    it("returns true when value is falsy", () => {
      expect(canWriteInput(0, leftBulletRef, rightBulletRef)).toBe(true); // value is 0
      expect(canWriteInput(NaN, leftBulletRef, rightBulletRef)).toBe(true); // value is NaN
    });
  });

  describe("clamp", () => {
    it("returns the value when within the range", () => {
      expect(clamp(50, 0, 100)).toBe(50); // within range
    });

    it("returns the min value when value is below the range", () => {
      expect(clamp(-10, 0, 100)).toBe(0); // clamped to min
    });

    it("returns the max value when value is above the range", () => {
      expect(clamp(150, 0, 100)).toBe(100); // clamped to max
    });
  });
});
