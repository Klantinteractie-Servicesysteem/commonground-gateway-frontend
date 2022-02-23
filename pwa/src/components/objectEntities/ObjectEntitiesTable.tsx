import * as React from "react";
import {
  Table,
  Card,
  Spinner,
  Modal
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";

interface ObjectEntitiesTableProps {
  entityId: string;
}

const ObjectEntitiesTable: React.FC<ObjectEntitiesTableProps> = ({
                                                                   entityId
                                                                 }) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [objectEntities, setObjectEntities] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  React.useEffect(() => {
    entityId && handleSetObjectEntities();
  }, [API, entityId]);

  const handleSetObjectEntities = () => {
    setShowSpinner(true);
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        setObjectEntities(res.data);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET object entities error: " + err);
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

  const handleDeleteObjectEntity = (id): void => {
    if (confirm(`Do you want to delete this object entity?`)) {
      API.ObjectEntity.delete(id)
        .then(() => {
          setAlert({ message: "Deleted object entity", type: "success" });
          handleSetObjectEntities();
        })
        .catch((err) => {
          setAlert({ message: err, type: "danger" });
          throw new Error("DELETE object entity error: " + err);
        });
    }
  };

  return (
    <Card
      title={"Object entities"}
      cardHeader={function() {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#ObjectEntityHelpModal"
            >
              <Modal
                title="Object Entities Documentation"
                id="ObjectEntityHelpModal"
                body={() => (
                  <div dangerouslySetInnerHTML={{ __html: documentation }} />
                )}
              />
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetObjectEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/entities/${entityId}/object_entities/new`}>
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
              ) : objectEntities ? (
                <Table
                  columns={[
                    {
                      headerName: "Uri",
                      field: "uri"
                    },
                    {
                      headerName: "Owner",
                      field: "owner"
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button onClick={() => handleDeleteObjectEntity(item.id)}
                                    className="utrecht-button btn-sm btn-danger mr-2">
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/entities/${entityId}/object_entities/${item.id}`}
                            >
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      }
                    }
                  ]}
                  rows={objectEntities}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Uri",
                      field: "uri"
                    },
                    {
                      headerName: "Owner",
                      field: "owner"
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
};

export default ObjectEntitiesTable;
