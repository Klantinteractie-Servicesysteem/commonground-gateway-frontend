import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import {Link, navigate} from "gatsby";
import {
  removeEmptyObjectValues,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import Spinner from "../common/spinner";
import {GenericInputComponent} from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import {SelectInputComponent} from "@conductionnl/nl-design-system/lib/SelectInput/src/selectInput";
import {Accordion} from "@conductionnl/nl-design-system/lib/Accordion/src/accordion";
import {MultiDimensionalArrayInput} from "@conductionnl/nl-design-system/lib/MultiDimenionalArrayInput/src/multiDimensionalArrayInput";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";

export default function SourceForm({ id }) {
  const context = useUrlContext();
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const getSource = () => {
    fetch(context.adminUrl + "/gateways/" + id, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        setSource(data);
        console.log(data);
      });
  };

  const saveSource = (event) => {
    setShowSpinner(true);
    event.preventDefault();
    let headers = retrieveFormArrayAsObject(event.target, "headers");

    let url = context.adminUrl + "/gateways";
    let method = "POST";
    if (id !== "new") {
      url = url + "/" + id;
      method = "PUT";
    }

    let nameInput = document.getElementById("nameInput");
    let locationInput = document.getElementById("locationInput");
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
    // let authorizationHeaderInput = document.getElementById('authorizationHeaderInput');

    let body = {
      name: nameInput.value,
      location: locationInput.value,
      auth: authInput.value,
      locale: localeInput.value,
      accept: acceptInput.value,
      jwt: jwtInput.value,
      jwtId: jwtIdInput.value,
      secret: secretInput.value,
      username: usernameInput.value,
      password: passwordInput.value,
      apikey: apikeyInput.value,
      documentation: documentationInput.value,
      authorizationHeader: authorizationHeaderInput.value,
    };

    if (Object.keys(headers).length !== 0) {
      body["headers"] = headers;
    } else {
      body["headers"] = [];
    }

    body = removeEmptyObjectValues(body);

    fetch(url, {
      method: method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setSource(data);
        setShowSpinner(false);
        navigate("/sources");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  React.useEffect(() => {
    if (id !== "new") {
      getSource();
    }
  }, []);

  return (
    <form id="dataForm" onSubmit={saveSource}>
      <Card title={"Source"}
            cardHeader={function (){return(<>
                <Link className="utrecht-link" to={"/sources"}>
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                    <i className="fas fa-long-arrow-alt-left mr-2"/>Back
                  </button>
                </Link>
                <button
                  className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                  type="submit"
                >
                  <i className="fas fa-save mr-2"/>Save
                </button>
              </>
            )}}
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
                            {source !== null && source.name !== null ? (
                              <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={source.name} nameOverride={"Name"} required={"true"}/>
                            ) : (
                              <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}  nameOverride={"Name"} required={"true"}/>
                            )}
                          </div>
                          <div className="col-6">
                            {source !== null && source.location !== null ? (
                              <GenericInputComponent nameOverride={"Location (url)"} name={"location"} data={source.location} type={"text"} required={"true"} id={"locationInput"}/>
                            ) : (
                              <GenericInputComponent nameOverride={"Location (url)"}  name={"location"}  type={"text"} required={"true"} id={"locationInput"}/>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            {source !== null && source.accept !== null ? (
                              <GenericInputComponent nameOverride={"Accept (accept header used for this source)"} name={"accept"} data={source.accept} type={"text"} required={"true"} id={"acceptInput"}/>
                            ) : (
                              <GenericInputComponent nameOverride={"Accept (accept header used for this source)"} name={"accept"}  type={"text"} required={"true"} id={"acceptInput"}/>
                            )}
                          </div>
                          <div className="col-6">
                            {source !== null && source.locale !== null ? (
                              <GenericInputComponent nameOverride={"Locale"} name={"locale"} data={source.locale} type={"text"} required={"true"} id={"localeInput"}/>
                            ) : (
                              <GenericInputComponent nameOverride={"Locale"} name={"locale"}  type={"text"} required={"true"} id={"localeInput"} maxLength={"10"}/>
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          {source !== null && source.auth !== null ? (
                              <SelectInputComponent
                                options={[{name: "apikey"}, {name: "jwt"}, {name: "username-password"}]}
                                name={"auth"} id={"authInput"} nameOverride={"Auth *"} data={source.auth}/>
                            ) :
                            (
                              <SelectInputComponent
                                options={[{name: "apikey"}, {name: "jwt"}, {name: "username-password"}]}
                                name={"auth"} id={"authInput"} nameOverride={"Auth *"}/>
                            )}
                        </div>
                        <div className="row">
                          <div className="col-4">
                            <div className="form-group">
                              {source !== null && source.jwt !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Jwt"} name={"jwt"} data={source.jwt} type={"text"} required={"true"} id={"jwtInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Jwt"} name={"jwt"} type={"text"} required={"true"} id={"jwtInput"}/>
                              )}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="form-group">
                              {source !== null && source.jwtId !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"JwtId"} name={"jwtId"} data={source.jwtId} type={"text"} required={"true"} id={"jwtIdInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"JwtId"} name={"jwtId"} type={"text"} required={"true"} id={"jwtIdInput"}/>
                              )}
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="form-group">
                              {source !== null && source.secret !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Secret"} name={"secret"} data={source.secret} type={"text"} required={"true"} id={"secretInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Secret"} name={"secret"} type={"text"} required={"true"} id={"secretInput"}/>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              {source !== null && source.username !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Username"} name={"username"} data={source.username} type={"text"} required={"true"} id={"usernameInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Username"} name={"username"} type={"text"} required={"true"} id={"usernameInput"}/>
                              )}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group">
                              {source !== null && source.password !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Password"} name={"password"} data={source.password} type={"text"} required={"true"} id={"passwordInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Password"} name={"password"} type={"text"} required={"true"} id={"passwordInput"}/>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              {source !== null && source.apikey !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Apikey"} name={"apikey"} data={source.apikey} type={"text"} required={"true"} id={"apikeyInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Apikey"} name={"apikey"} type={"text"} required={"true"} id={"apikeyInput"}/>
                              )}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group">
                              {source !== null && source.documentation !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Documentation"} name={"documentation"} data={source.documentation} type={"text"} required={"true"} id={"documentationInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"Documentation"} name={"documentation"} type={"text"} required={"true"} id={"documentationInput"}/>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="form-group">
                              {source !== null && source.authorizationHeader !== null ? (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"AuthorizationHeader"} name={"authorizationHeader"} data={source.authorizationHeader} type={"text"} required={"true"} id={"authorizationHeaderInput"}/>
                              ) : (
                                <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" nameOverride={"AuthorizationHeader"} name={"authorizationHeader"} type={"text"} required={"true"} id={"authorizationHeaderInput"}/>
                              )}
                            </div>
                          </div>
                          <Accordion id="sourceAccordion"
                                     items={[{
                                       title: "Headers",
                                       id: "headers",
                                       render: function () {
                                         return (<>
                                           {source !== null ? (
                                             <MultiDimensionalArrayInput
                                               id={"headers"}
                                               label={"Headers"}
                                               data={[{key: 'headers', value: source.headers}]}                                             />
                                           ) : (
                                             <MultiDimensionalArrayInput
                                               id={"headers"}
                                               label={"Headers"}
                                               data={null}
                                             />
                                           )}
                                         </>)
                                       }
                                     }]}
                                     />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            }}
      />
    </form>
  );
}
