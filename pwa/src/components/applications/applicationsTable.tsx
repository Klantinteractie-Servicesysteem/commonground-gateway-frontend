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

export default function ApplicationsTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [applications, setApplications] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetApplications();
    handleSetDocumentation();
  }, [API]);

  const handleSetApplications = (): void => {
    setShowSpinner(true);
    API.Application.getAll()
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        throw new Error("GET Applications error: " + err);
      })
      .catch((err) => {
        throw new Error("GET Applications error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("applications")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Applications"}
      cardHeader={function () {
        return (
          <>
            <button
              type="button"
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#applicationHelpModal"
            >
              <Modal
                title="Application Documentation"
                id="applicationHelpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>

            <a className="utrecht-link" onClick={handleSetApplications}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/applications/new">
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
              ) : applications ? (
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
                          <Link
                            className="utrecht-link d-flex justify-content-end"
                            to={`/applications/${item.id}`}
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
                  rows={applications}
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
                  rows={[{ name: "No results found", description: " " }]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
