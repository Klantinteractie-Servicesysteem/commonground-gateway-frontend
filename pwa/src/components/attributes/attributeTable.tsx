import * as React from "react";
import { Table, Spinner, Card, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import LabelWithBackground from "../LabelWithBackground/LabelWithBackground";
import DeleteModal from "../deleteModal/Deletemodal";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

export default function AttributeTable({ entityId }) {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [attributes, setAttributes] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const title: string = entityId === "new" ? "Create Attribute" : "Edit Attribute";
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    handleSetAttributes();
  }, [API]);

  const handleSetAttributes = () => {
    setShowSpinner(true);
    API.Attribute.getAllFromEntity(entityId)
      .then((res) => {
        setAttributes(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET attributes from entity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

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

  const handleDeleteAttribute = (id): void => {
    setLoadingOverlay(true);
    API.Attribute.delete(id)
      .then(() => {
        setAlert({ message: `Deleted attribute`, type: "success" });
        handleSetAttributes();
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("DELETE attribute error: " + err);
      })
      .finally(() => {
        setLoadingOverlay(false);
      });
  };

  return (
    <Card
      title={title}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#attributeHelpModal"
              onClick={(e) => e.preventDefault()}
            >
              <Modal
                title="Attribute Documentation"
                id="attributeHelpModal"
                body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetAttributes}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/entities/${entityId}/attributes/new`}>
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
              ) : attributes ? (
                <>
                  {loadingOverlay && <LoadingOverlay />}
                  <Table
                    columns={[
                      {
                        headerName: "Name",
                        field: "name",
                      },
                      {
                        headerName: "Type",
                        field: "type",
                      },
                      {
                        headerName: "Format",
                        field: "format",
                      },
                      {
                        headerName: "Required",
                        field: "required",
                        renderCell: (item: { required: boolean }) =>
                          item.required ? (
                            <LabelWithBackground label="required" type="primary" />
                          ) : (
                            <LabelWithBackground label="optional" type="secondary" />
                          ),
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
                              <DeleteModal handleDelete={handleDeleteAttribute} handleId={item.id} />
                              <Link
                                className="utrecht-link d-flex justify-content-end"
                                to={`/entities/${entityId}/attributes/${item.id}`}
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
                    rows={attributes}
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
                      headerName: "Type",
                      field: "type",
                    },
                    {
                      headerName: "Format",
                      field: "format",
                    },
                    {
                      headerName: "Required",
                      field: "required",
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
