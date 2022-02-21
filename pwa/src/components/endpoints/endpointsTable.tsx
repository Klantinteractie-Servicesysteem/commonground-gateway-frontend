import * as React from "react";
import {
  Card,
  Table,
  Spinner,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";

export default function EndpointsTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [endpoints, setEndpoints] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    handleSetEndpoints();
    handleSetDocumentation();
    setHeader({title: 'Endpoints', subText: 'An overview of your endpoint objects'});
  }, [API]);

  const handleSetEndpoints = () => {
    setShowSpinner(true);
    API.Endpoint.getAll()
      .then((res) => {
        setEndpoints(res.data);
      })
      .catch((err) => {
        setAlert({message: err, type: 'danger'})
        throw new Error("GET Endpoints error: " + err);
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
        setAlert({message: err, type: 'danger'})
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Endpoints"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#endpointHelpModal"
            >
              <Modal
                title="Endpoint Documentation"
                id="endpointHelpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetEndpoints}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
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
              {showSpinner === true ? (
                <Spinner />
              ) : endpoints ? (
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
                          <Link
                            className="utrecht-link d-flex justify-content-end"
                            to={`/endpoints/${item.id}`}
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
                  rows={endpoints}
                />
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
                  ]}
                  rows={[
                    {
                      name: "No results found",
                      description: " ",
                    },
                  ]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
