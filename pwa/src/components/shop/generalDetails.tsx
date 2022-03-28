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
      <Card
        title={getRepository.data.name}
        cardHeader={function () {
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
export default GeneralDetails;
