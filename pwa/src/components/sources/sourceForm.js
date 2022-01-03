import * as React from "react";
import { Link, navigate } from "gatsby";
import {
  checkValues,
  removeEmptyObjectValues,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import { GenericInputComponent, Accordion, MultiDimensionalArrayInput, Card, Alert, Spinner, SelectInputComponent } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { addElement, deleteElementFunction } from "../utility/elementCreation";
import FlashMessage from 'react-flash-message';

export default function SourceForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn && id !== 'new') {
      getSource();
    }
  }, [context]);

  const getSource = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/gateways/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('getSource:', data);
        setSource(data);
        setShowSpinner(false);
        if (data.id !== undefined) {
          setSource(data);
        } else {
          setAlert({type: 'danger', message: data['hydra:description']})
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const saveSource = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let headers = retrieveFormArrayAsObject(event.target, "headers");
    let oas = retrieveFormArrayAsObject(event.target, "oas");
    let paths = retrieveFormArrayAsObject(event.target, "paths");
    let translationConfigs = retrieveFormArrayAsObject(event.target, "translationConfigs");

    let url = `${context.adminUrl}/gateways`;
    let method = "POST";
    if (id !== "new") {
      url = `${url}/${id}`;
      method = "PUT";
    }

    let nameInput = document.getElementById("nameInput");
    let locationInput = document.getElementById("locationInput");
    let typeInput = document.getElementById("typeInput");
    let authInput = document.getElementById("authInput");
    let localeInput = document.getElementById("localeInput");
    let acceptInput = document.getElementById("acceptInput");
    let jwtInput = document.getElementById("jwtInput");
    let jwtIdInput = document.getElementById("jwtIdInput");
    let secretInput = document.getElementById("secretInput");
    let usernameInput = document.getElementById("usernameInput");
    let passwordInput = document.getElementById("passwordInput");
    let apikeyInput = document.getElementById("apikeyInput");
    let documentationInput = document.getElementById("documentationInput");
    let authorizationHeaderInput = document.getElementById(
      "authorizationHeaderInput"
    );
    // let loggingInput = document.getElementById("loggingInput");
    // let logging = loggingInput.checked ? true : false;

    let body = {
      name: nameInput.value ? nameInput.value : null,
      location: locationInput.value ? locationInput.value : null,
      type: typeInput.value ? typeInput.value : null,
      auth: authInput.value ? authInput.value : null,
      locale: localeInput.value ? localeInput.value : null,
      accept: acceptInput.value ? acceptInput.value : null,
      jwt: jwtInput.value ? jwtInput.value : null,
      jwtId: jwtIdInput.value ? jwtIdInput.value : null,
      secret: secretInput.value ? secretInput.value : null,
      username: usernameInput.value ? usernameInput.value : null,
      password: passwordInput.value ? passwordInput.value : null,
      apikey: apikeyInput.value ? apikeyInput.value : null,
      documentation: documentationInput.value ? documentationInput.value : null,
      authorizationHeader: authorizationHeaderInput.value ? authorizationHeaderInput.value : ' ',

      // logging: logging,
      headers: headers ? headers : null,
      oas: oas ? oas : null,
      paths: paths ? paths : null,
      translationConfigs: translationConfigs ? translationConfigs : null
    };

    if (Object.keys(headers).length !== 0 && headers !== "") {
      body["headers"] = headers;
    } else {
      body["headers"] = [];
    }
    if (Object.keys(oas).length !== 0 && oas !== "") {
      body["oas"] = oas;
    } else {
      body["oas"] = [];
    }
    if (Object.keys(paths).length !== 0 && paths !== "") {
      body["paths"] = paths;
    } else {
      body["paths"] = [];
    }
    if (Object.keys(translationConfigs).length !== 0 && translationConfigs !== "") {
      body["translationConfigs"] = translationConfigs;
    } else {
      body["translationConfigs"] = [];
    }

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id !== undefined) {
          navigate(`/sources`);
        } else {
          setShowSpinner(false);
          setAlert(null);
          setAlert({ type: 'danger', message: data['hydra:description'] });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (<>
    {
      alert !== null &&
      <FlashMessage duration={5000}>
        <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
      </FlashMessage>
    }
    <form id="dataForm" onSubmit={saveSource}>
      <Card title={"Source"}
        cardHeader={function () {
          return (<>
            <Link className="utrecht-link" to={"/sources"}>
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
          </>
          )
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
                      <div className="col-6 form-group">
                        <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={source && source.name && source.name} nameOverride={"Name"} required={"true"} />
                      </div>
                      <div className="col-6 form-group">
                        <GenericInputComponent nameOverride={"Location (url)"} name={"location"} data={source && source.location && source.location} type={"text"} required={"true"} id={"locationInput"} />

                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 form-group">
                        {source !== null && source.type !== null ? (
                            <SelectInputComponent
                              options={[{ name: "json", value: "json" }, { name: "xml", value: "xml" }, { name: "soap", value: "soap" }, { name: "ftp", value: "ftp" }, { name: "sftp", value: "sftp" }]}
                              name={"type"} id={"typeInput"} nameOverride={"Type"} data={source.type} required={true} />
                          ) :
                          (
                            <SelectInputComponent
                              options={[{ name: "json", value: "json" }, { name: "xml", value: "xml" }, { name: "soap", value: "soap" }, { name: "ftp", value: "ftp" }, { name: "sftp", value: "sftp" }]}
                              name={"type"} id={"typeInput"} nameOverride={"Type"} required={true} />
                          )}
                        {/*{source !== null && source.type !== null ? (*/}
                        {/*  <GenericInputComponent type={"text"} name={"type"} id={"typeInput"} data={source.type} required={"true"} />*/}
                        {/*) : (*/}
                        {/*  <GenericInputComponent type={"text"} name={"type"} id={"typeInput"} required={"true"} />*/}
                        {/*)}*/}
                        <SelectInputComponent
                          options={[{ name: "json", value: "json" }, { name: "xml", value: "xml" }, { name: "soap", value: "soap" }, { name: "ftp", value: "ftp" }, { name: "sftp", value: "sftp" }]}
                          name={"type"} id={"typeInput"} nameOverride={"Type"} data={source && source.type && source.type} required={true} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 form-group">
                        <GenericInputComponent nameOverride={"Accept (accept header used for this source)"} name={"accept"} data={source && source.accept && source.accept} type={"text"} id={"acceptInput"} />
                      </div>
                      <div className="col-6">
                        <GenericInputComponent nameOverride={"Locale"} name={"locale"} data={source && source.locale && source.locale} type={"text"} id={"localeInput"} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 form-group">
                        {source !== null && source.auth !== null ? (
                          <SelectInputComponent
                            options={[{ name: "apikey", value: "apikey" }, { name: "jwt", value: "jwt" }, { name: "username-password", value: "username-password" }]}
                            name={"auth"} id={"authInput"} nameOverride={"Auth"} data={source.auth} required={true} />
                        ) :
                          (
                            <SelectInputComponent
                              options={[{ name: "apikey", value: "apikey" }, { name: "jwt", value: "jwt" }, { name: "username-password", value: "username-password" }]}
                              name={"auth"} id={"authInput"} nameOverride={"Auth"} required={true} />
                          )}
                        <SelectInputComponent
                          options={[{ name: "apikey", value: "apikey" }, { name: "jwt", value: "jwt" }, { name: "username-password", value: "username-password" }]}
                          name={"auth"} id={"authInput"} nameOverride={"Auth"} data={source && source.auth && source.auth} required={true} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Jwt"} name={"jwt"} data={source && source.jwt && source.jwt} type={"text"} id={"jwtInput"} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"JwtId"} name={"jwtId"} data={source && source.jwtId && source.jwtId} type={"text"} id={"jwtIdInput"} />
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Secret"} name={"secret"} data={source && source.secret && source.secret} type={"text"} id={"secretInput"} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Username"} name={"username"} data={source && source.username && source.username} type={"text"} id={"usernameInput"} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Password"} name={"password"} data={source && source.password && source.password} type={"text"} id={"passwordInput"} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Apikey"} name={"apikey"} data={source && source.apikey && source.apikey} type={"text"} id={"apikeyInput"} />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Documentation"} name={"documentation"} data={source && source.documentation && source.documentation} type={"text"} id={"documentationInput"} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"AuthorizationHeader"} name={"authorizationHeader"} data={source && source.authorizationHeader && source.authorizationHeader} type={"text"} id={"authorizationHeaderInput"} />
                        </div>
                      </div>
                    </div>

                    {/* Logging input */}
                    {/* <div className="row mt-3">
                      <div className="col-12 col-sm-6 ">
                        <div className="form-check">
                          {
                            source !== null && source.logging !== null && source.logging === true ? <>
                              <Checkbox type="checkbox" id="loggingInput" nameLabel="logging" nameAttribute="logging" data={true} /></> : <>
                              <Checkbox type="checkbox" id="loggingInput" nameLabel="logging" nameAttribute="logging" /> </>
                          }
                        </div>
                      </div>
                    </div> */}

                    <Accordion id="sourceAccordion"
                      items={[{
                        title: "Headers",
                        id: "headers",
                        render: function () {
                          return (<>
                            {source !== null && source.headers !== null ? (
                              <MultiDimensionalArrayInput
                                id={"headers"}
                                label={"Headers"}
                                data={source.headers}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement} />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"headers"}
                                label={"Headers"}
                                data={null}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "OAS",
                        id: "oas",
                        render: function () {
                          return (<>
                            {source !== null &&
                            source.oas ? (
                              <MultiDimensionalArrayInput
                                id={"oas"}
                                label={"OAS"}
                                data={source.oas}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement} />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"oas"}
                                label={"oas"}
                                data={null}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "Paths",
                        id: "paths",
                        render: function () {
                          return (<>
                            {source !== null &&
                              source.paths ? (
                              <MultiDimensionalArrayInput
                                id={"paths"}
                                label={"paths"}
                                data={source.paths}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement} />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"paths"}
                                label={"paths"}
                                data={null}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement}
                              />
                            )}
                          </>)
                        }
                      },
                      {
                        title: "Translation config",
                        id: "translationConfig",
                        render: function () {
                          return (<>
                            {source !== null &&
                              source.translationConfigs ? (
                              <MultiDimensionalArrayInput
                                id={"translationConfig"}
                                label={"translationConfig"}
                                data={source.translationConfig}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement} />
                            ) : (
                              <MultiDimensionalArrayInput
                                id={"translationConfig"}
                                label={"translationConfig"}
                                data={null}
                                deleteFunction={deleteElementFunction}
                                addFunction={addElement}
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
    </form ></>
  );
}
