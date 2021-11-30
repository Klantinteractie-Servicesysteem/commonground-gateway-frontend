import * as React from "react";
import { Link } from "gatsby";

interface BreadcrumbsProps {
  items: Array<Partial<Record<"name"|"href", any>>>;
}

/**
 * This components renders bootstrap breadcrumbs.
 *
 * @returns TSX of the generated breadcrumbs.
 */
export default function Breadcrumbs(props: BreadcrumbsProps) {
    const liItems = props.items.map((item) =>
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
