import * as React from "react";
import './breadcrumbs.css'
import { Link } from "gatsby"

interface BreadcrumbsProps {
  crumbs: {
    pathname: string,
    crumbLabel: string,
  }[]
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const crumbsLength = crumbs.length - 1

  return (
    <ul className="breadcrumbs">
      {crumbs.map((crumb, idx) => {
        return (
          <li key={idx}>
            <Link to={crumb.pathname}>
              {crumb.crumbLabel.charAt(0).toUpperCase() + crumb.crumbLabel.slice(1)}
            </Link>
            {idx !== crumbsLength && <span className="divider">/</span>}
          </li>
        )
      })}
    </ul>
  )
}

export default Breadcrumbs
