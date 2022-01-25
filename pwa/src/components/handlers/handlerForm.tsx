import * as React from "react";
import {Link, navigate} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  SelectInputComponent,
  Accordion,
  Spinner,
  Card,
  Alert,
} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import FlashMessage from 'react-flash-message';
import {MultiDimensionalArrayInput} from "../common/multiDimensionalArrayInput";
import ElementCreationNew from "../common/elementCreationNew";

export default function HandlerForm({id, endpointId}) {
  const [context, setContext] = React.useState(null);
  const [handler, setHandler] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const [translations, setTranslations] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      if (id !== "new") {
        getHandler();
      }
      getEntities();
      getTableNames();
    }
  }, [context]);

  const getHandler = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/handlers/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setHandler(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getEntities = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/entities`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setEntities(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getTableNames = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/table_names`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const convertedArray = data['results'].map((value, idx) => ({id: idx, name: value, value: value}));
        setShowSpinner(false);
        setTableNames(convertedArray)
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getTranslations = (query) => {
    fetch(`${context.adminUrl}/translations${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTranslations(data["hydra:member"])
      })
      .catch((error) => {
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });

    return translations;
  };

  const saveHandler = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let skeletonIn = retrieveFormArrayAsOArray(event.target, "skeletonIn");
    let skeletonOut = retrieveFormArrayAsOArray(event.target, "skeletonOut");
    let mappingIn = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut = retrieveFormArrayAsObject(event.target, "mappingOut");
    let conditions = retrieveFormArrayAsOArray(event.target, "conditions");

    let translationInQuery = `?translationTable=${event.target.translationIn.value}`;
    let translationOutQuery = `?translationTable=${event.target.translationOut.value}`;
    let translationIn = getTranslations(translationInQuery);
    let translationOut = getTranslations(translationOutQuery);

    let translationInArray = translationIn.map((item) => (`/admin/translations/${item.id}`));
    let translationOutArray = translationOut.map((item) => (`/admin/translations/${item.id}`));

    // get the inputs and check if set other set null
    let body: {} = {
      translationIn: translationInArray ? translationInArray : null,
      translationOut: translationOutArray ? translationOutArray  : null,
      name: event.target.name.value,
      description: event.target.description
        ? event.target.description.value : null,
      sequence: event.target.sequence.value
        ? parseInt(event.target.sequence.value)
        : null,
      endpoint: `/admin/endpoints/${endpointId}`,
      entity: event.target.entity.value
        ? event.target.entity.value : null,
      template: event.target.template.value
        ? event.target.template.value : null,
      templateType: event.target.templateType.value
        ? event.target.templateType.value : null,
      conditions,
      skeletonIn,
      skeletonOut,
      mappingIn,
      mappingOut,
    };
    
    // This removes empty values from the body
    body = removeEmptyObjectValues(body);
    if (!checkValues([body["name"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/handlers`;
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
        setHandler(data)
        method === 'POST' && navigate(`/endpoints/${endpointId}`)
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  return (<>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="handlerForm" onSubmit={saveHandler}>
        <Card title="Handler values"
              cardHeader={function () {
                return (<>
                  <Link className="utrecht-link" to={`/endpoints/${endpointId}`}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                      <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                    </button>
                  </Link>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
                    <i className="fas fa-save mr-2"/>Save
                  </button>
                </>)
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
                              <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                     data={handler && handler.name && handler.name}
                                                     nameOverride={"Name"} required/>
                            </div>
                            <div className="col-6">
                              <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                     data={handler && handler.description && handler.description}
                                                     nameOverride={"Description"}/>
                            </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-6">
                              <GenericInputComponent type={"number"} name={"sequence"} id={"sequenceInput"}
                                                     data={handler && handler.sequence && handler.sequence}
                                                     nameOverride={"Sequence"} required/>
                            </div>
                            <div className="col-6">
                              <GenericInputComponent type={"text"} name={"templateType"} id={"templateTypeInput"}
                                                     data={handler && handler.templateType && handler.templateType}
                                                     nameOverride={"Template Type"}/>
                            </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-6">
                              <GenericInputComponent type={"text"} name={"template"} id={"templateInput"}
                                                     data={handler && handler.template && handler.template}
                                                     nameOverride={"Template"}/>
                            </div>
                            <div className="col-6">
                              {
                                entities !== null && entities.length > 0 ? (
                                  <div className="form-group">
                                    {handler !== null &&
                                    handler.entity !== undefined &&
                                    handler.entity !== null ? (
                                        <SelectInputComponent
                                          options={entities}
                                          data={handler.entity}
                                          name={"entity"} id={"entityInput"} nameOverride={"Entity"}
                                          value={"/admin/entities/"}/>
                                      )
                                      : (
                                        <SelectInputComponent
                                          options={entities}
                                          name={"entity"} id={"entityInput"} nameOverride={"Entity"}
                                          value={"/admin/entities/"}/>
                                      )}
                                  </div>
                                ) : (
                                  <SelectInputComponent
                                    options={[]}
                                    name={"entity"} id={"entityInput"} nameOverride={"Entity"}
                                    value={"/admin/entities/"}/>
                                )
                              }
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {
                                tableNames !== null && tableNames.length > 0 ? (
                                  <div className="form-group">
                                    {handler !== null &&
                                    handler.translationIn !== undefined &&
                                    handler.translationIn !== null ? (
                                        <SelectInputComponent
                                          options={tableNames}
                                          data={handler.translationIn}
                                          name={"translationIn"} id={"translationInInput"} nameOverride={"Translation In"}
                                        />
                                      )
                                      : (
                                        <SelectInputComponent
                                          options={tableNames}
                                          name={"translationIn"} id={"translationInInput"}
                                          nameOverride={"Translation In"}
                                        />
                                      )}
                                  </div>
                                ) : (
                                  <SelectInputComponent
                                    options={[]}
                                    name={"translationIn"} id={"translationInInput"} nameOverride={"Translation In"}/>
                                )
                              }
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                {
                                  tableNames !== null && tableNames.length > 0 ? (
                                    <>
                                      {handler !== null &&
                                      handler.translationOut !== undefined &&
                                      handler.translationOut !== null ? (
                                          <SelectInputComponent
                                            options={tableNames}
                                            data={handler.translationOut}
                                            name={"translationOut"} id={"translationOutInput"}
                                            nameOverride={"Translation Out"}
                                          />
                                        )
                                        : (
                                          <SelectInputComponent
                                            options={tableNames}
                                            name={"translationOut"} id={"translationOutInput"}
                                            nameOverride={"Translation Out"}
                                          />
                                        )}
                                    </>
                                  ) : (
                                    <SelectInputComponent
                                      options={[]}
                                      name={"translationOut"} id={"translationOutInput"}
                                      nameOverride={"Translation Out"}
                                    />
                                  )
                                }
                              </div>
                            </div>
                          </div>

                          <Accordion id="handlerAccordion"
                                     items={[
                                       {
                                         title: "Conditions *",
                                         id: "conditionsAccordion",
                                         render: function () {
                                           return (
                                             <ElementCreationNew
                                               id="conditions"
                                               label="Conditions"
                                               data={handler?.conditions}
                                             />
                                           )
                                         }
                                       },
                                       {
                                         title: "Mapping In",
                                         id: "mappingInAccordion",
                                         render: function () {
                                           return (
                                             <MultiDimensionalArrayInput
                                               id={"mappingIn"}
                                               label={"Mapping In"}
                                               data={handler && handler.mappingIn ? [{
                                                 key: 'mappingIn',
                                                 value: handler.mappingIn
                                               }] : null}
                                             />
                                           )
                                         }
                                       },
                                       {
                                         title: "Mapping Out",
                                         id: "mappingOutAccordion",
                                         render: function () {
                                           return (
                                             <MultiDimensionalArrayInput
                                               id={"mappingOut"}
                                               label={"Mapping Out"}
                                               data={handler && handler.mappingOut ? [{
                                                 key: 'mappingOut',
                                                 value: `${handler.mappingOut}`
                                               }] : null}
                                             />
                                           )
                                         }
                                       },
                                       {
                                         title: "Skeleton In",
                                         id: "skeletonInAccordion",
                                         render: function () {
                                           return (
                                             <ElementCreationNew
                                               id="skeletonIn"
                                               label="Skeleton In"
                                               data={handler?.skeletonIn}
                                             />
                                           )
                                         }
                                       },
                                       {
                                         title: "Skeleton Out",
                                         id: "skeletonOutAccordion",
                                         render: function () {
                                           return (
                                             <ElementCreationNew
                                               id="skeletonOut"
                                               label="Skeleton Out"
                                               data={handler?.skeletonOut}
                                             />
                                           )
                                         }
                                       }
                                     ]}/>
                        </>
                      )}
                    </div>
                  </div>
                );
              }}
        />
      </form>
    </>
  );
}
