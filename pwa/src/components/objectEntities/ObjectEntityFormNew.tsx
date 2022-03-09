import * as React from "react";
import {
  Card,
  Spinner,
  Modal
} from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { Link } from 'gatsby';

interface ObjectEntityFormNewProps {
  objectId: string,
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
    getObject();
  }, [API]);
  React.useEffect(() => {
    entity && object && getFormIOSchema();
  }, [entity, object]);

  React.useEffect(() => {
    if ((!entity || !object || !formIO) && !showSpinner) {
       setShowSpinner(true);
       return;
    }  
    (entity && object && formIO) && showSpinner && setShowSpinner(false)
  }, [entity, object, formIO]);

  React.useEffect(() => {
    if (!formIOSchema) return;

    import("@formio/react").then((formio) => {
      const { Form } = formio;
      setFormIO(
        <Form
          src={formIOSchema}
          onSubmit={saveObject}
        />,
      );
    });
  }, [formIOSchema]);


  const getObject = () => {
    setObject(null);
    API.ObjectEntity.getOne(objectId)
      .then((res) => {
        setObject(res.data);
      })
      .catch((err) => {
        throw new Error("GET objectEntity error: " + err);
      })
  };

  const getEntity = () => {
    setEntity(null);
    API.Entity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        throw new Error("GET entity error: " + err);
      })
  };

  const getFormIOSchema = () => {
    setFormIOSchema(null);
    API.FormIO.getSchema(entity.endpoint)
      .then((res) => {
        setFormIOSchema(object ? fillFormIOSchema(res.data) : res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      })
  };

  const fillFormIOSchema = (schema: any) => {
    let schemaWithData = schema;
    for (let i = 0; i < schemaWithData.components.length; i++) {
      for (let i = 0; i < object?.objectValues?.length; i++) {
        if (schemaWithData.components[i].key = object.objectValues[i].attribute.name) {
          let type = object.objectValues[i].attribute.type;
          schemaWithData.components[i].defaultValue = object.objectValues[i][`${type}Value`];
        }
      }
    }
    return schemaWithData;
  }

  const saveObject = (event) => {
    setObject(null);
    let body = event.data;
    body.submit = undefined;

    if (!objectId) {
      API.ApiCalls.createObject(entity?.endpoint, body)
        .catch((err) => {
          throw new Error("Create object error: " + err);
        })
        .finally(() => {
          setAlert({ message: "Saved object", type: "success" });
          getObject();
        });
    }
    if (objectId) {
      API.ApiCalls.updateObject(entity?.endpoint, objectId, body)
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
        )
      }}
      cardBody={function () {
        return (
          <>
            {
              showSpinner && <Spinner /> 
            }
            {
              !showSpinner && formIO && formIO
            }
          </>
        )
      }} 
    />
  )
}
export default ObjectEntityFormNew;
