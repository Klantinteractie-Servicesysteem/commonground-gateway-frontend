import * as React from "react";
import { Link } from "gatsby";


export default function ActionMenu({pageDescription = null}) {

  return (
    <nav className="utrecht-sidenav">
      <ul className="utrecht-sidenav__list">
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/">Home</Link>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/sources">Sources</Link>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/entities">Entities</Link>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/endpoints">Endpoints</Link>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/applications">Applications</Link>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/users">Users</Link>
        </li>
        <li className="utrecht-sidenav__item">
          <Link className="utrecht-sidenav__link" to="/configuration">Configuration</Link>
        </li>
        <li className="utrecht-sidenav__item">
<<<<<<< HEAD
          <a className="utrecht-sidenav__link" href="/">logs</a><span></span>
=======
          <Link className="utrecht-sidenav__link" to="/logs">logs</Link>
>>>>>>> development
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
