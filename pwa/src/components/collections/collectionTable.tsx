import * as React from "react";
import { Card, Table, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

export default function CollectionTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [collections, setCollections] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader("Collections");
  }, [setHeader]);

  React.useEffect(() => {
    handleSetCollections();
  }, [API]);

  const handleSetCollections = () => {
    setShowSpinner(true);
    API.Collection.getAll()
      .then((res) => {
        setCollections(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Collections error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleDeleteCollection = (id): void => {
    setLoadingOverlay(true);
    API.Collection.delete(id)
      .then(() => {
        setAlert({ message: "Deleted collection", type: "success" });
        handleSetCollections();
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("DELETE collection error: " + err);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  return (
    <Card
      title={"Collections"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#collectionHelpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Endpoint Documentation"
              id="collectionHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <a className="utrecht-link" onClick={handleSetCollections}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/collections/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
            </Link>
            <Link to="/shop">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-light">
                <i className="fas fa-shopping-cart mr-2"/>
                Import
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
              ) : collections ? (
                <>
                  {loadingOverlay && <LoadingOverlay />}
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
                        headerName: "Date Created",
                        field: "dateCreated",
                        renderCell: (item: { dateCreated: string }) =>
                          new Date(item.dateCreated).toLocaleString("nl-NL"),
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
                                resourceDelete={() => handleDeleteCollection({ id: item.id })}
                                resourceId={item.id}
                              />
                              <Link className="utrecht-link d-flex justify-content-end" to={`/collections/${item.id}`}>
                                <button className="utrecht-button btn-sm btn-success">
                                  <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                              </Link>
                            </div>
                          );
                        },
                      },
                    ]}
                    rows={collections}
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
                      headerName: "Description",
                      field: "description",
                    },
                    {
                      headerName: "Date Created",
                      field: "dateCreated",
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
