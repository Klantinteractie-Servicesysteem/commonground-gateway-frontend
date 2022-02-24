import * as React from "react";
import {
  Card,
  Spinner,
} from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";
import { Form } from '@formio/react';
import { Link } from 'gatsby';

interface ObjectEntityFormNewProps {
  objectEntityId: string,
  entityId: string,
}

export const ObjectEntityFormNew: React.FC<ObjectEntityFormNewProps> = ({ objectEntityId, entityId }) => {
  const API: APIService = React.useContext(APIContext);
  const [entity, setEntity] = React.useState(null);
  const [object, setObject] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);
  const title = 'Edit';

  React.useEffect(() => {
    getEntity();
    getObject();
  }, [API]);

  React.useEffect(() => {
    object && entity && getFormIOSchema();
  }, [API, object, entity]);

  const getObject = () => {
    setShowSpinner(true);
    API.ObjectEntity.getOne(objectEntityId)
      .then((res) => {
        setObject(res.data);
      })
      .catch((err) => {
        throw new Error("GET objectEntity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
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

  const getFormIOSchema = () => {
    setShowSpinner(true);
    API.FormIO.getSchema(entity.endpoint)
      .then((res) => {
        setFormIOSchema(object ? fillFormIOSchema(res.data) : res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const fillFormIOSchema = (schema: any) => {
    let schemaWithData = schema;
    for (let i = 0; i < schemaWithData.components.length; i++) {
      for (let i = 0; i < object.objectValues.length; i++) {
        if (schemaWithData.components[i].key = object.objectValues[i].attribute.name) {
          let type = object.objectValues[i].attribute.type;
          schemaWithData.components[i].defaultValue = object.objectValues[i][`${type}Value`];
        }
      }
    }
    return schemaWithData;
  }

  const saveObject = (event) => {
    let body = event.data;
    body.submit = undefined;

    if (!objectEntityId) {
      API.ApiCalls.createObject(entity?.endpoint, body)
        .then((res) => {
          setObject(res.data)
        })
        .catch((err) => {
          throw new Error("Create object error: " + err);
        })
        .finally(() => {
          getObject();
        });
    }
    if (objectEntityId) {
      API.ApiCalls.updateObject(entity?.endpoint, objectEntityId, body)
        .then((res) => {
          setObject(res.data)
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          getObject();
        });
    }
  };


  return (
    <Card
      title={title}
      cardHeader={function () {
        return (
          <div>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#helpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Link className="utrecht-link" to={`/entities/${entityId}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />Back
              </button>
            </Link>
          </div>)
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : (
                formIOSchema && typeof window !== 'undefined' &&
                <Form src={formIOSchema} onSubmit={saveObject} />
              )} 
            </div>
          </div>
        )
      }} />
  )
}
export default ObjectEntityFormNew;
