import * as React from "react";
import Spinner from "../common/spinner";
import {GenericInputComponent, Accordion, SelectInputComponent} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";
import {Link} from "gatsby";
import {checkValues, removeEmptyObjectValues, retrieveFormArrayAsOArray} from "../utility/inputHandler";
import {navigate} from "gatsby-link";
import {ArrayInputComponent} from "../common/arrayInput";

export default function ObjectEntityForm({id, entityId}) {
  const [context, setContext] = React.useState(null);
  const [objectEntity, setObjectEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [applications, setApplications] = React.useState(null);
  const [objectValues, setObjectValues] = React.useState(null);
  let title;


  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (id !== 'new') {
          getObjectEntity();
        }
        getApplications();
        getObjectValues();
      }
    }
  }, [context]);

  const getObjectEntity = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/object_entities/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data.id !== undefined) {
          setObjectEntity(data);
        } else if (data['hydra:description'] !== undefined) {
          setAlert(null);
          setAlert({type: 'danger', message: data['hydra:description']});
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getApplications = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/applications`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setApplications(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getObjectValues = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/values`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setObjectValues(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const saveObjectEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let errors = retrieveFormArrayAsOArray(event.target, "errors");
    let promises = retrieveFormArrayAsOArray(event.target, "promises");
    let externalResult = retrieveFormArrayAsOArray(event.target, "externalResult");

    let body:{} = {
      uri: event.target.uri.value,
      externalId: event.target.externalId ? event.target.externalId.value : null,
      application: event.target.application.value
        ? event.target.application.value
        : null,
      organization: event.target.organization.value
        ? event.target.organization.value
        : null,
      owner: event.target.owner.value ? event.target.owner.value : null,
      entity: `/admin/entities/${entityId}`,
      objectValues: event.target.objectValues.value
        ? event.target.objectValues.value
        : null,
      subresourceOf: event.target.subresourceOf.value ? event.target.subresourceOf.value : null,
      errors,
      promises,
      externalResult,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body["uri"]])) {
      return;
    }

    let url = `${context.adminUrl}/object_entities`;
    let method = "POST";
    if (id !== "new") {
      url = `${url}/${id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setObjectEntity(data);
        method === 'POST' && navigate(`/entities/${entityId}`)
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
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
                <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2"/>
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                type="submit"
              >
                <i className="fas fa-save mr-2"/>
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
                  <Spinner/>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"uri"}
                            id={"uriInput"}
                            data={objectEntity && objectEntity.uri && objectEntity.uri}
                            nameOverride={"Uri"}
                            required={true}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"externalId"}
                            id={"externalIdInput"}
                            data={objectEntity && objectEntity.externalId && objectEntity.externalId}
                            nameOverride={"External Id"}
                          />
                        </div>
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {
                            applications !== null && applications.length > 0 ? (
                              <>
                                {objectEntity !== null &&
                                objectEntity.application !== undefined &&
                                objectEntity.application !== null ? (
                                    <SelectInputComponent
                                      options={applications}
                                      data={objectEntity.application.name}
                                      name={"application"} id={"applicationInput"} nameOverride={"Application"}
                                      value={"/admin/applications/"}/>
                                  )
                                  : (
                                    <SelectInputComponent
                                      options={applications}
                                      name={"application"} id={"applicationInput"} nameOverride={"Application"}
                                      value={"/admin/applications/"}/>
                                  )}
                              </>
                            ) : (
                              <SelectInputComponent
                                options={[{name: "Please create a Application.", value: null}]}
                                name={"application"} id={"applicationInput"} nameOverride={"Application"}
                              />
                            )}
                        </div>
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"organization"}
                          id={"organizationInput"}
                          data={objectEntity && objectEntity.organization && objectEntity.organization}
                          nameOverride={"Organization"}
                        />
                      </div>
                    </div>
                    <br/>
                    <div className="row">
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"owner"}
                          id={"ownerInput"}
                          data={objectEntity && objectEntity.owner && objectEntity.owner}
                          nameOverride={"Owner"}
                        />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent
                          type={"text"}
                          name={"entity"}
                          id={"entityInput"}
                          data={objectEntity && objectEntity.entity && objectEntity.entity}
                          nameOverride={"Entity"}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {
                            objectValues !== null && objectValues.length > 0 ? (
                              <>
                                {objectEntity !== null &&
                                objectEntity.objectValues !== undefined &&
                                objectEntity.objectValues !== null ? (
                                    <SelectInputComponent
                                      options={objectValues}
                                      data={objectEntity.objectValues.name}
                                      name={"objectValues"} id={"objectValuesInput"} nameOverride={"Object Values"}
                                      value={"/admin/values/"}/>
                                  )
                                  : (
                                    <SelectInputComponent
                                      options={objectValues}
                                      name={"objectValues"} id={"objectValuesInput"} nameOverride={"Object Values"}
                                      value={"/admin/values/"}/>
                                  )}
                              </>
                            ) : (
                              <SelectInputComponent
                                options={[{name: "Please create Object Values.", value: null}]}
                                name={"objectValues"} id={"objectValuesInput"} nameOverride={"Object Values"}
                              />
                            )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          {
                            objectValues !== null && objectValues.length > 0 ? (
                              <>
                                {objectEntity !== null &&
                                objectEntity.subresourceOf !== undefined &&
                                objectEntity.subresourceOf !== null ? (
                                    <SelectInputComponent
                                      options={objectValues}
                                      data={objectEntity.subresourceOf.name}
                                      name={"subresourceOf"} id={"subresourceOfInput"} nameOverride={"Subresource Of"}
                                      value={"/admin/values/"}/>
                                  )
                                  : (
                                    <SelectInputComponent
                                      options={objectValues}
                                      name={"subresourceOf"} id={"subresourceOfInput"} nameOverride={"Subresource Of"}
                                      value={"/admin/values/"}/>
                                  )}
                              </>
                            ) : (
                              <SelectInputComponent
                                options={[{name: "Please create Object Values.", value: null}]}
                                name={"subresourceOf"} id={"subresourceOfInput"} nameOverride={"Subresource Of"}
                              />
                            )}
                        </div>
                      </div>
                    </div>

                    <Accordion
                      id="objectEntityAccordion"
                      items={[
                        {
                          title: "Errors",
                          id: "errorsAccordion",
                          render: function () {
                            return (
                              <>
                                <ArrayInputComponent
                                  id={"errors"}
                                  label={"Errors"}
                                  data={objectEntity && objectEntity.errors ? objectEntity.errors : null}
                                />
                              </>
                            );
                          }
                        },
                        {
                          title: "Promises",
                          id: "promisesAccordion",
                          render: function () {
                            return (
                              <>
                                <ArrayInputComponent
                                  id={"promises"}
                                  label={"Promises"}
                                  data={objectEntity && objectEntity.promises ? objectEntity.promises : null}
                                />
                              </>
                            );
                          }
                        },
                        {
                          title: "External Result",
                          id: "externalResultAccordion",
                          render: function () {
                            return (
                              <>
                                <ArrayInputComponent
                                  id={"externalResult"}
                                  label={"External Result"}
                                  data={objectEntity && objectEntity.externalResult ? objectEntity.externalResult : null}
                                />
                              </>
                            );
                          },
                        }
                      ]}
                    />
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
