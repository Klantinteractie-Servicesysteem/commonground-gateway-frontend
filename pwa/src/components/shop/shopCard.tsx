import * as React from "react";
import { Card } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";

interface ShopCardProps {
  repository: any;
}

export const ShopCard: React.FC<ShopCardProps> = ({ repository }) => {
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader("Repositories");
  }, [setHeader]);

  return (
    <Card
      title={repository.name}
      cardHeader={function() {
        return (
          <div>
            <Link className="utrecht-link" to={`/shop/${repository.id}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <FontAwesomeIcon icon={faInfo} />
              </button>
            </Link>
            <button
              className="utrecht-button utrecht-button-sm btn-sm btn-success"
              type="submit"
            >
              Install
            </button>
          </div>
        );
      }}
      cardBody={function() {
        return (
          <span>{repository.description}</span>
        );
      }}
    />
  );
};
