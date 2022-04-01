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
  const [objectAPI, setObjectAPI] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [formIO, setFormIO] = React.useState(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const title = objectId ?? "New object";

  React.useEffect(() => {
    getEntity();
    // objectId && getObject();
  }, [API]);
  React.useEffect(() => {
    entity && getFormIOSchema();
    // entity && getObjectAPI();
  }, [entity]);

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

  // const getObject = () => {
  //   setObject(null);
  //   let id: string;
  //   objectId ? (id = objectId) : (id = null);
  //   !id && object && object.id && (id = object.id);

  //   if (id) {
  //     API.ObjectEntity.getOne(id)
  //       .then((res) => {
  //         console.log(res.data.objectValues[0]);
  //         setObject(res.data);
  //       })
  //       .catch((err) => {
  //         throw new Error("GET objectEntity error: " + err);
  //       })
  //       .finally(() => {
  //         setShowSpinner(false);
  //       });
  //   }
  // };

  // const getObjectAPI = () => {
  //   setObjectAPI(null);
  //   let id: string;
  //   objectId ? (id = objectId) : (id = null);
  //   !id && object && object.id && (id = object.id);

  //   console.log(entity.handlers[0].endpoints[0].path.join("/") + id);
  //   let endpointForCall;
  //   entity.handlers[0].endpoints.forEach((key, endpoint) => {
  //     if (endpoint.operationType === "collection" && (endpoint.method === "GET" || endpoint.method === "get")) {
  //       endpointForCall = endpoint;
  //     }
  //   });

  //   let url = "weer";

  //   if (id) {
  //     API.ApiCalls.getOne(url, id)
  //       .then((res) => {
  //         console.log(res);
  //         setObjectAPI(res);
  //       })
  //       .catch((err) => {
  //         throw new Error("GET objectAPI error: " + err);
  //       })
  //       .finally(() => {
  //         setShowSpinner(false);
  //       });
  //   }
  // };

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
    if (formIOSchema) return;
    setFormIOSchema(null);
    let schemaUrl;
    let endpointForCall;
    entity.handlers[0].endpoints.forEach((key, endpoint) => {
      if (endpoint.operationType === "collection" && (endpoint.method === "GET" || endpoint.method === "get")) {
        endpointForCall = endpoint;
      }
    });
    // schemaUrl = endpointForCall.path.join("/") + (objectId ? "/" + objectId : "");
    schemaUrl = "weer/" + objectId;
    API.FormIO.getSchema(schemaUrl)
      .then((res) => {
        console.log(res.data);
        setFormIOSchema(res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      });
  };

  // const fillFormIOSchema = (schema: any) => {
  //   let schemaWithData = schema;
  //   let filledAttributes = [];
  //   const advConfigData = {
  //     "@application": object.application ? `/admin/applications/${object.application.id}` : null,
  //     "@organization": object.organization ?? null,
  //     "@owner": object.owner ?? null,
  //   };
  //   for (let i = 0; i < schemaWithData.components.length; i++) {
  //     // Set advanced configuration defaultValues
  //     if (schemaWithData.components[i].key === "advancedConfiguration") {
  //       filledAttributes.push(schemaWithData.components[i].key);
  //       for (let k = 0; k < schemaWithData.components[i].components.length; k++) {
  //         if (filledAttributes.includes(schemaWithData.components[i].components[k].key)) {
  //           continue;
  //         }
  //         if (advConfigData[schemaWithData.components[i].components[k].key]) {
  //           schemaWithData.components[i].components[k].defaultValue =
  //             advConfigData[schemaWithData.components[i].components[k].key];
  //           continue;
  //         }
  //       }
  //     }
  //     // Set defaultValues other attributes
  //     for (let j = 0; j < object?.objectValues?.length; j++) {
  //       if (filledAttributes.includes(object?.objectValues[j]?.attribute.name)) {
  //         continue;
  //       }
  //       // Fill entity attributes
  //       if (
  //         schemaWithData.components[i].type === "panel" &&
  //         schemaWithData.components[i].key !== "advancedConfiguration"
  //       ) {
  //         schemaWithData.components[i].components.forEach((component, key) => {
  //           console.log(component.key);
  //         });
  //       }
  //       // Fill normal attribute
  //       if (schemaWithData.components[i].key === object.objectValues[j]?.attribute.name) {
  //         let type = object.objectValues[j]?.attribute.type;
  //         schemaWithData.components[i].defaultValue = object.objectValues[j][`${type}Value`];
  //         filledAttributes.push(schemaWithData.components[i].key);
  //         break;
  //       }
  //     }
  //   }
  //   return schemaWithData;
  // };

  const saveObject = (event) => {
    // console.log(event);
    // return;
    setShowSpinner(true);
    setObject(null);
    let body = event.data;
    body.submit = undefined;

    if (!objectId) {
      API.ApiCalls.createObject(entity?.handlers[0].endpoints[0].path.join("/"), body)
        .then(() => {
          navigate(`/entities/${entityId}`, { state: { activeTab: "objects" } });
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        });
    }
    if (objectId) {
      API.ApiCalls.updateObject(entity?.handlers[0].endpoints[0].path.join("/"), objectId, body)
        .then((res) => {
          setObject(res);
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          setAlert({ message: "Saved object", type: "success" });
          // getObject();
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
              data-bs-target="#objectEntityHelpModal"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="ObjectEntity Documentation"
              id="objectEntityHelpModal"
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
            {!formIO && <Spinner />}
            {formIO && formIO}
            {!showSpinner && formIO && (
              <>
                {/* <Accordion
                  id="errorsAccordion"
                  items={[
                    {
                      title: "Errors",
                      id: "errorsAccordion2",
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
                /> */}
              </>
            )}
          </>
        );
      }}
    />
  );
};
export default ObjectEntityFormNew;
