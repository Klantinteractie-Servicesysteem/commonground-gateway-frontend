import * as React from "react";
import {Link} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  SelectInputComponent,
  TextareaGroup,
  Accordion,
  Spinner,
  Card,
  Alert,
} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import FlashMessage from 'react-flash-message';
import {MultiDimensionalArrayInput} from "../common/multiDimensionalArrayInput";
import ElementCreationNew from "../common/elementCreationNew";
import {navigate} from "gatsby-link";
import LoadingOverlay from "../loadingOverlay/loadingOverlay";

export default function HandlerForm({id, endpointId}) {
  const [context, setContext] = React.useState(null);
  const [handler, setHandler] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState(null);
  const [tableNames, setTableNames] = React.useState<Array<any>>(null);
  const title: string = (id === "new") ? "Create Handler" : "Edit Handler";

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

  const saveHandler = (event) => {
    event.preventDefault();
    setLoadingOverlay(true);

    let skeletonIn: any[] = retrieveFormArrayAsOArray(event.target, "skeletonIn");
    let skeletonOut: any[] = retrieveFormArrayAsOArray(event.target, "skeletonOut");
    let mappingIn: {} = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut: {} = retrieveFormArrayAsObject(event.target, "mappingOut");
    let conditions: any[] = retrieveFormArrayAsOArray(event.target, "conditions");
    let translationsIn: any[] = retrieveFormArrayAsOArray(event.target, "translationsIn");
    let translationsOut: any[] = retrieveFormArrayAsOArray(event.target, "translationsOut");

    // get the inputs and check if set other set null
    let body: {} = {
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
      translationsIn,
      translationsOut
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);
    if (!checkValues([body["name"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setLoadingOverlay(false);
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
        setHandler(data)
        method === 'POST' && navigate(`/endpoints/${endpointId}`)
      })
      .catch((error) => {
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      })
      .finally(() => {
        setLoadingOverlay(false);
      })
  };

  return (
    <>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="handlerForm" onSubmit={saveHandler}>
        <Card
          title={title}
          cardHeader={function () {
            return (
              <>
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
                      {loadingOverlay && <LoadingOverlay /> }
                      <div className="row">
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"name"}
                            id={"nameInput"}
                            data={handler && handler.name && handler.name}
                            nameOverride={"Name"}
                            required
                          />
                        </div>
                        <div className="col-6">
                          <GenericInputComponent
                            type={"number"}
                            name={"sequence"}
                            id={"sequenceInput"}
                            data={handler && handler.sequence && handler.sequence}
                            nameOverride={"Sequence"}
                            required
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"template"}
                            id={"templateInput"}
                            data={handler && handler.template && handler.template}
                            nameOverride={"Template"}
                          />
                        </div>
                        <div className="col-6">
                          <GenericInputComponent
                            type={"text"}
                            name={"templateType"}
                            id={"templateTypeInput"}
                            data={handler && handler.templateType && handler.templateType}
                            nameOverride={"Template Type"}
                          />
                        </div>
                      </div>
                      <div className="row">
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
                        <div className="col-12">
                          <TextareaGroup
                            name={"description"}
                            id={"descriptionInput"}
                            defaultValue={handler?.description}
                          />
                        </div>
                      </div>
                      <Accordion
                        id="handlerAccordion"
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
                            title: "Translations In",
                            id: "translationsInAccordion",
                            render: function () {
                              return (
                                <ElementCreationNew
                                  id="translationsIn"
                                  label="Translations In"
                                  data={handler?.translationsIn}
                                  select
                                  selectName={"translationIn"}
                                  options={tableNames}
                                />
                              )
                            }
                          },
                          {
                            title: "Translations Out",
                            id: "translationsOutAccordion",
                            render: function () {
                              return (
                                <ElementCreationNew
                                  id="translationsOut"
                                  label="Translations Out"
                                  data={handler?.translationsOut}
                                  select
                                  selectName={"translationOut"}
                                  options={tableNames}
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
