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
import FlashMessage from 'react-flash-message';
import ElementCreationNew from "../common/elementCreationNew"
import APIService from "../../apiService/apiService";
import { navigate } from "gatsby-link";

export default function SourceForm({id}) {
  const [gateway, setGateway] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [API, setAPI] = React.useState<APIService>(null)

  React.useEffect(() => {
    if (!API) {
      setAPI(new APIService(sessionStorage.getItem('jwt')))
    } else {
      id && handleSetGateway()
    }
  }, [id, API])

  const handleSetGateway = () => {
    setShowSpinner(true)

    API.Gateway.getOne(id)
      .then((res) => { setGateway(res.data) })
      .catch((err) => { throw new Error ('GET gateway error: ' + err) })
      .finally(() => { setShowSpinner(false) })
  }

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

    if (!id) { // unset id means we're creating a new entry
      API.Gateway.create(body)
        .then((res) => {
          setGateway(res.data)
          navigate('/sources')
        })
        .catch((err) => {
          setAlert({ type: 'danger', message: err.message });
          throw new Error ('Create application error: ' + err)
        })
    }

    if (id) { // set id means we're updating a existing entry
      API.Gateway.update(body, id)
        .then((res) => {
          setGateway(res.data)
          navigate('/sources')
        })
        .catch((err) => {
          setAlert({ type: 'danger', message: err.message });
          throw new Error ('Update application error: ' + err)
        })
    }
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
                              {gateway !== null && gateway.name !== null ? (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={gateway.name}
                                                       nameOverride={"Name"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                       nameOverride={"Name"}/>
                              )}
                            </div>
                            <div className="col-6">
                              {gateway !== null && gateway.location !== null ? (
                                <GenericInputComponent type={"text"} name={"location"} id={"locationInput"}
                                                       data={gateway.location}
                                                       nameOverride={"Location (url)"}/>
                              ) : (
                                <GenericInputComponent type={"text"} name={"location"} id={"locationInput"}
                                                       nameOverride={"Location (url)"}/>
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {gateway !== null && gateway.type !== null ? (
                                  <SelectInputComponent
                                    options={[{name: "json", value: "json"}, {name: "xml", value: "xml"}, {
                                      name: "soaps",
                                      value: "soaps"
                                    }, {name: "ftp", value: "ftp"}, {name: "sftp", value: "sftp"}]}
                                    name={"type"} id={"typeInput"} nameOverride={"Type"} data={gateway.type}
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
                              {gateway !== null && gateway.accept !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Accept (accept header used for this source)"}
                                                       name={"accept"}
                                                       id={"acceptInput"}
                                                       data={gateway.accept}
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
                              {gateway !== null && gateway.locale !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Locale"} name={"locale"}
                                                       id={"localeInput"}
                                                       data={gateway.locale}
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
                              {gateway !== null && gateway.auth !== null ? (
                                  <SelectInputComponent
                                    options={[{name: "apikey", value: "apikey"}, {
                                      name: "jwt",
                                      value: "jwt"
                                    }, {name: "username-password", value: "username-password"}]}
                                    name={"auth"} id={"authInput"} nameOverride={"Auth"} required={true}
                                    data={gateway.auth}
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
                              {gateway !== null && gateway.jwt !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Jwt"} name={"jwt"}
                                                       id={"jwtInput"}
                                                       data={gateway.jwt}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Jwt"} name={"jwt"}
                                                       id={"jwtInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {gateway !== null && gateway.jwtId !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"JwtId"} name={"jwtId"}
                                                       id={"jwtIdInput"}
                                                       data={gateway.jwtId}
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
                              {gateway !== null && gateway.secret !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Secret"} name={"secret"}
                                                       id={"secretInput"}
                                                       data={gateway.secret}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Secret"} name={"secret"}
                                                       id={"secretInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {gateway !== null && gateway.apikey !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Apikey"} name={"apikey"}
                                                       id={"apikeyInput"}
                                                       data={gateway.apikey}
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
                              {gateway !== null && gateway.documentation !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Documentation"} name={"documentation"}
                                                       id={"documentationInput"}
                                                       data={gateway.documentation}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Documentation"} name={"documentation"}
                                                       id={"documentationInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {gateway !== null && gateway.authorizationHeader !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"AuthorizationHeader"} name={"authorizationHeader"}
                                                       id={"authorizationHeaderInput"}
                                                       data={gateway.authorizationHeader}
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
                              {gateway !== null && gateway.username !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Username"} name={"username"}
                                                       id={"usernameInput"}
                                                       data={gateway.username}
                                />
                              ) : (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Username"} name={"username"}
                                                       id={"usernameInput"}
                                />
                              )}
                            </div>
                            <div className="col-6">
                              {gateway !== null && gateway.password !== null ? (
                                <GenericInputComponent type={"text"}
                                                       nameOverride={"Password"} name={"password"}
                                                       id={"passwordInput"}
                                                       data={gateway.password}
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
                                return <ElementCreationNew id="headers" label="Headers" data={gateway?.headers}
                                />
                              }
                            },
                              {
                                title: "OAS",
                                id: "oasAccordion",
                                render: function () {
                                  return <ElementCreationNew id="oas" label="OAS" data={gateway?.oas}/>
                                }
                              },
                              {
                                title: "Paths",
                                id: "pathsAccordion",
                                render: function () {
                                  return <ElementCreationNew id="paths" label="Paths" data={gateway?.paths}/>
                                }
                              },
                              {
                                title: "Translation config",
                                id: "translationConfigAccordion",
                                render: function () {
                                  return <ElementCreationNew id="translationConfig" label="Translation Config"
                                                             data={gateway?.translationConfig}/>
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
