import * as React from "react";
import { Table, Spinner, Card, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import { useQueryClient } from "react-query";
import { useHandler } from "./../../hooks/handler";

export default function HandlersTable({ endpointId }) {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  const queryClient = useQueryClient();
  const _useHandler = useHandler(queryClient);
  const getHandlers = _useHandler.getAllFromEndpoint(endpointId);
  const deleteHandler = _useHandler.remove();

  React.useEffect(() => {
    handleSetDocumentation();
  }, [API]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get("attributes")
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
      title={"Handlers"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#handlerHelpModal"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Handler Documentation"
              id="handlerHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <button
              className="button-no-style utrecht-link"
              disabled={getHandlers.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("handlers");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getHandlers.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            <Link to={`/endpoints/${endpointId}/handlers/new`}>
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
              {getHandlers.isLoading ? (
                <Spinner />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Description",
                      field: "description",
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
                              resourceDelete={() => deleteHandler.mutateAsync({ id: item.id })}
                              resourceId={item.id}
                            />
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/endpoints/${endpointId}/handlers/${item.id}/`}
                            >
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={getHandlers.data ?? []}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
