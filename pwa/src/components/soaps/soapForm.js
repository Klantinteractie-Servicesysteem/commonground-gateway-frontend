import * as React from "react";
import {Link} from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsOArray,
} from "../utility/inputHandler";
import {
  GenericInputComponent,
  Accordion,
  Card,
  Alert,
  Spinner,
  SelectInputComponent
} from "@conductionnl/nl-design-system/lib";
import {ArrayInputComponent} from "../common/arrayInput";
import FlashMessage from 'react-flash-message';
import {isLoggedIn} from "../../services/auth";

export default function SoapsForm({id}) {
  const [context, setContext] = React.useState(null);
  const [soap, setSoap] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn) {
      if (id !== 'new') {
        getSoaps();
      }
      getEntities();
    }
  }, [context]);

  const getSoaps = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/soaps/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("get soaps")
        console.log(data)
        setShowSpinner(false);
        setSoap(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const getEntities = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/entities`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
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
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const saveSoap = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let requestSkeleton = retrieveFormArrayAsOArray(event.target, "requestSkeleton");
    let requestHydration = retrieveFormArrayAsOArray(event.target, "requestHydration");
    let responseSkeleton = retrieveFormArrayAsOArray(event.target, "responseSkeleton");
    let responseHydration = retrieveFormArrayAsOArray(event.target, "responseHydration");

    let body = {
      name: event.target.name.value,
      description: event.target.description
        ? event.target.description.value
        : null,
      type: event.target.type.value,
      zaaktype: event.target.zaaktype.value,
      toEntity: event.target.toEntity.value,
      fromEntity: event.target.fromEntity.value,
      requestHydration,
      responseSkeleton,
      responseHydration,
      requestSkeleton,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.type, ])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/soaps`
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
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setShowSpinner(false);
        setSoap(data)
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
      <form id="dataForm" onSubmit={saveSoap}>
        <Card title={"Soaps"}
              cardHeader={function () {
                return (<>
                    <Link className="utrecht-link" to={"/soaps"}>
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
                          <div className="row mb-3">
                            <div className="col-6">
                              {soap !== null && soap.name !== null ? (
                                <GenericInputComponent
                                  type={"text"}
                                  name={"name"}
                                  id={"nameInput"}
                                  data={soap.name}
                                  nameOverride={"Name"}
                                  required={"true"}
                                />
                              ) : (
                                <GenericInputComponent
                                  type={"text"}
                                  name={"name"}
                                  id={"nameInput"}
                                  nameOverride={"Name"}
                                  required={"true"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {soap !== null && soap.description !== null ? (
                                <GenericInputComponent
                                  name={"description"}
                                  data={soap.description}
                                  type={"text"}
                                  id={"descriptionInput"}
                                />
                              ) : (
                                <GenericInputComponent
                                  name={"description"}
                                  type={"text"}
                                  id={"descriptionInput"}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-6">
                              {soap !== null && soap.type !== null ? (
                                <GenericInputComponent
                                  type={"text"}
                                  name={"type"}
                                  id={"typeInput"}
                                  data={soap.type}
                                  required={"true"}
                                />
                              ) : (
                                <GenericInputComponent
                                  type={"text"}
                                  name={"type"}
                                  id={"typeInput"}
                                  required={"true"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {soap !== null && soap.zaaktype !== null ? (
                                <GenericInputComponent
                                  name={"zaaktype"}
                                  data={soap.zaaktype}
                                  type={"text"}
                                  id={"zaaktypeInput"}
                                />
                              ) : (
                                <GenericInputComponent
                                  name={"zaaktype"}
                                  type={"text"}
                                  id={"zaaktypeInput"}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <div className="form-group">
                                {
                                  entities !== null && entities.length > 0 ? (
                                    <>
                                      {soap !== null &&
                                      soap.toEntity !== undefined &&
                                      soap.toEntity !== null ? (
                                          <SelectInputComponent
                                           options={entities}
                                            data={soap.toEntity.name}
                                            name={"toEntity"} id={"toEntityInput"} nameOverride={"To Entity"}
                                            value={"/admin/entities/"}/>
                                        )
                                        : (
                                          <SelectInputComponent
                                            options={entities}
                                            name={"toEntity"} id={"toEntityInput"} nameOverride={"To Entity"}
                                            value={"/admin/entities/"}/>
                                        )}
                                    </>
                                  ) : (
                                    <SelectInputComponent
                                      options={[{name: "Please create a entity first to use it", value: null}]}
                                      name={"toEntity"} id={"toEntityInput"} nameOverride={"To Entity"}
                                    />
                                  )}
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-group">
                                {
                                  entities !== null && entities.length > 0 ? (
                                    <>
                                      {soap !== null &&
                                      soap.fromEntity !== undefined &&
                                      soap.fromEntity !== null ? (
                                          <SelectInputComponent
                                           options={entities}
                                            data={soap.fromEntity.name}
                                            name={"fromEntity"} id={"fromEntityInput"} nameOverride={"From Entity"}
                                            value={"/admin/entities/"} />
                                        )
                                        : (
                                          <SelectInputComponent
                                           options={entities}
                                            name={"fromEntity"} id={"fromEntityInput"} nameOverride={"From Entity"}
                                            value={"/admin/entities/"} />
                                        )}
                                    </>
                                  ) : (
                                    <SelectInputComponent
                                      options={[{ name: "Please create a entity first to use it", value: null}]}
                                      name={"fromEntity"} id={"fromEntityInput"} nameOverride={"From Entity"}
                                    />
                                  )}
                              </div>
                            </div>
                          </div>
                          <Accordion id="soapAccordion"
                                     items={[{
                                       title: "RequestSkeleton",
                                       id: "requestSkeletonAccordion",
                                       render: function () {
                                         return (<>
                                           {soap !== null && soap.requestSkeleton !== null ? (
                                             <ArrayInputComponent
                                               id={"requestSkeleton"}
                                               label={"RequestSkeleton"}
                                               data={soap.requestSkeleton}
                                             />
                                           ) : (
                                             <ArrayInputComponent
                                               id={"requestSkeleton"}
                                               label={"RequestSkeleton"}
                                               data={null}
                                             />
                                           )}
                                         </>)
                                       }
                                     },
                                       {
                                         title: "RequestHydration",
                                         id: "requestHydrationAccordion",
                                         render: function () {
                                           return (<>
                                             {soap !== null && soap.requestHydration !== null ? (
                                               <ArrayInputComponent
                                                 id={"requestHydration"}
                                                 label={"RequestHydration"}
                                                 data={soap.requestHydration}
                                               />
                                             ) : (
                                               <ArrayInputComponent
                                                 id={"requestHydration"}
                                                 label={"RequestHydration"}
                                                 data={null}
                                               />
                                             )}
                                           </>)
                                         }
                                       },
                                       {
                                         title: "ResponseSkeleton",
                                         id: "responseSkeletonAccordion",
                                         render: function () {
                                           return (<>
                                             {soap !== null && soap.responseSkeleton !== null ? (
                                               <ArrayInputComponent
                                                 id={"responseSkeleton"}
                                                 label={"ResponseSkeleton"}
                                                 data={soap.responseSkeleton}
                                               />
                                             ) : (
                                               <ArrayInputComponent
                                                 id={"responseSkeleton"}
                                                 label={"ResponseSkeleton"}
                                                 data={null}
                                               />
                                             )}
                                           </>)
                                         }
                                       },
                                       {
                                         title: "ResponseHydration",
                                         id: "responseHydrationAccordion",
                                         render: function () {
                                           return (<>
                                             {soap !== null && soap.responseHydration !== null ? (
                                               <ArrayInputComponent
                                                 id={"responseHydration"}
                                                 label={"ResponseHydration"}
                                                 data={soap.responseHydration}
                                               />
                                             ) : (
                                               <ArrayInputComponent
                                                 id={"responseHydration"}
                                                 label={"ResponseHydration"}
                                                 data={null}
                                               />
                                             )}
                                           </>)
                                         }
                                       }]}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )
              }}
        />
      </form>
    </>
  );
}
