import * as React from "react";
import { Link, navigate } from "gatsby";
import {
  removeEmptyObjectValues,
  retrieveFormArrayAsObject,
} from "../utility/inputHandler";
import Spinner from "../common/spinner";
import { GenericInputComponent } from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import { SelectInputComponent } from "@conductionnl/nl-design-system/lib/SelectInput/src/selectInput";
import { Accordion } from "@conductionnl/nl-design-system/lib/Accordion/src/accordion";
import { MultiDimensionalArrayInput } from "@conductionnl/nl-design-system/lib/MultiDimenionalArrayInput/src/multiDimensionalArrayInput";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";

export default function SoapForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [soap, setSoap] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    }
    if (id !== "new") {
      getSoap();
    }
  }, [context]);

  const getSoap = () => {
    fetch(`${context.adminUrl}/soaps/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSoap(data);
        console.log(data);
      });
  };

  const saveSoap = (event) => {
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
        setSoap(data);
        setShowSpinner(false);
        navigate("/soap");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form id="dataForm" onSubmit={saveSoap}>
      <Card
        title={"Soap"}
        cardHeader={function () {
          return (
            <>
              <Link className="utrecht-link" to={"/soaps"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                  <i className="fas fa-long-arrow-alt-left mr-2" />
                  Back
                </button>
              </Link>
              <button
                className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
                type="submit"
              >
                <i className="fas fa-save mr-2" />
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
                  <Spinner />
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
                  </>
                )}
              </div>
            </div>
          );
        }}
      />
    </form>
  );
}
