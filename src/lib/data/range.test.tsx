/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getNormalRangeData, getFixedRangeData } from "@/lib/data/range";
import { env } from "@/env";
import { NormalRangeSchema, FixedRangeSchema } from "@/lib/types";
import { render, act } from "@testing-library/react";
import Error from "@/app/error";
import { ZodError } from "zod";

// Mock env
jest.mock("@/env", () => ({
  env: {
    LAMBDA_FN_1_URL: "https://example.com/lambda1",
    LAMBDA_FN_2_URL: "https://example.com/lambda2",
  },
}));

// Mock  fetch
global.fetch = jest.fn();

// Mock  hooks
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn(),
}));

describe("getNormalRangeData and getFixedRangeData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNormalRangeData", () => {
    it("fetches and returns validated normal range data", async () => {
      const mockNormalRangeData = { min: 0, max: 100 };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockNormalRangeData),
      });
      const parseSpy = jest
        .spyOn(NormalRangeSchema, "parse")
        .mockReturnValue(mockNormalRangeData);

      const result = await getNormalRangeData();

      expect(fetch).toHaveBeenCalledWith(env.LAMBDA_FN_1_URL);
      expect(parseSpy).toHaveBeenCalledWith(mockNormalRangeData);
      expect(result).toEqual(mockNormalRangeData);
    });

    it("throws an error if fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(getNormalRangeData()).rejects.toThrow(
        "Failed to fetch data",
      );
    });

    it("throws an error if schema validation fails", async () => {
      const invalidData = { min: "invalid", max: 100 };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(invalidData),
      });
      jest.spyOn(NormalRangeSchema, "parse").mockImplementation(() => {
        throw new ZodError([
          {
            code: "invalid_type",
            path: ["min"],
            message: "Expected number, received string",
          },
        ]);
      });

      await expect(getNormalRangeData()).rejects.toThrow(ZodError);
    });
  });

  describe("getFixedRangeData", () => {
    it("fetches and returns validated fixed range data", async () => {
      const mockFixedRangeData = [10, 20, 30, 40];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockFixedRangeData),
      });
      const parseSpy = jest
        .spyOn(FixedRangeSchema, "parse")
        .mockReturnValue(mockFixedRangeData);

      const result = await getFixedRangeData();

      expect(fetch).toHaveBeenCalledWith(env.LAMBDA_FN_2_URL);
      expect(parseSpy).toHaveBeenCalledWith(mockFixedRangeData);
      expect(result).toEqual(mockFixedRangeData);
    });

    it("throws an error if fetch fails", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(getFixedRangeData()).rejects.toThrow("Failed to fetch data");
    });

    it("throws an error if schema validation fails", async () => {
      const invalidData = [10, "20", 30, 40];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(invalidData),
      });
      jest.spyOn(FixedRangeSchema, "parse").mockImplementation(() => {
        throw new ZodError([
          {
            code: "invalid_type",
            path: [1],
            message: "Expected number, received string",
          },
        ]);
      });

      await expect(getFixedRangeData()).rejects.toThrow(ZodError);
    });
  });

  describe("Error component rendering", () => {
    it("renders Error component for fetch failure", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(getNormalRangeData()).rejects.toThrow(
        "Failed to fetch data",
      );

      const error = new Error("Failed to fetch data");
      let renderResult: unknown;

      await act(async () => {
        renderResult = render(<Error error={error} reset={jest.fn()} />);
      });

      expect(
        renderResult.getByText("Something went wrong!"),
      ).toBeInTheDocument();
      expect(require("react").useEffect).toHaveBeenCalled();
    });

    it("renders Error component for schema validation failure", async () => {
      const invalidData = { min: "invalid", max: 100 };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(invalidData),
      });
      jest.spyOn(NormalRangeSchema, "parse").mockImplementation(() => {
        throw new ZodError([
          {
            code: "invalid_type",
            path: ["min"],
            message: "Expected number, received string",
          },
        ]);
      });

      await expect(getNormalRangeData()).rejects.toThrow(ZodError);

      const error = new ZodError([
        {
          code: "invalid_type",
          path: ["min"],
          message: "Expected number, received string",
        },
      ]);
      let renderResult: unknown;

      await act(async () => {
        renderResult = render(<Error error={error} reset={jest.fn()} />);
      });

      expect(
        renderResult.getByText("Something went wrong!"),
      ).toBeInTheDocument();
      expect(require("react").useEffect).toHaveBeenCalled();
    });
  });
});
