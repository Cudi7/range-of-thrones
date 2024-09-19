import "server-only";

import { env } from "@/env";
import { type RangeNormalData, type RangeFixedData } from "@/lib/types";

export async function getNormalRangeData(): Promise<RangeNormalData> {
  try {
    const response = await fetch(env.LAMBDA_FN_1_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch data, status: ${response.status}`);
    }

    const data = (await response.json()) as RangeNormalData;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data.");
  }
}

export async function getFixedRangeData(): Promise<RangeFixedData> {
  try {
    const response = await fetch(env.LAMBDA_FN_2_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch data, status: ${response.status}`);
    }

    const data = (await response.json()) as RangeFixedData;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data.");
  }
}
