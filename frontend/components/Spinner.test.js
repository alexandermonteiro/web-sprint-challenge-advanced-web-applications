// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react";
import Spinner from "./Spinner";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

describe("Spinner is working properly", () => {
  test("Spinner shows when the prop passed is true", () => {
    render(<Spinner on={true} />);
    screen.getByText(/please wait/i);
  });

  test("Spinner is not show up when the passed prop is false", () => {
    render(<Spinner on={false} />);
    const spinnerMessage = screen.queryByText(/please wait/i);
    expect(spinnerMessage).not.toBeInTheDocument();
    expect(spinnerMessage).toBeFalsy();
    expect(spinnerMessage).toBeNull();
  });
});

// test("sanity", () => {
//   expect(true).toBe(false);
// });
