import * as React from "react";
import Breadcrumbs from "./breadcrumbs/breadcrumbs";

/**
 * This components renders a header.
 *
 * @returns TSX of the generated Header.
 */
export default function Header({title, pageContext}) {
  const { breadcrumb: { crumbs } } = pageContext

  return (
    <>
      <header className="utrecht-page-header">
        <div className="container">
          <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">
            {title}
          </h1>

          <Breadcrumbs {...{crumbs}} />
        </div>
      </header>
    </>
  );
}
