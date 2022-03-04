import * as React from "react";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface ObjectEntitiesTableProps {
  entityId: string;
}

const ObjectEntitiesTable: React.FC<ObjectEntitiesTableProps> = ({ entityId }) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [objectEntities, setObjectEntities] = React.useState(null);
  const [entity, setEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [FormIO, setFormIO] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    setShowSpinner(true);
    if (entityId) {
      handleSetObjectEntities();
      getEntity();
    }
    handleSetDocumentation();
    setShowSpinner(false);
    handleSetDocumentation();
  }, [API, entityId]);

  React.useEffect(() => {
    setShowSpinner(true);
    entity && getFormIOSchema();
    setShowSpinner(false);
  }, [API, entity]);

  React.useEffect(() => {
    if (!formIOSchema) return;
    setShowSpinner(true);

    import("@formio/react").then((formio) => {
      const { Form } = formio;
      setFormIO(<Form src={formIOSchema} onSubmit={saveObject} />);
    });
    setShowSpinner(false);
  }, [formIOSchema]);

  const getFormIOSchema = () => {
    API.FormIO.getSchema(entity.endpoint)
      .then((res) => {
        setFormIOSchema(res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      });
  };

  const saveObject = (event) => {
    setShowSpinner(true);
    let body = event.data;
    body.submit = undefined;

    API.ApiCalls.createObject(entity?.endpoint, body)
      .catch((err) => {
        throw new Error("Create object error: " + err);
      })
      .finally(() => {
        handleSetObjectEntities();
      });
  };

  const getEntity = () => {
    setShowSpinner(true);
    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        throw new Error("GET entity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetObjectEntities = () => {
    setShowSpinner(true);
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        res?.data?.length > 0 && setObjectEntities(res.data);
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
    API.Documentation.get("object_types")
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
      title={"Objects"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#ObjectEntityHelpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Object Entities Documentation"
              id="ObjectEntityHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <a className="utrecht-link" onClick={handleSetObjectEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <button
              className="utrecht-button utrecht-button-sm btn-sm btn-success"
              data-bs-toggle="modal"
              data-bs-target="#objectModal"
            >
              <i className="fas fa-plus mr-2" />
              Create
            </button>
            <Modal
              title={`Create a new ${entity?.name} object`}
              id="objectModal"
              body={() => <>{FormIO && FormIO}</>}
            />
          </>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : objectEntities ? (
                <Table
                  columns={[
                    {
                      headerName: "ID",
                      field: "id",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                    {
                      headerName: "Created",
                      field: "dateCreated",
                      renderCell: (item: { dateCreated: string }) => new Date(item.dateCreated).toLocaleString("nl-NL"),
                    },
                    {
                      headerName: "Updated",
                      field: "dateModified",
                      renderCell: (item: { dateModified: string }) =>
                        new Date(item.dateModified).toLocaleString("nl-NL"),
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link
                            className="utrecht-link d-flex justify-content-end"
                            to={`/entities/${entityId}/objects/${item.id}`}
                          >
                            <button className="utrecht-button btn-sm btn-success">
                              <FontAwesomeIcon icon={faEdit} /> Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={objectEntities}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Id",
                      field: "id",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                    {
                      headerName: "Created",
                      field: "dateCreated",
                    },
                    {
                      headerName: "Updated",
                      field: "dateModified",
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
};

export default ObjectEntitiesTable;
