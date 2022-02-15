import * as React from "react";
import { Link } from "gatsby";
import {
  Table,
  Card,
  Spinner,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function SourcesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [sources, setSources] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetSources();
    handleSetDocumentation();
  }, [API]);

  const handleSetSources = () => {
    setShowSpinner(true);
    API.Source.getAll()
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        throw new Error("GET Sources error: " + err);
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
      title={"Sources"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#sourceHelpModal"
            >
              <Modal
                title="Sources Documentation"
                id="sourceHelpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetSources}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/sources/new">
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
              ) : sources ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Location",
                      field: "location",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link
                            className="utrecht-link d-flex justify-content-end"
                            to={`/sources/${item.id}`}
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
                  rows={sources}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Location",
                      field: "location",
                    },
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
