import * as React from "react";
import "./breadcrumbs.css";
import { Link } from "gatsby";
import * as _ from "lodash";

interface BreadcrumbsProps {
  crumbs: {
    pathname: string;
    crumbLabel: string;
  }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  const [mappedCrumbs, setMappedCrumbs] = React.useState(null);
  const crumbsLength = crumbs.length - 1;

  React.useEffect(() => {
    const splitPathname = location.pathname.split("/");

    const _mappedCrumbs = crumbs.map((crumb, idx) => {
      const crumbLabel = crumb.crumbLabel;
      let pathname = "/";
      for (let i = 0; i <= idx; i++) {
        pathname += splitPathname[i] ? `${splitPathname[i]}/` : splitPathname[i];
      }
      return { ...{ pathname, crumbLabel } };
    });

    setMappedCrumbs(_mappedCrumbs);
  }, [crumbs]);

  return (
    <ul className="breadcrumbs">
      {mappedCrumbs?.map((crumb, idx) => {
        return (
          <li key={idx}>
            <Link to={crumb.pathname}>{_.upperFirst(crumb.crumbLabel)}</Link>
            {idx !== crumbsLength && <span className="divider">/</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
