import * as React from "react";
import {
  Table,
  Card,
  Spinner,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import {AlertContext} from "../../context/alertContext";
import {HeaderContext} from "../../context/headerContext";

export default function EntitiesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [entities, setEntities] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetEntities();
    handleSetDocumentation();
  }, [API]);

  const handleSetEntities = () => {
    setShowSpinner(true);
    API.Entity.getAll()
      .then((res) => {
        setEntities(res.data);
      })
      .catch((err) => {
        throw new Error("GET Entities error: " + err);
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
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Object types"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#entityHelpModal"
            >
              <Modal
                title="Object Types Documentation"
                id="entityHelpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/entities/new">
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
              ) : entities ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                    },
                    {
                      headerName: "Path",
                      field: "route",
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
                      headerName: "Edit ",
                      renderCell: (item) => {
                        return (
                          <Link
                            className="utrecht-link d-flex justify-content-end"
                            to={`/entities/${item.id}`}
                          >
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={entities}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                    },
                    {
                      headerName: "Path",
                      field: "route",
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
