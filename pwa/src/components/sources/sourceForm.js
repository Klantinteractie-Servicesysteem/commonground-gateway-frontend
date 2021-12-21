import * as React from "react";
import { Link, navigate } from "gatsby";
import Spinner from "../common/spinner";
import { GenericInputComponent } from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import { SelectInputComponent } from "@conductionnl/nl-design-system/lib/SelectInput/src/selectInput";
import { Accordion } from "@conductionnl/nl-design-system/lib/Accordion/src/accordion";
import { MultiDimensionalArrayInput } from "@conductionnl/nl-design-system/lib/MultiDimenionalArrayInput/src/multiDimensionalArrayInput";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { isLoggedIn } from "../../services/auth";
import { addElement, deleteElementFunction } from "../utility/elementCreation";
import {retrieveFormArrayAsOArray, retrieveFormArrayAsObject} from "../utility/inputHandler";

export default function SourceForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

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
    fetch(`${context.adminUrl}/gateways/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log('getSource:', data);
        setSource(data);
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

    // setShowSpinner(false); return;

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);return;
        setShowSpinner(false);
        if (data.id !== undefined) {
          setSource(data);
          navigate(`/sources`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
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
                        {source !== null && source.name !== null ? (
                          <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={source.name} nameOverride={"Name"} required={"true"} />
                        ) : (
                          <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} nameOverride={"Name"} required={"true"} />
                        )}
                      </div>
                      <div className="col-6 form-group">
                        {source !== null && source.location !== null ? (
                          <GenericInputComponent nameOverride={"Location (url)"} name={"location"} data={source.location} type={"text"} required={"true"} id={"locationInput"} />
                        ) : (
                          <GenericInputComponent nameOverride={"Location (url)"} name={"location"} type={"text"} required={"true"} id={"locationInput"} />
                        )}
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6 form-group">
                        {source !== null && source.accept !== null ? (
                          <GenericInputComponent nameOverride={"Accept (accept header used for this source)"} name={"accept"} data={source.accept} type={"text"} id={"acceptInput"} />
                        ) : (
                          <GenericInputComponent nameOverride={"Accept (accept header used for this source)"} name={"accept"} type={"text"} id={"acceptInput"} />
                        )}
                      </div>
                      <div className="col-6">
                        {source !== null && source.locale !== null ? (
                          <GenericInputComponent nameOverride={"Locale"} name={"locale"} data={source.locale} type={"text"} id={"localeInput"} />
                        ) : (
                          <GenericInputComponent nameOverride={"Locale"} name={"locale"} type={"text"} id={"localeInput"} maxLength={"10"} />
                        )}
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <div className="form-group">
                          {source !== null && source.jwt !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Jwt"} name={"jwt"} data={source.jwt} type={"text"} id={"jwtInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Jwt"} name={"jwt"} type={"text"} id={"jwtInput"} />
                          )}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          {source !== null && source.jwtId !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"JwtId"} name={"jwtId"} data={source.jwtId} type={"text"} id={"jwtIdInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"JwtId"} name={"jwtId"} type={"text"} id={"jwtIdInput"} />
                          )}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          {source !== null && source.secret !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Secret"} name={"secret"} data={source.secret} type={"text"} id={"secretInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Secret"} name={"secret"} type={"text"} id={"secretInput"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {source !== null && source.username !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Username"} name={"username"} data={source.username} type={"text"} id={"usernameInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Username"} name={"username"} type={"text"} id={"usernameInput"} />
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          {source !== null && source.password !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Password"} name={"password"} data={source.password} type={"text"} id={"passwordInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Password"} name={"password"} type={"text"} id={"passwordInput"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {source !== null && source.apikey !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Apikey"} name={"apikey"} data={source.apikey} type={"text"} id={"apikeyInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Apikey"} name={"apikey"} type={"text"} id={"apikeyInput"} />
                          )}
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          {source !== null && source.documentation !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Documentation"} name={"documentation"} data={source.documentation} type={"text"} id={"documentationInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Documentation"} name={"documentation"} type={"text"} id={"documentationInput"} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          {source !== null && source.authorizationHeader !== null ? (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"AuthorizationHeader"} name={"authorizationHeader"} data={source.authorizationHeader} type={"text"} id={"authorizationHeaderInput"} />
                          ) : (
                            <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"AuthorizationHeader"} name={"authorizationHeader"} type={"text"} id={"authorizationHeaderInput"} />
                          )}
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
    </form >
  );
}
