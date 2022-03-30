import * as React from "react";
import { Spinner, Card } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { navigate } from "gatsby-link";

interface GeneralDetailsProps {
  repositoryId: string;
}

export const GeneralDetails: React.FC<GeneralDetailsProps> = ({ repositoryId }) => {
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  /**
   * Queries and mutations
   */
  const queryClient = useQueryClient();

  const getRepository = useQuery<any, Error>(["repositories", repositoryId], () => API.Repository.getOne(repositoryId), {
    initialData: () => queryClient.getQueryData<any[]>("repositories")?.find((repository) => repository.repository.id === repositoryId),
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    enabled: !!repositoryId,
  });

  const installRepository = useMutation<any, Error, any>(["repositories", repositoryId], () => API.Repository.install(repositoryId), {
    onMutate: () => {
      setLoadingOverlay(true);
    },
    onError: (error) => {
      setAlert({ message: error.message, type: "danger" });
    },
    onSuccess: async (_) => {
      setAlert({ message: "Installed repository", type: "success" });
      navigate("/collections");
    },
    onSettled: () => {
      setLoadingOverlay(false);
    },
  });

  /**
   * Effects
   */
  React.useEffect(() => {
    setHeader("Repository");

    if (getRepository.isSuccess) {
      setHeader(
        <>
          Repository: <i>{getRepository.data.name}</i>
        </>,
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
                      {loadingOverlay && <LoadingOverlay />}
                      <div className="row">
                        <span>{getRepository.data.description}</span>
                        <span>{getRepository.data.subscribers ? getRepository.data.subscribers["login"] : null}</span>
                        <span>{getRepository.data.labels?.map(($item, idx) => (<span key={idx}
                                                                                     className="text-truncate">{$item.name} {$item.color} {$item.description}</span>))}</span>
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
            title={"Publiccode details"}
            cardHeader={function() {
              return (
                <a href={getRepository.data?.owner?.publiccode?.url}>
                  <button className="utrecht-button utrecht-button btn btn btn-light mr-2">
                    {getRepository.data?.owner?.publiccode?.name}
                  </button>
                </a>
              );
            }}
            cardBody={function() {
              return (
                <div className="row">
                  <div className="col-12">
                    <div>
                      {loadingOverlay && <LoadingOverlay />}
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <img src={getRepository.data?.owner?.publiccode?.logo} alt="url" />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <span className="card-text">Software Version: </span>
                            <span
                              className="text-truncate">{getRepository.data?.owner?.publiccode?.softwareVersion}</span>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <span className="card-text">Release Date: </span>
                            <span className="text-truncate">{getRepository.data?.owner?.publiccode?.releaseDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Card
            title={"Maintainers"}
            cardHeader={function() {
              return (
                <a href={getRepository.data?.owner?.publiccode?.maintenance?.contractors?.website}>
                  <button className="utrecht-button utrecht-button btn btn btn-light mr-2 small">
                    {getRepository.data?.owner?.publiccode?.maintenance?.contractors?.name}
                  </button>
                </a>
              );
            }}
            cardBody={function() {
              return (
                <div className="row">
                  <div className="col-12">
                    <div>
                      {loadingOverlay && <LoadingOverlay />}
                      <div className="row">
                        <div className="col-12">
                          <span className="card-text">Name: </span>
                          <span
                            className="text-truncate">{getRepository.data?.owner?.publiccode?.maintenance?.contractors?.name}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <span className="card-text">Email: </span>
                          <span
                            className="text-truncate">{getRepository.data?.owner?.publiccode?.maintenance?.contractors?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Card
            title={"Dependencies"}
            cardHeader={function() {
              return (<span />);
            }}
            cardBody={function() {
              return (
                <div className="row">
                  <div className="col-12">
                    <div>
                      {loadingOverlay && <LoadingOverlay />}
                      <div className="row">
                        <div className="col-12">
                          <span className="card-text">Name: </span>
                          <span
                            className="text-truncate">{getRepository.data?.owner?.publiccode?.dependsOn?.open?.name}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <span className="card-text">Optional: </span>
                          <span
                            className="text-truncate">{getRepository.data?.owner?.publiccode?.dependsOn?.open?.optional}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <span className="card-text">Minimal Version: </span>
                          <span
                            className="text-truncate">{getRepository.data?.owner?.publiccode?.dependsOn?.open?.versionMin}</span>
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
export default GeneralDetails;
