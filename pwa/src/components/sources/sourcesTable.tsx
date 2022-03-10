import * as React from "react";
import { Link } from "gatsby";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

export default function SourcesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [sources, setSources] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({ title: "Sources", subText: "An overview of your source objects" });
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    handleSetSources();
  }, [API]);

  const handleSetSources = () => {
    setShowSpinner(true);
    API.Source.getAll()
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Sources error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get("sources")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ title: "Oops something went wrong", message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  const handleDeleteSource = (id): void => {
    setLoadingOverlay(true);
    API.Source.delete(id)
      .then(() => {
        setAlert({ message: `Deleted source`, type: "success" });
        handleSetSources();
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("DELETE Sources error: " + err);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  return (
    <Card
      title={"Sources"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-bs-toggle="modal" data-bs-target="#sourceHelpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Source Documentation"
              id="sourceHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
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
                <>
                  {loadingOverlay && <LoadingOverlay />}
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
                            <div className="utrecht-link d-flex justify-content-end">
                              <button
                                className="utrecht-button btn-sm btn-danger mr-2"
                                data-bs-toggle="modal"
                                data-bs-target={`#deleteModal${item.id.replace(new RegExp("-", "g"), "")}`}
                              >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                              </button>
                              <DeleteModal handleDelete={handleDeleteSource} handleId={item.id} />
                              <Link className="utrecht-link d-flex justify-content-end" to={`/sources/${item.id}`}>
                                <button className="utrecht-button btn-sm btn-success">
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                              </Link>
                            </div>
                          );
                        },
                      },
                    ]}
                    rows={sources}
                  />
                </>
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
