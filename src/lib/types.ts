import { z } from "zod";

export const rangeValues = {
  MIN: 0,
  MAX: 100,
} as const;

export const NormalRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const FixedRangeSchema = z.array(z.number());

export type NormalRangeData = z.infer<typeof NormalRangeSchema>;
export type FixedRangeData = z.infer<typeof FixedRangeSchema>;
