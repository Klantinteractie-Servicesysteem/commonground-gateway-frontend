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
import {isLoggedIn} from "../../services/auth";
import FlashMessage from 'react-flash-message';
import ElementCreationNew from "../common/elementCreationNew"

export default function SourceForm({id}) {
  const [context, setContext] = React.useState(null);
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn && id !== 'new') {
      getSource();
    }
  }, [context]);

  const getSource = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/gateways/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("get source")
        console.log(data)
        setShowSpinner(false);
        setSource(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const saveSource = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let headers = retrieveFormArrayAsOArray(event.target, "headers");
    let oas = retrieveFormArrayAsOArray(event.target, "oas");
    let paths = retrieveFormArrayAsOArray(event.target, "paths");
    let translationConfig = retrieveFormArrayAsOArray(event.target, "translationConfig");

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description
        ? event.target.description.value
        : null,
      type: event.target.type.value,
      auth: event.target.auth.value,
      locale: event.target.locale.value,
      location: event.target.location.value,
      accept: event.target.accept.value,
      jwt: event.target.jwt.value,
      jwtId: event.target.jwtId.value,
      secret: event.target.secret.value,
      username: event.target.username.value,
      password: event.target.password.value,
      apikey: event.target.apikey.value,
      documentation: event.target.documentation.value,
      authorizationHeader: event.target.authorizationHeader.value,
      headers,
      oas,
      paths,
      translationConfig
    };


    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["location"], body["type"], body["auth"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/gateways`;
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
        console.log(data)
        setShowSpinner(false);
        setSource(data)
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
      <form id="dataForm" onSubmit={saveSource}>
        <Card title={"Source"}
              cardHeader={function () {
                return (<>
                    <Link className="utrecht-link" to={"/sources"}>
                      <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
                        <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                      </button>
                    </Link>
                    <button
                      className="utrecht-button utrecht`ht-button-sm btn-sm btn-success"
                      type="submit"
                    >
                      <i className="fas fa-save mr-2"/>Save
                    </button>
                  </>
                )
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
                              {source !== null && source.name !== null ? (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={source.name}
                                                       nameOverride={"Name"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                       nameOverride={"Name"}/>
                              )}
                            </div>
                            <div className="col-6">
                              {source !== null && source.location !== null ? (
                                <GenericInputComponent type={"text"} name={"location"} id={"locationInput"}
                                                       data={source.location}
                                                       nameOverride={"Location (url)"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"location"} id={"locationInput"}
                                                       nameOverride={"Location (url)"}/>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {source !== null && source.type !== null ? (
                                  <SelectInputComponent
                                    options={[{name: "json", value: "json"}, {name: "xml", value: "xml"}, {
                                      name: "soaps",
                                      value: "soaps"
                                    }, {name: "ftp", value: "ftp"}, {name: "sftp", value: "sftp"}]}
                                    name={"type"} id={"typeInput"} nameOverride={"Type"} data={source.type}
                                    required={true}/>
                                ) :
                                (
                                  <SelectInputComponent
                                    options={[{name: "json", value: "json"}, {name: "xml", value: "xml"}, {
                                      name: "soaps",
                                      value: "soaps"
                                    }, {name: "ftp", value: "ftp"}, {name: "sftp", value: "sftp"}]}
                                    name={"type"} id={"typeInput"} nameOverride={"Type"} required={true}/>
                                )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {source !== null && source.accept !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Accept (accept header used for this source)"}
                                                       name={"accept"}
                                                       id={"acceptInput"}
                                                       data={source.accept}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Accept (accept header used for this source)"}
                                                       name={"accept"}
                                                       id={"acceptInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {source !== null && source.locale !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Locale"} name={"locale"}
                                                       id={"localeInput"}
                                                       data={source.locale}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Locale"} name={"locale"}
                                                       id={"localeInput"}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              {source !== null && source.auth !== null ? (
                                  <SelectInputComponent
                                    options={[{name: "apikey", value: "apikey"}, {
                                      name: "jwt",
                                      value: "jwt"
                                    }, {name: "username-password", value: "username-password"}]}
                                    name={"auth"} id={"authInput"} nameOverride={"Auth"} required={true}
                                    data={source.auth}
                                  />
                                ) :
                                (
                                  <SelectInputComponent
                                    options={[{name: "apikey", value: "apikey"}, {
                                      name: "jwt",
                                      value: "jwt"
                                    }, {name: "username-password", value: "username-password"}]}
                                    name={"auth"} id={"authInput"} nameOverride={"Auth"} required={true}/>
                                )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {source !== null && source.jwt !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Jwt"} name={"jwt"}
                                                       id={"jwtInput"}
                                                       data={source.jwt}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Jwt"} name={"jwt"}
                                                       id={"jwtInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {source !== null && source.jwtId !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"JwtId"} name={"jwtId"}
                                                       id={"jwtIdInput"}
                                                       data={source.jwtId}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"JwtId"} name={"jwtId"}
                                                       id={"jwtIdInput"}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {source !== null && source.secret !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Secret"} name={"secret"}
                                                       id={"secretInput"}
                                                       data={source.secret}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Secret"} name={"secret"}
                                                       id={"secretInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {source !== null && source.apikey !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Apikey"} name={"apikey"}
                                                       id={"apikeyInput"}
                                                       data={source.apikey}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Apikey"} name={"apikey"}
                                                       id={"apikeyInput"}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {source !== null && source.documentation !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Documentation"} name={"documentation"}
                                                       id={"documentationInput"}
                                                       data={source.documentation}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Documentation"} name={"documentation"}
                                                       id={"documentationInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {source !== null && source.authorizationHeader !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"AuthorizationHeader"} name={"authorizationHeader"}
                                                       id={"authorizationHeaderInput"}
                                                       data={source.authorizationHeader}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"AuthorizationHeader"} name={"authorizationHeader"}
                                                       id={"authorizationHeaderInput"}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {source !== null && source.username !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Username"} name={"username"}
                                                       id={"usernameInput"}
                                                       data={source.username}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Username"} name={"username"}
                                                       id={"usernameInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {source !== null && source.password !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Password"} name={"password"}
                                                       id={"passwordInput"}
                                                       data={source.password}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Password"} name={"password"}
                                                       id={"passwordInput"}
                                />
                              )}
                            </div>
                          </div>
                          <Accordion
                            id="sourceAccordion"
                            items={[{
                              title: "Headers",
                              id: "headersAccordion",
                              render: function () {
                                return <ElementCreationNew id="headers" label="Headers" data={source?.headers}
                                />
                              }
                            },
                              {
                                title: "OAS",
                                id: "oasAccordion",
                                render: function () {
                                  return <ElementCreationNew id="oas" label="OAS" data={source?.oas}/>
                                }
                              },
                              {
                                title: "Paths",
                                id: "pathsAccordion",
                                render: function () {
                                  return <ElementCreationNew id="paths" label="Paths" data={source?.paths}/>
                                }
                              },
                              {
                                title: "Translation config",
                                id: "translationConfigAccordion",
                                render: function () {
                                  return <ElementCreationNew id="translationConfig" label="Translation Config"
                                                             data={source?.translationConfig}/>
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
