import "server-only";

import { env } from "@/env";
import {
  type NormalRangeData,
  type FixedRangeData,
  NormalRangeSchema,
  FixedRangeSchema,
} from "@/lib/types";

export async function getNormalRangeData(): Promise<NormalRangeData> {
  const res = await fetch(env.LAMBDA_FN_1_URL);

  if (!res.ok) throw new Error(`Failed to fetch data`);

  const data = (await res.json()) as NormalRangeData;

  const validatedData = NormalRangeSchema.parse(data);

  return validatedData;
}

export async function getFixedRangeData(): Promise<FixedRangeData> {
  const res = await fetch(env.LAMBDA_FN_2_URL);

  if (!res.ok) throw new Error(`Failed to fetch data`);

  const data = (await res.json()) as FixedRangeData;

  const validatedData = FixedRangeSchema.parse(data);
  return validatedData;
}
