import * as React from "react";
import { Spinner, Card, Modal, Accordion } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/fontawesome-free";

interface ShopDetailProps {
  repositoryId: string;
}

export const ShopDetail: React.FC<ShopDetailProps> = ({ repositoryId }) => {
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
      <Card
        title={getRepository.data.name}
        cardHeader={function () {
          return (
            <div>
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
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
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                  <div>
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="row">
                        <span>{getRepository.data.description}</span>
                    </div>
                  </div>
              </div>
            </div>
          );
        }}
      />
    )
  );
};
export default ShopDetail;
