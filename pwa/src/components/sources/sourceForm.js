import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { Link, navigate } from "gatsby";
import { MultiDimensionalArrayInput } from "../utility/multiDimensionalArrayInput";
import {
  removeEmptyObjectValues,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import Spinner from "../common/spinner";
import Accordion from "../common/accordion";
import Card from "../common/card";
import {GenericInputComponent} from "../utility/genericInput";
import {SelectInputComponent} from "../utility/selectInput";

export default function SourceForm({ id }) {
  const context = useUrlContext();
  const [source, setSource] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const getSource = () => {
    fetch(context.apiUrl + "/gateways/" + id, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
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

    let url = context.apiUrl + "/gateways";
    let method = "POST";
    if (id != "new") {
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

    if (Object.keys(headers).length != 0) {
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
      <Card title="Values" back="/sources" save={true} >
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <Spinner />
            ) : (
              <>
                <div className="row">
                  <div className="col-6">
                    {source !== null && source.name !== null ? (
                      <GenericInputComponent type={"text"} target={"name"} id={"nameInput"} data={source.name} name={"Name"} required={"true"}/>
                    ) : (
                      <GenericInputComponent type={"text"} target={"name"} id={"nameInput"}  name={"Name"} required={"true"}/>
                    )}
                  </div>
                  <div className="col-6">
                    {source !== null && source.location !== null ? (
                      <GenericInputComponent name={"Location (url)"} target={"location"} data={source.location} type={"text"} required={"true"} id={"locationInput"}/>
                    ) : (
                      <GenericInputComponent name={"Location (url)"}  target={"location"}  type={"text"} required={"true"} id={"locationInput"}/>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    {source !== null && source.accept !== null ? (
                      <GenericInputComponent name={"Accept (accept header used for this source)"} target={"accept"} data={source.accept} type={"text"} required={"true"} id={"acceptInput"}/>
                    ) : (
                      <GenericInputComponent name={"Accept (accept header used for this source)"} target={"accept"}  type={"text"} required={"true"} id={"acceptInput"}/>
                    )}
                  </div>
                  <div className="col-6">
                    {source !== null && source.locale !== null ? (
                      <GenericInputComponent name={"Locale"} target={"locale"} data={source.locale} type={"text"} required={"true"} id={"localeInput"}/>
                    ) : (
                      <GenericInputComponent name={"Locale"} target={"locale"}  type={"text"} required={"true"} id={"localeInput"} maxLength={"10"}/>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  {source !== null && source.auth !== null ? (
                      <SelectInputComponent
                        options={[{name: "apikey"}, {name: "jwt"}, {name: "username-password"}]}
                        target={"auth"} id={"authInput"} name={"Auth *"} data={source.auth}/>
                    ) :
                    (
                      <SelectInputComponent
                        options={[{name: "apikey"}, {name: "jwt"}, {name: "username-password"}]}
                        target={"auth"} id={"authInput"} name={"Auth *"} data={source.auth}/>
                    )}
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      {source !== null && source.jwt !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Jwt"} target={"jwt"} data={source.jwt} type={"text"} required={"true"} id={"jwtInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Jwt"} target={"jwt"} type={"text"} required={"true"} id={"jwtInput"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      {source !== null && source.jwtId !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"JwtId"} target={"jwtId"} data={source.jwtId} type={"text"} required={"true"} id={"jwtIdInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"JwtId"} target={"jwtId"} type={"text"} required={"true"} id={"jwtIdInput"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      {source !== null && source.secret !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Secret"} target={"secret"} data={source.secret} type={"text"} required={"true"} id={"secretInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Secret"} target={"secret"} type={"text"} required={"true"} id={"secretInput"}/>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {source !== null && source.username !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Username"} target={"username"} data={source.username} type={"text"} required={"true"} id={"usernameInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Username"} target={"username"} type={"text"} required={"true"} id={"usernameInput"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {source !== null && source.password !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Password"} target={"password"} data={source.password} type={"text"} required={"true"} id={"passwordInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Password"} target={"password"} type={"text"} required={"true"} id={"passwordInput"}/>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {source !== null && source.apikey !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Apikey"} target={"apikey"} data={source.apikey} type={"text"} required={"true"} id={"apikeyInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Apikey"} target={"apikey"} type={"text"} required={"true"} id={"apikeyInput"}/>
                      )}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      {source !== null && source.documentation !== null ? (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Documentation"} target={"documentation"} data={source.documentation} type={"text"} required={"true"} id={"documentationInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"Documentation"} type={"text"} required={"true"} id={"documentationInput"}/>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      {source !== null && source.authorizationHeader !== null ? (
                          <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"AuthorizationHeader"} target={"authorizationHeader"} data={source.authorizationHeader} type={"text"} required={"true"} id={"authorizationHeaderInput"}/>
                      ) : (
                        <GenericInputComponent className="utrecht-textbox utrecht-textbox--html-input" name={"AuthorizationHeader"} target={"authorizationHeader"} type={"text"} required={"true"} id={"authorizationHeaderInput"}/>
                        )}
                    </div>
                  </div>
                  <Accordion id="headersTest" title="Headers">
                    {source !== null ? (
                      <MultiDimensionalArrayInput
                        target={"headers"}
                        data={source.headers}
                      />
                    ) : (
                      <MultiDimensionalArrayInput target={"headers"} />
                    )}
                  </Accordion>

                </div>
              </>
            )}
          </div>
        </div>

      </Card>
    </form>
  );
}
