export const rangeType = {
  NORMAL: "normal",
  FIXED: "fixed",
} as const;

export const rangeValues = {
  MIN: 0,
  MAX: 100,
} as const;

export type RangeNormalData = {
  min: typeof rangeValues.MIN;
  max: typeof rangeValues.MAX;
};

export type RangeFixedData = number[];
