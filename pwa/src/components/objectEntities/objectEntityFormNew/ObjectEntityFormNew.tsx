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
  const [showSpinner, setShowSpinner] = React.useState(true);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const [formIO, setFormIO] = React.useState(null);
  const [_, setAlert] = React.useContext(AlertContext);
  const title = objectId ?? "New object";

  React.useEffect(() => {
    if (!entity) {
      console.log(entity);
      getEntity();
    }
  }, [API]);

  React.useEffect(() => {
    entity && !formIOSchema && getFormIOSchema();
  }, [entity]);

  React.useEffect(() => {
    !entity || !formIO ? setShowSpinner(true) : setShowSpinner(false);
  }, [entity, formIO]);

  React.useEffect(() => {
    formIOSchema &&
      import("@formio/react").then((formio) => {
        const { Form } = formio;
        setFormIO(<Form src={formIOSchema} onSubmit={saveObject} options={{ noAlerts: false }} />);
      });
  }, [formIOSchema]);

  const getEntity = () => {
    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res);
      })
      .catch((err) => {
        throw new Error("GET entity error: " + err);
      });
  };

  const getFormIOSchema = () => {
    let schemaUrl;
    let endpointForCall;
    entity.handlers[0].endpoints.forEach((endpoint, key) => {
      if (
        endpoint.operationType === (objectId ? "item" : "collection") &&
        (endpoint.method === "GET" || endpoint.method === "get")
      ) {
        endpointForCall = endpoint;
      }
    });

    schemaUrl = endpointForCall?.path?.join("/");
    if (schemaUrl === null || schemaUrl === undefined) {
      setAlert({
        message: `No Endpoint found with method: GET and operationType: ${
          objectId ? "item" : "collection"
        }. Check if this Entity has a Handler that has an Endpoint with method: GET and operationType: ${
          objectId ? "item" : "collection"
        }`,
        type: "danger",
      });
      return;
    }

    if (schemaUrl.includes("{id}")) {
      schemaUrl = schemaUrl.replace("{id}", objectId);
    }

    API.FormIO.getSchema(schemaUrl)
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
            {showSpinner && <Spinner />}
            {formIO && formIO}
            {formIO && (
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
