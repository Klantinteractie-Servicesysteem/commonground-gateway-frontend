import * as React from "react";
import { Card, Spinner, Modal, Accordion } from "@conductionnl/nl-design-system/lib";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import { AlertContext } from "../../../context/alertContext";
import { Link, navigate } from "gatsby";
import "./ObjectEntityFormNew.css";

interface ObjectEntityFormNewProps {
  objectId?: string;
  entityId: string;
}

export const ObjectEntityFormNew: React.FC<ObjectEntityFormNewProps> = ({ objectId, entityId }) => {
  const API: APIService = React.useContext(APIContext);
  const [entity, setEntity] = React.useState(null);
  const [object, setObject] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [formIO, setFormIO] = React.useState(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const title = objectId ?? "New object";

  React.useEffect(() => {
    getEntity();
    objectId && getObject();
  }, [API]);
  React.useEffect(() => {
    entity && getFormIOSchema();
  }, [entity, object]);

  React.useEffect(() => {
    if ((!entity || !formIO) && !showSpinner) {
      setShowSpinner(true);
      return;
    }
    entity && formIO && showSpinner && setShowSpinner(false);
  }, [entity, formIO]);

  React.useEffect(() => {
    if (!formIOSchema) return;

    import("@formio/react").then((formio) => {
      const { Form } = formio;
      setFormIO(<Form src={formIOSchema} onSubmit={saveObject} options={{ noAlerts: false }} />);
    });
  }, [formIOSchema]);

  const getObject = () => {
    setObject(null);
    let id: string;
    objectId ? (id = objectId) : (id = null);
    !id && object && object.id && (id = object.id);

    if (id) {
      API.ObjectEntity.getOne(id)
        .then((res) => {
          setObject(res.data);
        })
        .catch((err) => {
          throw new Error("GET objectEntity error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }
  };

  const getEntity = () => {
    setEntity(null);
    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        throw new Error("GET entity error: " + err);
      });
  };

  const getFormIOSchema = () => {
    setFormIOSchema(null);
    API.FormIO.getSchema(entity.endpoint)
      .then((res) => {
        setFormIOSchema(object ? fillFormIOSchema(res.data) : res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      });
  };

  const fillFormIOSchema = (schema: any) => {
    let schemaWithData = schema;
    let filledAttributes = [];
    for (let i = 0; i < schemaWithData.components.length; i++) {
      // Fill advanced configuration fields
      if (schemaWithData.components[i].key === "advancedConfiguration") {
        filledAttributes.push(schemaWithData.components[i].key);
        for (let k = 0; k < schemaWithData.components[i].components.length; k++) {
          // if (schemaWithData.components[i].components[k])
          // schemaWithData.components[i].components[k]
        }
        continue;
      }
      for (let j = 0; j < object?.objectValues?.length; j++) {
        if (filledAttributes.includes(object.objectValues[j]?.attribute.name)) {
          continue;
        }

        if (schemaWithData.components[i].key === object.objectValues[j]?.attribute.name) {
          let type = object.objectValues[i].attribute.type;
          schemaWithData.components[i].defaultValue = object.objectValues[i][`${type}Value`];
          filledAttributes.push(schemaWithData.components[i].key);
          break;
        }
      }
    }
    console.log(schemaWithData);
    return schemaWithData;
  };

  const saveObject = (event) => {
    setShowSpinner(true);
    setObject(null);
    let body = event.data;
    body.submit = undefined;

    if (!objectId) {
      API.ApiCalls.createObject(entity?.endpoint, body)
        .then(() => {
          navigate(`/entities/${entityId}`, { state: { activeTab: "objects" } });
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        });
    }
    if (objectId) {
      API.ApiCalls.updateObject(entity?.endpoint, objectId, body)
        .then((res) => {
          setObject(res);
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          setAlert({ message: "Saved object", type: "success" });
          getObject();
        });
    }
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
              data-bs-target="#handlerHelpModal"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Handler Documentation"
              id="handlerHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: "" }} />}
            />
            <Link className="utrecht-link" to={`/entities/${entityId}`} state={{ activeTab: "objects" }}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />
                Back
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function () {
        return (
          <>
            {showSpinner && <Spinner />}
            {!showSpinner && formIO && formIO}
            {!showSpinner && object && (
              <Accordion
                id="advancedConfigurationAccordion"
                items={[
                  {
                    title: "Advanced configuration",
                    id: "advConfigAccordion",
                    render: function () {
                      return (
                        <>
                          <table className="mt-3 configurationTable-table">
                            <tr key="URI">
                              <th>URI</th>
                              <td>{object?.uri ?? "No URI found"}</td>
                            </tr>
                            <tr key="ExternalID">
                              <th>External ID</th>
                              <td>{object.externalId ?? "No external ID found"}</td>
                            </tr>
                            <tr key="Application">
                              <th>Application</th>
                              <td>
                                {object.application ? (
                                  <Link to={`/applications/${object.application.id}`}>{object.application.name}</Link>
                                ) : (
                                  "No application found"
                                )}
                              </td>
                            </tr>
                            <tr key="Organization">
                              <th>Organization</th>
                              <td>{object.organization ?? "No organization found"}</td>
                            </tr>
                            <tr key="Owner">
                              <th>Owner</th>
                              <td>{object.owner ?? "No owner found"}</td>
                            </tr>
                          </table>

                          <Accordion
                            id="objectAccordion"
                            items={[
                              {
                                title: "Errors",
                                id: "errorsAccordion",
                                render: function () {
                                  return <h6>IN PROGRESS: needs refinement, no info on how to show data</h6>;
                                },
                              },
                              {
                                title: "Promises",
                                id: "promisesAccordion",
                                render: function () {
                                  return <h6>IN PROGRESS: needs refinement, no info on how to show data</h6>;
                                },
                              },
                              {
                                title: "External Result",
                                id: "externalResultAccordion",
                                render: function () {
                                  return <h6>IN PROGRESS: needs refinement, no info on how to show data</h6>;
                                },
                              },
                            ]}
                          />
                        </>
                      );
                    },
                  },
                ]}
              />
            )}
          </>
        );
      }}
    />
  );
};
export default ObjectEntityFormNew;
