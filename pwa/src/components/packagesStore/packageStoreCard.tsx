import * as React from "react";
import { Card } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import "./packagesStoreCard.css";

interface CollectionStoreCardProps {
  id: number;
  packagist: any;
}

export const PackageStoreCard: React.FC<CollectionStoreCardProps> = ({ id, packagist }) => {
  const [__, setHeader] = React.useContext(HeaderContext);
  const url = packagist.name.replace('/', '--')

  React.useEffect(() => {
    setHeader("Repositories");
  }, [setHeader]);

  return (
    <Card
      key={id}
      title={packagist.name}
      cardHeader={function() {
        return (
          <div>
            <Link className="utrecht-link" to={`/packagesStore/${url}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <FontAwesomeIcon icon={faInfo} />
              </button>
            </Link>
            <a href={packagist.url}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-primary mr-2">
                Packagist
              </button>
            </a>
          </div>
        );
      }}
      cardBody={function() {
        return (
          <div>
            <div className="container">
              <div className="row">
                <div className="col-4">
                  <span className="card-text">Downloads: </span>
                  <span className="text-truncate">{packagist.downloads}</span>
                </div>
                <div className="col-4">
                  <span className="card-text">Favers: </span>
                  <span className="text-truncate">{packagist.favers}</span>
                </div>
              </div>
              <div className="row card-description">
                <div className="col-12">
                  <span>{packagist.description}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};
