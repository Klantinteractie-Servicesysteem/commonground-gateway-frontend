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
import { useCollection } from "../../hooks/collection";

export default function CollectionTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);
  const [___, setLoadingOverlay] = React.useContext(LoadingOverlayContext);

  const queryClient = useQueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollections = _useCollection.getAll();
  const deleteCollection =  _useCollection.remove()

  React.useEffect(() => {
    setHeader("Collections");
  }, [setHeader]);

  const handleDeleteCollection = (id): void => {
    setLoadingOverlay({ isLoading: true });
    API.Collection.delete(id)
      .then(() => {
        setAlert({ message: "Deleted collection", type: "success" });
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("DELETE collection error: " + err);
      })
      .finally(() => {
        setLoadingOverlay({ isLoading: false });
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
            <button
              className="button-no-style utrecht-link"
              disabled={getCollections.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("collections");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getCollections.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            <Link to="/collections/new">
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
              {getCollections.isLoading ? (
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
                      headerName: "Date Created",
                      field: "dateCreated",
                      renderCell: (item: { dateCreated: string }) => new Date(item.dateCreated).toLocaleString("nl-NL"),
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
                              resourceDelete={() => deleteCollection.mutateAsync({ id: item.id })}
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
                  rows={getCollections.data ?? []}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
