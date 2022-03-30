import "./dashboardCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faLink } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { Link } from "gatsby";

interface DashboardCardProps {
  amount: number;
  title: string;
  iconBackgroundColor: string;
  icon: JSX.Element;
  subtitle: string | JSX.Element;
  linkTo: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  amount,
  title,
  iconBackgroundColor,
  icon,
  subtitle,
  linkTo,
}) => {
  return (
    <Link to={linkTo} className="dashboardCard">
      <div className="dashboardCard-icon" style={{ backgroundColor: `#${iconBackgroundColor}` }}>
        {icon}
      </div>
      <div className="dashboardCard-content">
        <div className="dashboardCard-content-title">
          <FontAwesomeIcon icon={faAngleRight} />
          <span className="dashboardCard-content-titleAmount">{amount}</span>
          <span>{title}</span>
        </div>
        <div className="dashboardCard-content-subtitle">{subtitle}</div>
      </div>
    </Link>
  );
};

interface DashboardCardSmallProps {
  title: string;
  subtitle: string;
  iconBackgroundColor: string;
  icon: JSX.Element;
  linkTo: string;
}

export const DashboardCardSmall: React.FC<DashboardCardSmallProps> = ({
  title,
  subtitle,
  iconBackgroundColor,
  icon,
  linkTo,
}) => {
  return (
    <a href={linkTo} target="_blank" className="dashboardCard dashboardCard--small">
      <div className="dashboardCard-icon" style={{ backgroundColor: `#${iconBackgroundColor}` }}>
        {icon}
      </div>

      <div className="dashboardCard-content">
        <div className="dashboardCard-content-title">
          <FontAwesomeIcon icon={faLink} />
          <span className="dashboardCard-content-title">{title}</span>
        </div>

        <div className="dashboardCard-content-subtitle">{subtitle}</div>
      </div>
    </a>
  );
};
