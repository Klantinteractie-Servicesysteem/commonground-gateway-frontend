import * as React from "react";
import Layout from "../../../../components/common/layout";
import { Form } from '@formio/react';
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import APIService from "../../../../apiService/apiService"; 
import APIContext from "../../../../apiService/apiContext";
import FormIO from "../../../../apiService/resources/formIO";
import ApiCalls from "../../../../apiService/resources/apiCalls";
import Entity from "../../../../apiService/resources/entity";

const IndexPage = (props) => {
  const entityId: string = props.params.id === "new" ? null : props.params.id;
  const objectEntityId: string = props.params.objectEntityId === "new" ? null : props.params.objectEntityId;
  const API: APIService = React.useContext(APIContext);
  const [entity, setEntity] = React.useState(null);
  const [object, setObject] = React.useState(null);
  const [formIOSchema, setFormIOSchema] = React.useState(null);

  React.useEffect(() => {
    entityId && getEntity();
    objectEntityId && getObject();
  }, [API, entityId, objectEntityId]);

  React.useEffect(() => {
    entity && getFormIOSchema();
  }, [API, entity]);

  const getObject = () => {
    // setShowSpinner(true);objectEntityId
    API.ObjectEntity.getOne(entityId)
      .then((res) => {
        setEntity(res.data);
      })
      .catch((err) => {
        throw new Error("GET objectEntity error: " + err);
      })
      .finally(() => {
        // setShowSpinner(false);
      });
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

  const getFormIOSchema = (objectEntity?: any) => {
    API.FormIO.getSchema(entity.endpoint)
      .then((res) => {
        console.log('schema ', res.data)
        setFormIOSchema(res.data);
      })
      .catch((err) => {
        throw new Error("GET form.io schema error: " + err);
      })
    return;
  };

  const saveObject = id => event => {
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
          // setShowSpinner(false);
        });
    }
    if (objectEntityId) {
      API.ApiCalls.updateObject(entity?.endpoint, id, body)
        .then((res) => {
          setObject(res.data)
        })
        .catch((err) => {
          throw new Error("Update object error: " + err);
        })
        .finally(() => {
          // setShowSpinner(false);
        });
    }
  };


  return (
    <Layout title={"Object"} subtext={"View or edit this object"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {props.params.id !== "new" ? (
                <Tabs
                  items={[
                    { name: "Overview", id: "overview", active: true }
                  ]}
                />
              ) : (
                <Tabs
                  items={[{ name: "Overview", id: "overview", active: true }]}
                />
              )}
            </div>
            <div className="tab-content">
              <div
                className="tab-pane active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview-tab"
              >
                <br />
                <Form src={formIOSchema} onSubmit={saveObject} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
