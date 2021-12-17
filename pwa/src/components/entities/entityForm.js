import * as React from "react";
import { GenericInputComponent } from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import { Checkbox } from "@conductionnl/nl-design-system/lib/Checkbox/src/checkbox";
import { SelectInputComponent } from "@conductionnl/nl-design-system/lib/SelectInput/src/selectInput";
import { Accordion } from "@conductionnl/nl-design-system/lib/Accordion/src/accordion";
import { MultiDimensionalArrayInput }
  from "@conductionnl/nl-design-system/lib/MultiDimenionalArrayInput/src/multiDimensionalArrayInput";
import { ArrayInput }
  from "@conductionnl/nl-design-system/lib/ArrayInput/src/ArrayInput";
import { isLoggedIn } from "../../services/auth";
import { navigate } from "gatsby-link";
import { Link } from "gatsby";
import Spinner from "../common/spinner";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { addElement, deleteElementFunction } from "../utility/elementCreation";

export default function EntityForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const [entity, setEntity] = React.useState(null);
  const [sources, setSources] = React.useState(null);
  const [soaps, setSoaps] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== 'new') {
        getEntity();
      }
      getSources();
      getSoaps();
    }
  }, [context]);

  const getEntity = () => {
    fetch(`${context.adminUrl}/entities/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setEntity(data);
      });
  };

  const getSources = () => {
    fetch(`${context.adminUrl}/gateways`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setSources(data["hydra:member"]);
      });
  };

  const getSoaps = () => {
    fetch(`${context.adminUrl}/soaps`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["hydra:member"] !== undefined) {
          setSoaps(data["hydra:member"]);
        }
      });
  }

  const saveEntity = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    // retrieve arrays
    // let transformations = retrieveFormArrayAsObject(
    //   event.target,
    //   "transformations"
    // );
    // let translationConfig = retrieveFormArrayAsObject(
    //   event.target,
    //   "translationConfig"
    // );
    // let collectionConfig = retrieveFormArrayAsObject(
    //   event.target,
    //   "collectionConfig"
    // );

    // let usedProperties = retrieveFormArrayAsOArray(
    //   event.target,
    //   "usedProperties"
    // );

    let body = {
      name: event.target.name ? event.target.name.value : null,
      description: event.target.description ? event.target.description.value : null,
      route: event.target.route ? event.target.route.value : null,
      endpoint: event.target.endpoint ? event.target.endpoint.value : null,
      gateway: event.target.gateway ? event.target.gateway.value : null,
      extend: event.target.extend.checked ? true : false,
      function: event.target.function ? event.target.function.value : null,
    };

    // check arrays
    // if (Object.keys(transformations).length != 0) {
    //   body["transformations"] = transformations;
    // } else {
    //   body["transformations"] = [];
    // }

    // if (Object.keys(translationConfig).length != 0) {
    //   body["translationConfig"] = translationConfig;
    // } else {
    //   body["translationConfig"] = [];
    // }

    // if (Object.keys(collectionConfig).length != 0) {
    //   body["collectionConfig"] = collectionConfig;
    // } else {
    //   body["collectionConfig"] = [];
    // }

    // if (usedProperties.length != 0) {
    //   body["usedProperties"] = usedProperties;
    // } else {
    //   body["usedProperties"] = [];
    // }

    // This removes empty values from the body
    // body = removeEmptyObjectValues(body);

    // if (!checkValues([body.name])) {
    //   return;
    // }

    let url = context.adminUrl + "/entities";
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
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
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
  }

  return (
    <form id="dataForm" onSubmit={saveEntity}>
      <Card title="Values"
        cardHeader={function () {
          return (<>
            <Link className="utrecht-link" to={"/entities"}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2" />Back
              </button>
            </Link>
            <button
              className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
              type="submit"
            >
              <i className="fas fa-save mr-2" />Save
            </button>
          </>)
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
                          {entity !== null && entity.name !== null ? (
                            <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={entity.name}
                              nameOverride={"Name"} required={"true"} />
                          ) : (
                            <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                              nameOverride={"Name"} required={"true"} />
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          {entity !== null && entity.description !== null ? (
                            <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                              data={entity.description} nameOverride={"Description"} />
                          ) : (
                            <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                              nameOverride={"Description"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <SelectInputComponent
                            options={[{ name: 'Organization', value: 'organization' }, { name: 'User', value: 'user' }, { name: 'User group', value: 'userGroup' }]}
                            data={entity && entity.function ? entity.function : null}
                            name={"function"}
                            id={"functionInput"}
                            nameOverride={"Function"}
                            required={true} />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {entity !== null && entity.endpoint !== null ? (
                            <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                              data={entity.endpoint} nameOverride={"Endpoint"} />
                          ) : (
                            <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                              nameOverride={"Endpoint"} />
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          {entity !== null && entity.route !== null ? (
                            <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                              data={entity.route} nameOverride={"Route"} />
                          ) : (
                            <GenericInputComponent type={"text"} name={"route"} id={"routeInput"}
                              nameOverride={"Route"} />
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
                                    value={"/admin/gateways/"} />
                                )
                                  : (
                                    <SelectInputComponent
                                      options={sources}
                                      name={"source"} id={"sourceInput"} nameOverride={"Source"}
                                      value={"/admin/gateways/"} />
                                  )}
                              </>
                            ) : (
                              <SelectInputComponent
                                options={[{ name: "Please create a Source before creating an Entity" }]}
                                name={"source"} id={"sourceInput"} nameOverride={"Source"} />
                            )}
                        </div>
                      </div>
                    </div>
                    {
                      soaps && soaps.length > 0 &&
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            {entity !== null &&
                              entity.toSoap !== undefined &&
                              entity.toSoap !== null ? (
                              <SelectInputComponent
                                options={soaps}
                                data={entity.gateway}
                                name={"toSoap"} id={"toSoapInput"} nameOverride={"toSoap"}
                                value={"/admin/soaps/"} />
                            )
                              : (
                                <SelectInputComponent
                                  options={soaps}
                                  name={"toSoap"} id={"toSoapInput"} nameOverride={"toSoap"}
                                  value={"/admin/soaps/"} />
                              )}
                          </div>
                        </div>
                      </div>
                    }
                    {/* FromSoap TODO */}
                    {/* <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <ArrayInput />
                        </div>
                      </div>
                    </div> */}
                    <div className="row">
                      <div className="col-12">
                        <div className="form-check">
                          {entity !== null ? (
                            <>
                              {entity.extend ? (
                                <Checkbox type={"checkbox"} id={"extendInput"}
                                  nameLabel={"Extend"} nameAttribute={"extend"}
                                  data={entity.extend} />
                              ) : (
                                <Checkbox type={"checkbox"} id={"extendInput"}
                                  nameLabel={"Extend"} nameAttribute={"extend"} />
                              )}
                            </>
                          ) : (
                            <Checkbox type={"checkbox"} id={"extendInput"}
                              nameLabel={"Extend"} nameAttribute={"extend"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <Accordion
                      id="entityAccordion"
                      items={[
                        {
                          title: "Transformations",
                          id: "transformationsAccordion",
                          render: function () {
                            return (
                              <>
                                {entity !== null ? (
                                  <MultiDimensionalArrayInput
                                    id={"transformations"}
                                    label={"Transformations"}
                                    data={entity.transformations}
                                    deleteFunction={deleteElementFunction}
                                    addFunction={addElement}
                                  />
                                ) : (
                                  <MultiDimensionalArrayInput
                                    id={"transformations"}
                                    label={"Transformations"}
                                    data={null}
                                    deleteFunction={deleteElementFunction}
                                    addFunction={addElement}
                                  />
                                )}
                              </>
                            );
                          },
                        },
                        {
                          title: "Translation Config",
                          id: "translationConfigAccordion",
                          render: function () {
                            return (
                              <>
                                {entity !== null ? (
                                  <MultiDimensionalArrayInput
                                    id={"translationConfig"}
                                    label={"Translation Config"}
                                    data={entity.translationConfig}
                                    deleteFunction={deleteElementFunction}
                                    addFunction={addElement}
                                  />
                                ) : (
                                  <MultiDimensionalArrayInput
                                    id={"translationConfig"}
                                    label={"Translation Config"}
                                    data={null}
                                    deleteFunction={deleteElementFunction}
                                    addFunction={addElement}
                                  />
                                )}
                              </>
                            );
                          },
                        },
                        {
                          title: "Collection Config",
                          id: "collectionConfigAccordion",
                          render: function () {
                            return (
                              <>
                                {entity !== null ? (
                                  <MultiDimensionalArrayInput
                                    id={"collectionConfig"}
                                    data={entity.collectionConfig}
                                    label={"Collection Config"}
                                    deleteFunction={deleteElementFunction}
                                    addFunction={addElement}
                                  />
                                ) : (
                                  <MultiDimensionalArrayInput
                                    id={"collectionConfig"}
                                    label={"Collection Config"}
                                    deleteFunction={deleteElementFunction}
                                    addFunction={addElement}
                                    data={null}
                                  />
                                )}
                              </>
                            );
                          },
                        },
                      ]}
                    />
                  </>
                )}
              </div>
            </div>
          )
        }} />
    </form>
  );
}
