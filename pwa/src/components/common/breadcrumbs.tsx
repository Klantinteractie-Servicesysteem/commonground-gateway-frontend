import * as React from "react";
import { Link } from "gatsby";


/**
 * This Breadcrumbs  forms.
 *
 * @param {object|null} items Items object used for the map or null.
 */


export default function Breadcrumbs({ items = null }) {
    const liItems = items.map((item) =>
      <li className="utrecht-breadcrumb__item">
        <Link className="utrecht-breadcrumb__link utrecht-breadcrumb__link--focus utrecht-link"
          to={item.href}>
          <span className="utrecht-breadcrumb__text">{item.name}</span>
        </Link>
      </li>
    )

  return (
    <nav className="utrecht-breadcrumb">
      <ol className="utrecht-breadcrumb__list">
        {
          liItems
        }
      </ol>
    </nav>
  );
}
