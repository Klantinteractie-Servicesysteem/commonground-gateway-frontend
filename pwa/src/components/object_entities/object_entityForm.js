import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { useEffect, useState } from "react";
import Card from "../common/card";
import Spinner from "../common/spinner";
import { GenericInputComponent } from "../utility/genericInput";

export default function ObjectEntityForm({ id }) {
  const context = useUrlContext();
  const [objectEntity, setObjectEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getObjectEntity = () => {
    fetch(context.apiUrl + "/object_entities/" + id, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setObjectEntity(data);
      });
  };

  const checkInputs = (inputs) => {
    let valid = true;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === undefined || inputs[i].length === 0) {
        valid = false;
      }
    }

    return valid;
  };

  const removeEmptyValues = (obj) => {
    for (const propName in obj) {
      if (
        (obj[propName] === undefined || obj[propName] === "") &&
        obj[propName] !== false
      ) {
        delete obj[propName];
      }
    }
    return obj;
  };

  const saveObjectEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let body = {
      uri: event.target.uri.value,
      application: event.target.application.value
        ? event.target.application.value
        : null,
      organization: event.target.organization.value
        ? event.target.organization.value
        : null,
      owner: event.target.owner.value ? event.target.owner.value : null,
      objectValues: event.target.objectValues.value
        ? event.target.objectValues.value
        : null,
    };

    // This removes empty values from the body
    body = removeEmptyValues(body);

    if (!checkInputs([body.name])) {
      setShowSpinner(false);
      return;
    }

    let url = context.apiUrl + "/entities";
    let method = null;
    if (id === "new") {
      method = "POST";
    } else {
      url = url + "/" + id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved entity:", data);
        setObjectEntity(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (id !== "new") {
      getObjectEntity();
    }
  }, []);

  return (
    <form id="dataForm" onSubmit={saveObjectEntity}>
      <Card title="Values" back="/entities" save={true}>
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <Spinner />
            ) : (
              <>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {objectEntity !== null && objectEntity.uri !== null ? (
                        <GenericInputComponent
                          type={"text"}
                          target={"uri"}
                          id={"uriInput"}
                          data={objectEntity.uri}
                          name={"Uri *"}
                          required={"true"}
                        />
                      ) : (
                        <GenericInputComponent
                          type={"text"}
                          target={"uri"}
                          id={"uriInput"}
                          name={"Uri"}
                          required={"true"}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {objectEntity !== null &&
                      objectEntity.application !== null ? (
                        <GenericInputComponent
                          type={"text"}
                          target={"application"}
                          id={"applicationInput"}
                          data={objectEntity.application}
                          name={"Application"}
                        />
                      ) : (
                        <GenericInputComponent
                          type={"text"}
                          target={"application"}
                          id={"applicationInput"}
                          name={"Application"}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {objectEntity !== null &&
                      objectEntity.organization !== null ? (
                        <GenericInputComponent
                          type={"text"}
                          target={"organization"}
                          id={"organizationInput"}
                          data={objectEntity.organization}
                          name={"Organization"}
                        />
                      ) : (
                        <GenericInputComponent
                          type={"text"}
                          target={"organization"}
                          id={"organizationInput"}
                          name={"Organization"}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {objectEntity !== null && objectEntity.owner !== null ? (
                        <GenericInputComponent
                          type={"text"}
                          target={"owner"}
                          id={"ownerInput"}
                          data={objectEntity.owner}
                          name={"Owner"}
                        />
                      ) : (
                        <GenericInputComponent
                          type={"text"}
                          target={"owner"}
                          id={"ownerInput"}
                          name={"Owner"}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <span className="utrecht-form-label">Object values</span>
                      {objectEntity !== null &&
                      objectEntity.objectValues !== null ? (
                        <GenericInputComponent
                          type={"text"}
                          target={"objectValues"}
                          id={"objectValuesInput"}
                          data={objectEntity.objectValues}
                          name={"Object Values"}
                        />
                      ) : (
                        <GenericInputComponent
                          type={"text"}
                          target={"objectValues"}
                          id={"objectValuesInput"}
                          name={"Object Values"}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </form>
  );
}
