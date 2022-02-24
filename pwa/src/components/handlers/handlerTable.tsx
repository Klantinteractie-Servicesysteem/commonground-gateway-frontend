import * as React from "react";
import {
  Table,
  Spinner,
  Card,
  Modal
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function HandlersTable({ endpointId }) {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [handlers, setHandlers] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    handleSetHandlers();
  }, [API]);

  const handleSetHandlers = () => {
    setShowSpinner(true);
    API.Handler.getAllFromEndpoint(endpointId)
      .then((res) => {
        setHandlers(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET handler from endpoint error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleDeleteHandler = (id): void => {
    if (confirm(`Do you want to delete this handler?`)) {
      API.Handler.delete(id)
        .then(() => {
          setAlert({ message: `Deleted handler with`, type: "success" });
          handleSetHandlers();
        })
        .catch((err) => {
          setAlert({ message: err, type: "danger" });
          throw new Error("DELETE handler error: " + err);
        });
    }
  };

  return (
    <Card
      title="Handlers"
      cardHeader={function() {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#handlerHelpModal"
              onClick={(e) => e.preventDefault()}
            >
              <Modal
                title="Handler Documentation"
                id="handlerHelpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetHandlers}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/endpoints/${endpointId}/handlers/new`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function() {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : handlers ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name"
                    },
                    {
                      headerName: "Description",
                      field: "description"
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button onClick={() => handleDeleteHandler(item.id)}
                                    className="utrecht-button btn-sm btn-danger mr-2">
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/endpoints/${endpointId}/handlers/${item.id}/`}>
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      }
                    }
                  ]}
                  rows={handlers}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name"
                    },
                    {
                      headerName: "Description",
                      field: "description"
                    }
                  ]}
                  rows={[]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
