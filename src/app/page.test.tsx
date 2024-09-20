import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders a heading", () => {
    render(<HomePage />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Range of Thrones");
  });

  it("renders two exercise links", () => {
    render(<HomePage />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(2);

    const exercise1 = screen.getByText(/Exercise 1/i);
    expect(exercise1).toBeInTheDocument();
    expect(links[0]).toHaveAttribute("href", "/exercise1");

    const exercise2 = screen.getByText(/Exercise 2/i);
    expect(exercise2).toBeInTheDocument();
    expect(links[1]).toHaveAttribute("href", "/exercise2");
  });
});
