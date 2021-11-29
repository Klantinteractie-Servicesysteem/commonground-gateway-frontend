import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { navigate } from "gatsby";
import { MultiDimensionalArrayInput } from "../utility/multiDimensionalArrayInput";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import Accordion from "../common/accordion";
import Card from "../common/card";
import {GenericInputComponent} from "../utility/genericInput";
import {CheckboxComponent} from "../utility/checkbox";
import {SelectInputComponent} from "../utility/selectInput";


export default function EntityForm({ id }) {
  const context = useUrlContext();
  const [entity, setEntity] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const getEntity = () => {
    fetch(`${context.apiUrl}/entities/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setEntity(data);
      });
  };

  const saveEntity = (event) => {
    event.preventDefault();

    // retrieve arrays
    let transformations = retrieveFormArrayAsObject(
      event.target,
      "transformations"
    );
    let translationConfig = retrieveFormArrayAsObject(
      event.target,
      "translationConfig"
    );
    let collectionConfig = retrieveFormArrayAsObject(
      event.target,
      "collectionConfig"
    );

    let usedProperties = retrieveFormArrayAsOArray(
      event.target,
      "usedProperties"
    );

    let body = {
      name: event.target.name.value,
      description: event.target.description.value,
      route: event.target.route.value,
      endpoint: event.target.entityEndpoint.value,
      gateway: event.target.gateway.value,
      extend: event.target.extend.checked,
    };

    // check arrays
    if (Object.keys(transformations).length != 0) {
      body["transformations"] = transformations;
    } else {
      body["transformations"] = [];
    }

    if (Object.keys(translationConfig).length != 0) {
      body["translationConfig"] = translationConfig;
    } else {
      body["translationConfig"] = [];
    }

    if (Object.keys(collectionConfig).length != 0) {
      body["collectionConfig"] = collectionConfig;
    } else {
      body["collectionConfig"] = [];
    }

    if (usedProperties.length != 0) {
      body["usedProperties"] = usedProperties;
    } else {
      body["usedProperties"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name])) {
      return;
    }

    setShowSpinner(true);

    let url = context.apiUrl + "/entities";
    let method = null;
    if (id === "new") {
      method = "POST";
    } else {
      url = `${url}/${id}`;
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
        setEntity(data);
        setShowSpinner(false);
        navigate(`/entities`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [sources, setSources] = React.useState(null);
  const getSources = () => {
    fetch(context.apiUrl + "/gateways", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"] !== null
        ) {
          setSources(data["hydra:member"]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  React.useEffect(() => {
    getSources();
    if (id !== "new") {
      getEntity();
    }
  }, []);

  return (
    <form id="dataForm" onSubmit={saveEntity}>
      <Card title="Values" back="/entities" save={true} onlySaveIf={sources}>
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <div className="text-center py-5">
                <div
                  class="spinner-border text-primary"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.name !== null ? (
                        <GenericInputComponent type={"text"} target={"name"} id={"nameInput"} data={entity.name}
                                               name={"Name"} required={"true"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"name"} id={"nameInput"}
                                               name={"Name *"} required={"true"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.description !== null ? (
                        <GenericInputComponent type={"text"} target={"description"} id={"descriptionInput"}
                                               data={entity.description} name={"Description"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"description"} id={"descriptionInput"} name={"Description"}/>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.endpoint !== null ? (
                          <GenericInputComponent type={"text"} target={"endpoint"} id={"endpointInput"}
                                                 data={entity.endpoint} name={"Endpoint"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"endpoint"} id={"endpointInput"}
                                               name={"Endpoint"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {entity !== null && entity.route !== null ? (
                          <GenericInputComponent type={"text"} target={"route"} id={"routeInput"}
                                                 data={entity.route} name={"Route"}/>
                      ) : (
                        <GenericInputComponent type={"text"} target={"route"} id={"routeInput"}
                                               name={"Route"}/>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      {
                        sources !== null && sources.length > 0 ? (
                          <>
                            {entity !== null &&
                            entity.gateway !== undefined &&
                            entity.gateway !== null ? (
                            <SelectInputComponent
                              options={sources}
                              data={entity.gateway}
                              name={"source"} id={"sourceInput"} nameOverride={"Source"}
                              value={"/admin/gateways/"}/>
                            )
                            : (
                              <SelectInputComponent
                                options={sources}
                                name={"source"} id={"sourceInput"} nameOverride={"Source"}
                                value={"/admin/gateways/"}/>
                              )}
                          </>
                        ):(
                            <SelectInputComponent
                              options={[{name: "Please create a Source before creating an Entity"}]}
                              name={"source"} id={"sourceInput"} nameOverride={"Source"}/>
                          )}
                      {/*<span className="utrecht-form-label">Source</span>*/}
                      {/*<select*/}
                      {/*  name="gateway"*/}
                      {/*  id="gatewayInput"*/}
                      {/*  class="utrecht-select utrecht-select--html-select"*/}
                      {/*>*/}
                      {/*  {sources !== null && sources.length > 0 ? (*/}
                      {/*    sources.map((row) => (*/}
                      {/*      <>*/}
                      {/*        {entity !== null &&*/}
                      {/*          entity.gateway !== undefined &&*/}
                      {/*          entity.gateway !== null &&*/}
                      {/*          entity.gateway.id == row.id ? (*/}
                      {/*          <option*/}
                      {/*            value={"/admin/gateways/" + row.id}*/}
                      {/*            selected*/}
                      {/*          >*/}
                      {/*            {row.name}*/}
                      {/*          </option>*/}
                      {/*        ) : (*/}
                      {/*          <option value={"/admin/gateways/" + row.id}>*/}
                      {/*            {row.name}*/}
                      {/*          </option>*/}
                      {/*        )}*/}
                      {/*      </>*/}
                      {/*    ))*/}
                      {/*  ) : (*/}
                      {/*    <option value="">*/}
                      {/*      Please create a Source before creating an Entity*/}
                      {/*    </option>*/}
                      {/*  )}*/}
                      {/*</select>*/}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div class="form-check">
                      {entity !== null ? (
                        <>
                          {entity.extend ? (
                              <CheckboxComponent type={"checkbox"} id={"extendInput"}
                                                 nameLabel={"Extend"} nameAttribute={"extend"}
                                                 data={entity.extend}/>
                          ) : (
                            <CheckboxComponent type={"checkbox"} id={"extendInput"}
                                               nameLabel={"Extend"} nameAttribute={"extend"}/>
                          )}
                        </>
                      ) : (
                        <CheckboxComponent type={"checkbox"} id={"extendInput"}
                                           nameLabel={"Extend"} nameAttribute={"extend"}/>
                      )}
                    </div>
                  </div>
                </div>
                <Accordion id="transformationsAccordion" title="Transformations">
                  {entity !== null ? (
                    <MultiDimensionalArrayInput
                      target={"transformations"}
                      data={entity.transformations}
                    />
                  ) : (
                    <MultiDimensionalArrayInput
                      target={"transformations"}
                    />
                  )}
                </Accordion>
                <Accordion id="translationConfigAccordion" title="Translation Config">
                  {entity !== null ? (
                    <MultiDimensionalArrayInput
                      target={"translationConfig"}
                      data={entity.translationConfig}
                      name={"Translation Config"}
                    />
                  ) : (
                    <MultiDimensionalArrayInput
                      target={"translationConfig"}
                      name={"Translation Config"}
                    />
                  )}
                </Accordion>
                <Accordion id="collectionConfigAccordion" title="Collection Config">
                  {entity !== null ? (
                    <MultiDimensionalArrayInput
                      target={"collectionConfig"}
                      data={entity.collectionConfig}
                      name={"Collection Config"}
                    />
                  ) : (
                    <MultiDimensionalArrayInput
                      target={"collectionConfig"}
                      name={"Collection Config"}
                    />
                  )}
                </Accordion>

              </>
            )}
          </div>
        </div>

      </Card>
    </form>
  );
}
