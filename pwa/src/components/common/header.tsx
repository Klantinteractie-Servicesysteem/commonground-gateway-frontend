import * as React from "react";
import { HeaderContext } from "../../context/headerContext";
import Breadcrumbs from "./breadcrumbs/breadcrumbs";

export default function Header({ pageContext }) {
  const {
    breadcrumb: { crumbs },
  } = pageContext;
  const [header] = React.useContext(HeaderContext);

  return header ? (
    <>
      <header className="utrecht-page-header">
        <div className="container">
          <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">{header.title}</h1>
          <Breadcrumbs {...{ crumbs }} />
        </div>
      </header>
    </>
  ) : (
    <></>
  );
}
