import * as React from "react";
import { Link } from "gatsby";


export default function ActionMenu() {

  return (
    <nav className="utrecht-sidenav">
      <ul className="utrecht-sidenav__list">
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Home</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Sources</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Entities</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Endpoints</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Applications</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Users</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">Configuration</a><span></span>
        </li>
        <li className="utrecht-sidenav__item">
          <a className="utrecht-sidenav__link" href="/">loguit</a><span></span>
        </li>
      </ul>
    </nav>
  );
}
