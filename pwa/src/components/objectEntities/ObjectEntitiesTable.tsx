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
import { Form } from '@formio/react';
import FormJson from '../../dummy_data/form';

interface ObjectEntitiesTableProps {
  entityId: string;
}

const ObjectEntitiesTable: React.FC<ObjectEntitiesTableProps> = ({
  entityId,
}) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [objectEntities, setObjectEntities] = React.useState(null);
  const [entity, setEntity] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    if (entityId) {
      handleSetObjectEntities();
      getEntity();
    }
    handleSetDocumentation();
  }, [API, entityId]);

  React.useEffect(() => {
    entity && getFormIOSchema();
  }, [API, entity]);

  const getFormIOSchema = () => {
    setShowSpinner(true);
    API.FormIO.getSchema(entity?.endpoint)
      .then((res) => {
        setFormIOSchema(res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const saveObject = (event) => {
    let body = event.data;
    body.submit = undefined;

    let id = null;

    if (!id) {
      API.FormIO.createObject(entity?.endpoint, body)
        .then((res) => {
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }

    if (id) {
      API.FormIO.updateObject(entity?.endpoint, id, body)
        .then((res) => {
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }
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
        setObjectEntities(res.data);
      })
      .catch((err) => {
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
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <>
      <Card
        title={"Object entities"}
        cardHeader={function () {
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
              <button
                className="utrecht-button utrecht-button-sm btn-sm btn-success"
                data-bs-toggle="modal"
                data-bs-target="#objectModal">
                <i className="fas fa-plus mr-2" />
                Create
              </button>
              <Modal
                title={`Create a new ${entity?.name} object`}
                id="objectModal"
                body={() => (
                  <Form src={formIOSchema} onSubmit={saveObject} />
                )}
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
                        headerName: "Uri",
                        field: "uri",
                      },
                      {
                        headerName: "Owner",
                        field: "owner",
                      },
                      {
                        field: "id",
                        headerName: " ",
                        renderCell: (item: { id: string }) => {
                          return (
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/object_entities/${item.id}/${entityId}`}
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
                    rows={objectEntities}
                  />
                ) : (
                  <Table
                    columns={[
                      {
                        headerName: "Uri",
                        field: "uri",
                      },
                      {
                        headerName: "Owner",
                        field: "owner",
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
    </>
  );
};

export default ObjectEntitiesTable;
