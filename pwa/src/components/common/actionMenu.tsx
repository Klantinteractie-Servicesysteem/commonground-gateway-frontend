import * as React from "react";
import { Link } from "gatsby";


export default function ActionMenu({pageDescription = null}) {

  return (
    <nav className="utrecht-sidenav">
      <ul className="utrecht-sidenav__list">
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/products">Sources</Link><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/cases">Entities</Link><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/data">Data objects</Link><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/logs">Logs</Link><span></span>
        </li>

      </ul>

      {
        pageDescription !== null &&
        <>
          <br /><br />
          <p className="utrecht-paragraph">
            {pageDescription}
          </p>

        </>
      }
    </nav>
  );
}
