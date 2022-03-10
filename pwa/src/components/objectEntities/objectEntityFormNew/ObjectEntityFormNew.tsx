import * as React from "react";
import {
  Card,
  Spinner,
  Modal,
  Accordion
} from "@conductionnl/nl-design-system/lib";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import { AlertContext } from "../../../context/alertContext";
import { Link, navigate } from 'gatsby';
import "./ObjectEntityFormNew.css";

interface ObjectEntityFormNewProps {
  objectId?: string,
  entityId: string,
}

export const ObjectEntityFormNew: React.FC<ObjectEntityFormNewProps> = ({ objectId, entityId }) => {
  const API: APIService = React.useContext(APIContext);
  const [entity, setEntity] = React.useState(null);
  const [object, setObject] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [formIO, setFormIO] = React.useState(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const title = objectId ?? 'New object';

  React.useEffect(() => {
    getEntity();
    objectId && getObject();
  }, [API]);

  React.useEffect(() => {
    entity && getFormIOSchema();
  }, [entity]);



  React.useEffect(() => {
    if (!formIOSchema || (objectId && !object)) return;

    import("@formio/react").then((formio) => {
      const { Form } = formio;
      setFormIO(
        <Form
          src={formIOSchema}
          onSubmit={saveObject}
          options={{noAlerts: false}}
        />
      );
      console.log('Form IO')
      console.log(
        <Form
          src={formIOSchema}
          onSubmit={saveObject}
          options={{noAlerts: false}}
        />);
        console.log(formIO);
    });
  }, [formIOSchema, object]);


  const getObject = (savedId: string = null) => {
    let id: string;
    objectId && (id = objectId);
    !id && object && object.id && (id = object.id);
    !id && savedId && (id = savedId);
    if (id) {
      API.ObjectEntity.getOne(id)
        .then((res) => {
          setObject(res.data);
          getFormIOSchema();
        })
        .catch((err) => {
          throw new Error("GET objectEntity error: " + err);
        })
      }
  };

  const getEntity = () => {
    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        throw new Error("GET entity error: " + err);
      })
  };

  const getFormIOSchema = () => {
    if (!entity) return;
    if (formIOSchema) {
      setFormIOSchema(object ? fillFormIOSchema(formIOSchema) : formIOSchema);
      return;
    }
    API.FormIO.getSchema(entity.name)
      .then((res) => {
        setFormIOSchema(object ? fillFormIOSchema(res.data) : res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      });

    console.log(formIOSchema);
  };

  const fillFormIOSchema = (schema: any) => {
    let schemaWithData = schema;
    console.log('yes');
    for (let i = 0; i < schemaWithData.components.length; i++) {
      console.log('yes2');
      for (let i = 0; i < object?.objectValues?.length; i++) {
        console.log('yes3');
        if (schemaWithData.components[i].key = object.objectValues[i].attribute.name) {
          console.log('yes4');
          let type = object.objectValues[i].attribute.type;
          schemaWithData.components[i].defaultValue = object.objectValues[i][`${type}Value`];
        }
      }
    }
    return schemaWithData;
  }

  const saveObject = (event) => {
    !showSpinner && setShowSpinner(true);

    let body = event.data;
    body.submit = undefined;

    if (!objectId) {
      API.ApiCalls.createObject(entity.name, body)
        .then((res) => {
          navigate(`/entities/${entityId}/objects`, {state: {activeTab: "objects"}})
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        });
    }
    if (objectId) {
      API.ApiCalls.updateObject(entity.name, objectId, body)
        .then((res) => {
          getObject(res.data.id);
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          setAlert({ message: "Saved object", type: "success" });
          setShowSpinner(false);
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
        )
      }}
      cardBody={function () {
        return (
          <>
            {
              formIO && formIO
            }
            {
              !showSpinner && object && 
                  <Accordion
                    id="advancedConfigurationAccordion"
                  items={[
                    {
                      title: "Advanced configuration",
                      id: "advConfigAccordion",
                      render: function () {
                        return (<>
                          <table className="mt-3 configurationTable-table">
                            <tr key="URI">
                              <th>URI</th>
                              <td>{object?.uri ?? 'No URI found'}</td>
                            </tr>
                            <tr key="ExternalID">
                              <th>External ID</th>
                              <td>{object.externalId ?? 'No external ID found'}</td>
                            </tr>
                            <tr key="Application">
                              <th>Application</th>
                              <td>
                                {
                                  object.application ?
                                  <Link to={`/applications/${object.application.id}`}>{object.application.name}</Link>
                                  : 'No application found'
                                }
                              </td>
                            </tr>
                            <tr key="Organization">
                              <th>Organization</th>
                              <td>{object.organization ?? 'No organization found'}</td>
                            </tr>
                            <tr key="Owner">
                              <th>Owner</th>
                              <td>{object.owner ?? 'No owner found'}</td>
                            </tr>
                          </table>
      
                          <Accordion
                            id="objectAccordion"
                            items={[
                              {
                                title: "Errors",
                                id: "errorsAccordion",
                                render: function () {
                                  return (<h6>IN PROGRESS: needs refinement, no info on how to show data</h6>);
                                },
                              },
                              {
                                title: "Promises",
                                id: "promisesAccordion",
                                render: function () {
                                  return (<h6>IN PROGRESS: needs refinement, no info on how to show data</h6>);
                                },
                              },
                              {
                                title: "External Result",
                                id: "externalResultAccordion",
                                render: function () {
                                  return (<h6>IN PROGRESS: needs refinement, no info on how to show data</h6>);
                                },
                              },
                            ]}
                          /></>
                          
                        );
                      },
                    },
                    ]}
                  />
            }
            </>
        )
      }} 
    />
  )
}
export default ObjectEntityFormNew;
