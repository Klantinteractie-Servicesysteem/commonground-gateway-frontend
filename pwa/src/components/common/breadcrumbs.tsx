import * as React from "react";
import { Link } from "gatsby";


/**
 * This components renders bootstrap breadcrumbs.
 *
 * @param {object} items Each item is a breadcrumb.
 * @returns TSX of the generated breadcrumbs.
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
