import * as React from "react";
import { Card } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import "./collectionStoreCard.css";
import { useRepository } from "../../hooks/repository";

interface CollectionStoreCardProps {
  repository: any;
}

export const CollectionStoreCard: React.FC<CollectionStoreCardProps> = ({ repository }) => {
  const [__, setHeader] = React.useContext(HeaderContext);
  const queryClient = useQueryClient();
  const _useRepository = useRepository(queryClient);
  const installRepository = _useRepository.install(repository.id);


  React.useEffect(() => {
    setHeader("Repositories");
  }, [setHeader]);

  return (
    <Card
      key={repository.id}
      title={repository.name}
      cardHeader={function() {
        return (
          <div>
            <Link className="utrecht-link" to={`/collectionStore/${repository.id}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <FontAwesomeIcon icon={faInfo} />
              </button>
            </Link>
            <button
              onClick={() => installRepository.mutateAsync({ id: repository.id })}
              className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
              type="submit"
            >
              Install
            </button>
          </div>
        );
      }}
      cardBody={function() {
        return (
          <div>
            <div className="container">
              <img src={repository?.owner?.avatar_url} alt="url" />
              <div className="row">
                <div className="col-4">
                  <span className="card-text">{repository.owner?.type === "Organization" ? "Org: " : "User"}</span>
                  <span className="text-truncate">{repository.owner["login"]}</span>
                </div>
                <div className="col-4">
                  <span className="card-text">Repo: </span>
                  <span className="text-truncate">{repository.name}</span>
                </div>
              </div>
              <div className="row card-description">
                <div className="col-12">
                  <span>{repository.description}</span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};
