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
  Checkbox,
  SelectInputComponent,
  Accordion,
  MultiDimensionalArrayInput,
  Spinner,
  Card,
  Alert,
  ArrayInputComponent
} from "@conductionnl/nl-design-system/lib";
import {addElement, deleteElementFunction} from "../utility/elementCreation";
import {isLoggedIn} from "../../services/auth";
import FlashMessage from 'react-flash-message';

export default function HandlerForm({id, endpointId}) {
  const [context, setContext] = React.useState(null);
  const [handler, setHandler] = React.useState(null);
  const [handlers, setHandlers] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [endpoint, setEndpoint] = React.useState(null);
  const [entities, setEntities] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn() && id !== 'new') {
      getHandler();
      getHandlers();
      getEndpoint();
      getEntities();
    }
  }, [context]);

  const getHandler = () => {
    fetch(`${context.adminUrl}/handlers/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setHandler(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getHandlers = () => {
    fetch(`${context.adminUrl}/handlers`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setHandlers(data);
        }
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

    let translationIn = retrieveFormArrayAsOArray(event.target, "translationIn");
    let translationOut = retrieveFormArrayAsOArray(event.target, "translationOut");
    let mappingIn = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut = retrieveFormArrayAsObject(event.target, "mappingOut");

    // get the inputs and check if set other set null

    let body = {
      name: event.target.name.value,
      sequence: event.target.sequence.value
        ? parseInt(event.target.sequence.value)
        : null,
      endpoint: event.target.endpoint.value,
      entity: event.target.entity.value,
    };

    if (translationIn.length != 0) {
      body["translationIn"] = translationIn;
    } else {
      body["translationIn"] = [];
    }

    if (translationOut.length != 0) {
      body["translationOut"] = translationOut;
    } else {
      body["translationOut"] = [];
    }

    if (Object.keys(mappingIn).length != 0) {
      body["mappingIn"] = mappingIn;
    } else {
      body["mappingIn"] = [];
    }

    if (Object.keys(mappingOut).length != 0) {
      body["mappingOut"] = mappingOut;
    } else {
      body["mappingOut"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name])) {
      return;
    }

    let url = context.adminUrl + "/handlers";
    let method = null;
    console.log(url);
    if (id === "new") {
      method = "POST";
    } else {
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
        if (data.id !== undefined) {
          navigate(`/endpoints/${endpointId}`);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getEndpoint = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/endpoints/${endpointId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('endpoint')
        console.log(data);
        setShowSpinner(false);
        setEndpoint(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });

  }

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

  return (<>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <form id="attributeForm" onSubmit={saveHandler}>
        <Card title="Values"
              cardHeader={function () {
                return (<>
                  <Link className="utrecht-link" to={`/endpoints/${endpoint}`}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
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
                              {handler !== null && handler.name !== null ? (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={handler.name}
                                                       nameOverride={"Name"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                       nameOverride={"Name"}/>
                              )}
                            </div>
                            <div className="col-6">
                              {handler !== null && handler.sequence !== null ? (
                                <GenericInputComponent type={"number"} name={"sequence"} id={"sequenceInput"}
                                                       data={handler.sequence} nameOverride={"Sequence"}/>
                              ) : (
                                <GenericInputComponent type={"number"} name={"sequence"} id={"sequenceInput"}
                                                       nameOverride={"Sequence"}/>
                              )}
                            </div>
                          </div>
                          <br/>
                          <div className="row">
                            <div className="col-6">
                              {endpoint !== null && endpoint.name !== null ? (
                                <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                                       data={endpoint.name}
                                                       nameOverride={"Endpoint"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"endpoint"} id={"endpointInput"}
                                                       nameOverride={"Endpoint"}/>
                              )}
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                {
                                  entities !== null && entities.length > 0 ? (
                                    <>
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
                                    </>
                                  ) :(
                                  <GenericInputComponent type={"text"} name={"entity"} id={"entityInput"}
                                  nameOverride={"Entity"}/>
                                  )
                                }
                              </div>
                            </div>
                          </div>
                          <Accordion id="handlerAccordion"
                                     items={[
                                       {
                                         title: "Translation In",
                                         id: "translationInAccordion",
                                         render: function () {
                                           return (<>
                                             {handler !== null && handler.translationIn !== null ? (
                                               <ArrayInputComponent
                                                 id={"translationIn"}
                                                 label={"Translation In"}
                                                 data={[{key: 'translationIn', value: handler.translationIn}]}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             ) : (
                                               <ArrayInputComponent
                                                 id={"translationIn"}
                                                 label={"Translation In"}
                                                 data={null}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             )}
                                           </>)
                                         }
                                       },
                                       {
                                         title: "TranslationOut",
                                         id: "translationOutAccordion",
                                         render: function () {
                                           return (<>
                                             {handler !== null && handler.translationOut !== null ? (
                                               <ArrayInputComponent
                                                 id={"translationOut"}
                                                 label={"Translation Out"}
                                                 data={[{key: 'translationOut', value: handler.translationOut}]}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             ) : (
                                               <ArrayInputComponent
                                                 id={"translationOut"}
                                                 label={"Translation Out"}
                                                 data={null}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             )}
                                           </>)
                                         }
                                       },
                                       {
                                         title: "Mapping In",
                                         id: "mappingInAccordion",
                                         render: function () {
                                           return (<>
                                             {handler !== null && handler.mappingIn !== null ? (
                                               <MultiDimensionalArrayInput
                                                 id={"mappingIn"}
                                                 label={"Mapping In"}
                                                 data={[{key: 'mappingIn', value: handler.mappingIn}]}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             ) : (
                                               <MultiDimensionalArrayInput
                                                 id={"mappingIn"}
                                                 label={"Mapping In"}
                                                 data={null}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             )}
                                           </>)
                                         }
                                       },
                                       {
                                         title: "Mapping Out",
                                         id: "mappingOutAccordion",
                                         render: function () {
                                           return (<>
                                             {handler !== null && handler.mappingOut !== null ? (
                                               <MultiDimensionalArrayInput
                                                 id={"mappingOut"}
                                                 label={"Mapping Out"}
                                                 data={[{key: 'mappingOut', value: `${handler.mappingOut}`}]}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             ) : (
                                               <MultiDimensionalArrayInput
                                                 id={"mappingOut"}
                                                 label={"Mapping Out"}
                                                 data={null}
                                                 deleteFunction={deleteElementFunction}
                                                 addFunction={addElement}
                                               />
                                             )}
                                           </>)
                                         }
                                       }
                                     ]}/>
                          <br/>
                        </>
                      )}
                    </div>
                  </div>

                )
              }}/>
      </form>
    </>
  );
}
