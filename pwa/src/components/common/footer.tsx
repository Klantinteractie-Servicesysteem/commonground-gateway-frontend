import * as React from "react";
import { Link } from "gatsby";

export default function Footer() {
  return (
    <footer className="utrecht-page-footer">
      <div className="container">
        <a
          href={"https://conduction.nl"}
          target="_blank"
          className="utrecht-link utrecht-link--hover mr-5"
        >
          Conduction
        </a>
        <Link
          to={"/"}
          target="_blank"
          className="utrecht-link utrecht-link--hover mr-5"
        >
          Docs
        </Link>
        <Link
          to={"/"}
          target="_blank"
          className="utrecht-link utrecht-link--hover mr-5"
        >
          Licence
        </Link>
        <Link
          to={"/"}
          target="_blank"
          className="utrecht-link utrecht-link--hover mr-5"
        >
          Code
        </Link>
      </div>
    </footer>
  );
}
