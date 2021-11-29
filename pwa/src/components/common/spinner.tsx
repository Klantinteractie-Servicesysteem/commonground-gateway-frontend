import * as React from "react";

/**
 * This components renders a bootstrap spinner.
 *
 * @returns TSX of the generated Spinner.
 */
export default function Spinner() {

  return (
    <div className="text-center px-5">
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
