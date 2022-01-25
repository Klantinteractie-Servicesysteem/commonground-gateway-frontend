import * as React from "react";
import Spinner from "../common/spinner";
import { GenericInputComponent } from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import { isLoggedIn } from "../../services/auth";
import { useState } from "react";
import { Link } from "gatsby";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";

export default function ConfigurationForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [configuration, setConfiguration] = useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: process.env.GATSBY_API_URL,
        frontendUrl: process.env.GATSBY_FRONTEND_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (id !== "new") {
          fetch(context.apiUrl + "//" + id, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setConfiguration(data);
            });
        }
      }
    }
  }, [context, id]);

  const saveConfiguration = () => {
    setShowSpinner(true);

    let url = context.apiUrl + "/";
    let method = "POST";
    if (id !== "new") {
      url = url + "/" + id;
      method = "PUT";
    }

    let nameInput = document.getElementById("nameInput");
    let locationInput = document.getElementById("locationInput");

    let body = {
      name: nameInput.value,
      location: locationInput.value,
    };

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved source:", data);
        setConfiguration(data);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form id="dataForm" onSubmit={saveConfiguration}>
      <Card
        title="Values"
        back="/entities"
        save={true}
        cardHeader={function () {
          return (
            <>
              <Link className="utrecht-link" to={"/configurations"}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn btn-light mr-2">
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
                    <div className="row">
                      <div className="col-6">
                        {configuration !== null &&
                        configuration.name !== null ? (
                          <GenericInputComponent
                            type={"text"}
                            name={"name"}
                            id={"nameInput"}
                            data={configuration.name}
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
                        {configuration !== null &&
                        configuration.location !== null ? (
                          <GenericInputComponent
                            nameOverride={"Location"}
                            name={"location"}
                            data={configuration.location}
                            type={"text"}
                            required={"true"}
                            id={"locationInput"}
                          />
                        ) : (
                          <GenericInputComponent
                            nameOverride={"Location"}
                            name={"location"}
                            type={"text"}
                            required={"true"}
                            id={"locationInput"}
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
