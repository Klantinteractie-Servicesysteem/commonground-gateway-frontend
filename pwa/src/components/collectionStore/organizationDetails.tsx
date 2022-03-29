import * as React from "react";
import { Spinner, Card } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { navigate } from "gatsby-link";

interface OrganizationDetailProps {
  repositoryId: string;
}

export const OrganizationDetails: React.FC<OrganizationDetailProps> = ({ repositoryId }) => {
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

  const ownerDetail = [];
  if (getRepository?.data?.owner) {
    for (const [key, value] of Object.entries(getRepository.data.owner)) {
      ownerDetail.push({ ...{ key, value } });
    }
  }

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
        title={getRepository.data.owner.login}
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
                    <div className="container">
                      {
                        ownerDetail ? (
                          <table className="mt-3 logTable-table">
                            <tbody>
                            {ownerDetail.map((owner, idx) => {
                              return (
                                <tr key={owner.key + idx}>
                                  <th>{owner.key}</th>
                                  <td>{owner.value}</td>
                                </tr>
                              );
                            })}
                            </tbody>
                          </table>
                        ) : (
                          <p className="utrecht-paragraph">No organization details found found</p>
                        )}
                    </div>
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

export default OrganizationDetails;
