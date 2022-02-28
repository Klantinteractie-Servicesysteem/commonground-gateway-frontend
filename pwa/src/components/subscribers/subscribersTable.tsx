import * as React from "react";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export default function SubscribersTable({ entityId }) {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [subscribers, setSubscribers] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const title: string = entityId === "new" ? "Create Subscriber" : "Edit Subscriber";

  React.useEffect(() => {
    handleSetSubscribers();
  }, [API]);

  const handleSetSubscribers = () => {
    setShowSpinner(true);
    API.Attribute.getAllFromEntity(entityId)
      .then((res) => {
        // setSubscribers(res.data);
        setSubscribers([]);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Subscribers error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleDeleteSubscriber = (id): void => {
    if (confirm(`Do you want to delete this subscriber?`)) {
      API.Entity.delete(id)
        .then(() => {
          setAlert({ message: `Deleted subscriber`, type: "success" });
          handleSetSubscribers();
        })
        .catch((err) => {
          setAlert({ message: err, type: "danger" });
          throw new Error("DELETE Subscriber error: " + err);
        });
    }
  };

  return (
    <Card
      title={title}
      cardHeader={function () {
        return (
          <>
            <a className="utrecht-link" onClick={handleSetSubscribers}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/entities/${entityId}/subscribers/new`}>
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
              {showSpinner === true ? (
                <Spinner />
              ) : subscribers ? (
                <Table
                  columns={[
                    {
                      headerName: "Asynchronous",
                      field: "asynchronous",
                    },
                    {
                      headerName: "Method",
                      field: "method",
                    },
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                    },
                    {
                      headerName: "Source",
                      field: "gateway",
                      valueFormatter: (item) => {
                        return item ? item.name : "";
                      },
                    },
                    {
                      field: "id",
                      headerName: "",
                      renderCell: (item) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button
                              onClick={() => handleDeleteSubscriber(item.id)}
                              className="utrecht-button btn-sm btn-danger mr-2"
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <Link className="utrecht-link d-flex justify-content-end" to={`/entities/${item.id}`}>
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={subscribers}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Asynchronous",
                      field: "asynchronous",
                    },
                    {
                      headerName: "Method",
                      field: "method",
                    },
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                    },
                    {
                      headerName: "Source",
                      field: "gateway.name",
                    },
                  ]}
                  rows={[{ name: "No results found" }]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
