import * as React from "react";
import Spinner from "../common/spinner";
import { GenericInputComponent } from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import { isLoggedIn } from "../../services/auth";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { Link } from "gatsby";

export default function ObjectEntityForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [objectEntity, setObjectEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  let title;

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        frontendUrl: process.env.GATSBY_FRONTEND_URL,
        apiUrl: process.env.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        fetch(`${context.apiUrl}/object_entities/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setObjectEntity(data);
          });
      }
    }
  }, [context]);

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
    for (var propName in obj) {
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

    if (!checkInputs([body["name"]])) {
      setShowSpinner(false);
      return;
    }

    let url = context.adminUrl + "/entities";
    let method = null;
    if (id === "new") {
      method = "POST";
    } else {
      url = url + "/" + id;
      method = "PUT";
    }

    fetch(url, {
      method: method,
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
  if(id !== "new"){
    title = "Edit Object entities";
  }else{
    title = "Create Object entities";
  }


  return (
    <form id="dataForm" onSubmit={saveObjectEntity}>
      <Card
        title={title}
        cardHeader={function () {
          return (
            <>
              <Link className="utrecht-link" to={"/sources"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                type="submit"
              >
                <i className="fas fa-save mr-2" />
                Save
              </button>
            </>
          );
        }}
        cardBody={function () {
          return (
            <div className="row">
              <div className="col-12">
                {showSpinner === true ? (
                  <Spinner />
                ) : (
                  <>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {objectEntity !== null &&
                          objectEntity.uri !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              name={"uri"}
                              id={"uriInput"}
                              data={objectEntity.uri}
                              nameOverride={"Uri *"}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"uri"}
                              id={"uriInput"}
                              nameOverride={"Uri"}
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
                              name={"application"}
                              id={"applicationInput"}
                              data={objectEntity.application}
                              nameOverride={"Application"}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"application"}
                              id={"applicationInput"}
                              nameOverride={"Application"}
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
                              name={"organization"}
                              id={"organizationInput"}
                              data={objectEntity.organization}
                              nameOverride={"Organization"}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"organization"}
                              id={"organizationInput"}
                              nameOverride={"Organization"}
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          {objectEntity !== null &&
                          objectEntity.owner !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              name={"owner"}
                              id={"ownerInput"}
                              data={objectEntity.owner}
                              nameOverride={"Owner"}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"owner"}
                              id={"ownerInput"}
                              nameOverride={"Owner"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <span className="utrecht-form-label">
                            Object values
                          </span>
                          {objectEntity !== null &&
                          objectEntity.objectValues !== null ? (
                            <GenericInputComponent
                              type={"text"}
                              name={"objectValues"}
                              id={"objectValuesInput"}
                              data={objectEntity.objectValues}
                              nameOverride={"Object Values"}
                            />
                          ) : (
                            <GenericInputComponent
                              type={"text"}
                              name={"objectValues"}
                              id={"objectValuesInput"}
                              nameOverride={"Object Values"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
}
