import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSelectedLayoutSegment } from "next/navigation";
import { AppNavLinks } from "./app-nav-links";

jest.mock("next/navigation", () => ({
  useSelectedLayoutSegment: jest.fn(),
}));

describe("AppNavLinks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing if the segment is null", () => {
    (useSelectedLayoutSegment as jest.Mock).mockReturnValue(null);

    render(<AppNavLinks />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders links and highlights Exercise 1 when segment is 'exercise1'", () => {
    (useSelectedLayoutSegment as jest.Mock).mockReturnValue("exercise1");

    render(<AppNavLinks />);

    const exercise1Link = screen.getByText("Exercise 1");
    const exercise2Link = screen.getByText("Exercise 2");

    expect(exercise1Link).toBeInTheDocument();
    expect(exercise2Link).toBeInTheDocument();

    expect(exercise1Link).toHaveClass("text-indigo-400");
    expect(exercise2Link).not.toHaveClass("text-indigo-400");
  });

  it("renders links and highlights Exercise 2 when segment is 'exercise2'", () => {
    (useSelectedLayoutSegment as jest.Mock).mockReturnValue("exercise2");

    render(<AppNavLinks />);

    const exercise1Link = screen.getByText("Exercise 1");
    const exercise2Link = screen.getByText("Exercise 2");

    expect(exercise1Link).toBeInTheDocument();
    expect(exercise2Link).toBeInTheDocument();

    expect(exercise2Link).toHaveClass("text-indigo-400");
    expect(exercise1Link).not.toHaveClass("text-indigo-400");
  });
});
