import * as React from "react";
import { Link } from "gatsby";

/**
 * This components renders a footer.
 *
 * @returns TSX of the generated Footer.
 */
export default function Footer() {
  return (
    <footer className="utrecht-page-footer">
      <div className="container">
        <a
          href={"https://conduction.nl"}
          target="_blank"
          className="utrecht-link utrecht-link--hover mr-5"
          rel="noreferrer"
        >
          Conduction
        </a>
        <Link to={"/"} target="_blank" className="utrecht-link utrecht-link--hover mr-5">
          Docs
        </Link>
        <Link to={"/"} target="_blank" className="utrecht-link utrecht-link--hover mr-5">
          Licence
        </Link>
        <Link to={"/"} target="_blank" className="utrecht-link utrecht-link--hover mr-5">
          Code
        </Link>
      </div>
    </footer>
  );
}
