import './dashboardCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faLink } from "@fortawesome/free-solid-svg-icons";
import * as React from 'react';
import { Link } from 'gatsby';

interface DashboardCardProps {
  amount: number,
  title: string,
  linkType: "internal" | "external",
  iconBackgroundColor: string,
  icon: JSX.Element,
  subtitle: string | JSX.Element,
  linkTo: string,
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  amount,
  title,
  linkType,
  iconBackgroundColor,
  icon,
  subtitle,
  linkTo
}) => {
  return (
    <Link to={linkTo} className="dashboardCard">
      <div className="dashboardCard-icon" style={{ backgroundColor: `#${iconBackgroundColor}` }}>
        { icon }
      </div>

      <div className="dashboardCard-content">
        <div className="dashboardCard-content-title">
          <FontAwesomeIcon icon={linkType === "internal" ? faAngleRight : faLink} />
          <span className="dashboardCard-content-titleAmount">{amount}</span>
          <span className="dashboardCard-content-title">{title}</span>
        </div>

        <div className="dashboardCard-content-subtitle">
          {subtitle}
        </div>
      </div>
    </Link>
  )
}
