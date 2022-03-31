import * as React from "react";
import { Card, Table, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { LoadingOverlayContext } from "../../context/loadingOverlayContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import { useQueryClient } from "react-query";
import { useEndpoint } from "../../hooks/endpoint";

export default function EndpointsTable() {
  const API: APIService = React.useContext(APIContext);
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const queryClient = useQueryClient();

  const _useEndpoint = useEndpoint(queryClient);
  const getEndpoints = _useEndpoint.getAll();
  const deleteEndpoint = _useEndpoint.remove();

  React.useEffect(() => {
    setHeader("Endpoints");
  }, [setHeader]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get("endpoints")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Endpoints"}
      cardHeader={function () {
        return (
          <>
            <a
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#endpointHelpModal"
              onClick={handleSetDocumentation}
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </a>
            <Modal
              title="Endpoint Documentation"
              id="endpointHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <button
              className="button-no-style utrecht-link"
              disabled={getEndpoints.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("endpoints");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getEndpoints.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            <Link to="/endpoints/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {getEndpoints.isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Table
                    columns={[
                      {
                        headerName: "Name",
                        field: "name",
                      },
                      {
                        headerName: "Path",
                        field: "path",
                      },
                      {
                        field: "id",
                        headerName: " ",
                        renderCell: (item: { id: string }) => {
                          return (
                            <div className="utrecht-link d-flex justify-content-end">
                              <button
                                className="utrecht-button btn-sm btn-danger mr-2"
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteModal${item.id.replace(new RegExp("-", "g"), "")}`}
                              >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                              <DeleteModal
                                resourceDelete={() => deleteEndpoint.mutateAsync({ id: item.id })}
                                resourceId={item.id}
                              />
                              <Link className="utrecht-link d-flex justify-content-end" to={`/endpoints/${item.id}`}>
                                <button className="utrecht-button btn-sm btn-success">
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                              </Link>
                            </div>
                          );
                        },
                      },
                    ]}
                    rows={getEndpoints.data ?? []}
                  />
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
