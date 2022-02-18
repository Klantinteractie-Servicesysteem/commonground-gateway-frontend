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
import FormIO from "../../apiService/resources/formIO";
import ApiCalls from "../../apiService/resources/apiCalls";

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

  const getFormIOSchema = (objectEntity?: any) => {
    // setShowSpinner(true);
    if (!objectEntity) {
      console.log(entity.endpoint);
      API.FormIO.getSchema(entity.endpoint)
        .then((res) => {
          console.log('schema with call: ', res.data)
          setFormIOSchema(res.data);
        })
        .catch((err) => {
          throw new Error("GET form.io schema error: " + err);
        })
        return;
    }
    console.log('schema from state: ', formIOSchema)
    if (formIOSchema && objectEntity && objectEntity.objectValues) {
      let schemaWithData = formIOSchema;
      for (let i = 0; i < formIOSchema.components.length; i++) {
        for (let i = 0; i < objectEntity.objectValues.length; i++) {
          if (schemaWithData.components[i].key = objectEntity.objectValues[i].attribute.name) {
            let type = objectEntity.objectValues[i].attribute.type;
            schemaWithData.components[i].defaultValue = objectEntity.objectValues[i][`${type}Value`];
          }
        }
        // setShowSpinner(false);
        return schemaWithData;
      }
      // setShowSpinner(false);
    };
  }

  const saveObject = id => event => {
    let body = event.data;
    body.submit = undefined;

    console.log('ID', id);

    if (!id) {
      API.ApiCalls.createObject(entity?.endpoint, body)
        .catch((err) => {
          throw new Error("Create object error: " + err);
        })
        .finally(() => {
          // setShowSpinner(false);
          handleSetObjectEntities();
        });
    }

    if (id) {

      API.ApiCalls.updateObject(entity?.endpoint, id, body)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          // setShowSpinner(false);
          handleSetObjectEntities();
        });
    }
  };

  const getEntity = () => {
    // setShowSpinner(true);
    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        throw new Error("GET entity error: " + err);
      })
      .finally(() => {
        // setShowSpinner(false);
      });
  };

  const handleSetObjectEntities = () => {
    // setShowSpinner(true);
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        res?.data?.length > 0 &&
          setObjectEntities(res.data)
      })
      .catch((err) => {
        throw new Error("GET object entities error: " + err);
      })
      .finally(() => {
        // setShowSpinner(false);
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
        title={"Objects"}
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
                body={() => (<>
                  {
                    formIOSchema &&
                    <Form id={'1'} src={formIOSchema} onSubmit={saveObject} />
                  }
                </>)}
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
                        field: "id",
                        headerName: " ",
                        renderCell: (item: any) => {
                          return (<>
                            <button className="utrecht-button btn-sm btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target={`#object${item.id.substring(0, 8)}Modal`}>
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                            <Modal
                              title={`Update ${entity?.name} object`}
                              id={`object${item.id.substring(0, 8)}Modal`}
                              body={() => (
                                formIOSchema &&
                                <Form id={item.id} src={getFormIOSchema(item)} onSubmit={saveObject(item.id)} />
                              )}
                            />
                          </>);
                        }
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
                              <button className="utrecht-button btn-sm btn-primary">
                                <i className="fas fa-eye pr-1" />
                                View
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
                      {
                        headerName: "",
                        field: "id",
                      },
                      {
                        headerName: "",
                        field: "id",
                      },
                    ]}
                    rows={[{ uri: 'No results found', owner: '' }]}
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
