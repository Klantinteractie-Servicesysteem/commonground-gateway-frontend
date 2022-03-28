import * as React from "react";
import { Card } from "@conductionnl/nl-design-system/lib";
import { HeaderContext } from "../../context/headerContext";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "react-query";
import { AlertContext } from "../../context/alertContext";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { navigate } from "gatsby-link";

interface ShopCardProps {
  repository: any;
}

export const ShopCard: React.FC<ShopCardProps> = ({ repository }) => {
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useState<boolean>(false);
  const [_, setAlert] = React.useContext(AlertContext);
  const API: APIService = React.useContext(APIContext);

  const installRepository = useMutation<any, Error, any>(["repositories", repository.id], () => API.Repository.install(repository.id), {
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
            <Link className="utrecht-link" to={`/shop/${repository.id}`}>
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
          <span>{repository.description}</span>
        );
      }}
    />
  );
};
