import * as React from "react";
import "./breadcrumbs.css";
import { Link } from "gatsby";

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
        switch(i)
        {
          case 0:
            break;
          case 1:
            pathname = splitPathname[0] + "/" + splitPathname[1];
            break;
          case 2:
            pathname = splitPathname[0] + "/" + splitPathname[1] + "/" + splitPathname[2];
            break;
          case 3:
            pathname = splitPathname[0] + "/" + splitPathname[1] + "/" + splitPathname[2];
            break;
          case 4:
            pathname = splitPathname[0] + "/" + splitPathname[1] + "/" + splitPathname[2] + "/" + splitPathname[3] + "/" + splitPathname[4];
            break;
        }
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
            <Link to={crumb.pathname}>{crumb.crumbLabel.charAt(0).toUpperCase() + crumb.crumbLabel.slice(1)}</Link>
            {idx !== crumbsLength && <span className="divider">/</span>}
          </li>
        );
      })}
    </ul>
  );
};

export default Breadcrumbs;
