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
import { ArrayInputComponent } from "../common/arrayInput";
import { MultiDimensionalArrayInput } from "../common/multiDimensionalArrayInput";


export default function HandlerForm({id, endpointId}) {
  const [context, setContext] = React.useState(null);
  const [handler, setHandler] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState(null);
  let title;

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
    }
  }, [context]);

  const getHandler = () => {
    fetch(`${context.adminUrl}/handlers/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
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


  const saveHandler = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let translationIn = retrieveFormArrayAsOArray(event.target, "translationIn");
    let translationOut = retrieveFormArrayAsOArray(event.target, "translationOut");
    let skeletonIn = retrieveFormArrayAsOArray(event.target, "skeletonIn");
    let skeletonOut = retrieveFormArrayAsOArray(event.target, "skeletonOut");
    let mappingIn = retrieveFormArrayAsObject(event.target, "mappingIn");
    let mappingOut = retrieveFormArrayAsObject(event.target, "mappingOut");
    let conditions = retrieveFormArrayAsOArray(event.target, "conditions");

    // get the inputs and check if set other set null
    let body: {} = {
      name: event.target.name.value,
      description: event.target.description ? event.target.description.value : null,
      sequence: event.target.sequence.value
        ? parseInt(event.target.sequence.value)
        : null,
      endpoint: `/admin/endpoints/${endpointId}`,
      entity: event.target.entity.value ? event.target.entity.value : null,
      template: event.target.template.value ? event.target.template.value : null,
      templateType: event.target.templateType.value ? event.target.templateType.value : null,
    };

    if (conditions.length !== 0) {
      body["conditions"] = conditions;
    } else {
      body["conditions"] = [];
    }

    if (skeletonIn.length !== 0) {
      body["skeletonIn"] = skeletonIn;
    } else {
      body["skeletonIn"] = [];
    }

    if (skeletonOut.length !== 0) {
      body["skeletonOut"] = skeletonOut;
    } else {
      body["skeletonOut"] = [];
    }

    if (translationIn.length !== 0) {
      body["translationIn"] = translationIn;
    } else {
      body["translationIn"] = [];
    }

    if (translationOut.length !== 0) {
      body["translationOut"] = translationOut;
    } else {
      body["translationOut"] = [];
    }

    if (Object.keys(mappingIn).length !== 0) {
      body["mappingIn"] = mappingIn;
    } else {
      body["mappingIn"] = [];
    }

    if (Object.keys(mappingOut).length !== 0) {
      body["mappingOut"] = mappingOut;
    } else {
      body["mappingOut"] = [];
    }

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);
    console.log(body, "eerste")

    // if (!checkValues([body.name, body.sequence])) {
    //   setAlert(null);
    //   setAlert({ type: 'danger', message: 'Required fields are empty' });
    //   setShowSpinner(false);
    //   return;
    // }
    console.log(body, "tweede")

    let url = `${context.adminUrl}/handlers`;
    let method = "POST";
    if (id !== "new") {
      url = `${url}/${id}`;
      method = "PUT";
    }

    console.log(body)
    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("post handler")
        console.log(data)
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
  if(id !== "new"){
    title = "Edit Handler";
  }else{
    title = "Create Handler";
  }

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
        <Card title = {title}
              cardHeader={function () {
                return (<>
                  <Link className="utrecht-link" to={`/endpoints/${endpointId}`}>
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
                              <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={handler && handler.name && handler.name}
                                                     nameOverride={"Name"}/>
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
                                                     data={handler && handler.sequence && handler.sequence} nameOverride={"Sequence"}/>
                          </div>
                          <div className="col-6">
                              <GenericInputComponent type={"text"} name={"templateType"} id={"templateTypeInput"}
                                                     data={handler && handler.templateType && handler.templateType} nameOverride={"Template Type"}/>
                          </div>
                        </div>
                        <br/>
                        <div className="row">
                          <div className="col-6">
                              <GenericInputComponent type={"text"} name={"template"} id={"templateInput"}
                                                     data={handler && handler.template && handler.template} nameOverride={"Template"}/>
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
                                ) : (
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
                                       title: "Conditions",
                                       id: "conditionsAccordion",
                                       render: function () {
                                         return (
                                             <ArrayInputComponent
                                               id={"conditions"}
                                               label={"Conditions"}
                                               data={handler && handler.conditions ? [{key: 'conditions', value: handler.conditions}] : null}
                                             />
                                          )
                                       }
                                     },
                                     {
                                       title: "Translation In",
                                       id: "translationInAccordion",
                                       render: function () {
                                         return (
                                             <ArrayInputComponent
                                               id={"translationIn"}
                                               label={"Translation In"}
                                               data={handler && handler.translationIn ? [{key: 'translationIn', value: handler.translationIn}] : null}
                                             />
                                        )
                                       }
                                     },
                                     {
                                       title: "TranslationOut",
                                       id: "translationOutAccordion",
                                       render: function () {
                                         return (
                                             <ArrayInputComponent
                                               id={"translationOut"}
                                               label={"Translation Out"}
                                               data={handler && handler.translationOut ? [{key: 'translationOut', value: handler.translationOut}] : null}
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
                                               data={handler && handler.mappingIn ? [{key: 'mappingIn', value: handler.mappingIn}] : null}
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
                                               data={handler && handler.mappingOut ? [{key: 'mappingOut', value: `${handler.mappingOut}`}] : null}
                                             />
                                           )
                                       }
                                     },
                                     {
                                       title: "Skeleton In",
                                       id: "skeletonInAccordion",
                                       render: function () {
                                         return (
                                             <ArrayInputComponent
                                               id={"skeletonIn"}
                                               label={"Skeleton In"}
                                               data={handler && handler.skeletonIn ? [{key: 'skeletonIn', value: handler.skeletonIn}] : null}
                                             />
                                         )
                                       }
                                     },
                                     {
                                       title: "Skeleton Out",
                                       id: "skeletonOutAccordion",
                                       render: function () {
                                         return (
                                             <ArrayInputComponent
                                               id={"skeletonOut"}
                                               label={"Skeleton Out"}
                                               data={handler && handler.skeletonOut ? [{key: 'skeletonOut', value: handler.skeletonOut}] : null}
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
