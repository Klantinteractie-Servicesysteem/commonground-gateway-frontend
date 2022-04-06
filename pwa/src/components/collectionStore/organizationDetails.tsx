import * as React from "react";
import { Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { useQueryClient } from "react-query";
import { useRepository } from "../../hooks/repository";

interface OrganizationDetailProps {
  repositoryId: string;
}

export const OrganizationDetails: React.FC<OrganizationDetailProps> = ({ repositoryId }) => {
  const [__, setHeader] = React.useContext(HeaderContext);

  const queryClient = useQueryClient();

  const _useRepository = useRepository(queryClient);
  const getRepository = _useRepository.getOne(repositoryId);
  const installRepository = _useRepository.install(repositoryId);

  const ownerDetail = [];
  if (getRepository?.data?.owner) {
    for (const [key, value] of Object.entries(getRepository.data.owner)) {
      ownerDetail.push({ ...{ key, value } });
    }
  }

  /**
   * Effects
   */
  React.useEffect(() => {
    setHeader("Repository");

    if (getRepository.isSuccess) {
      setHeader(
        <>
          Repository: <i>{getRepository.data.name}</i>
        </>
      );
    }
  }, [getRepository.isSuccess]);

  return (
    getRepository.isLoading ? (
      <Spinner />
    ) : (
      <div className="row">
        <div className="col-8">
          <Card
            title={getRepository.data.name}
            cardHeader={function() {
              return (
                <div>
                  <button
                    onClick={() => installRepository.mutateAsync({ id: getRepository.data.id })}
                    className="utrecht-button utrecht-button-sm btn-sm btn-success mr-2"
                    type="submit"
                  >
                    Install
                  </button>
                  <a href={getRepository.data?.html_url}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                      Github
                    </button>
                  </a>
                </div>
              );
            }}
            cardBody={function() {
              return (
                <div className="row">
                  <div className="col-12">
                    <div>
                      <div className="row">
                        <div className="container">
                          <div className="row">
                            <div className="col-12">
                              <span>{getRepository.data.description}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
        <div className="col-4">
          <Card
            title={"Owner"}
            cardHeader={function() {
              return (
                <a href={getRepository.data?.owner?.html_url}>
                  <button className="utrecht-button utrecht-button btn btn btn-light mr-2">
                    {getRepository.data?.owner?.["login"]}
                  </button>
                </a>
              );
            }}
            cardBody={function() {
              return (
                <div className="row">
                  <div className="col-12">
                    <div>
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <img src={getRepository.data?.owner?.avatar_url} alt="url" />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <span className="card-text">Owning repositories: </span>
                            <span className="text-truncate">{getRepository.data.owner?.repos.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    )
  );
};

export default OrganizationDetails;
