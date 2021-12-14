import * as React from "react";
import Spinner from "../common/spinner";
import Card from "../common/card";
import {GenericInputComponent} from "@conductionnl/nl-design-system/lib/GenericInput/src/genericInput";
import {isLoggedIn} from "../../services/auth";
import {useState} from "react";

export default function ConfigurationForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [configuration, setConfiguration] = useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [title, setTitle] = React.useState("Application");

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (id !== "new") {
          fetch(context.apiUrl + "//" + id, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          })
            .then(response => response.json())
            .then((data) => {
              setConfiguration(data);
            });
        }
      }
    }
  }, [context]);

  const saveConfiguration = () => {
    setShowSpinner(true);

    let url = context.apiUrl + '/';
    let method = 'POST';
    if (id !== 'new') {
      url = url + '/' + id;
      method = 'PUT';
    }

    let nameInput = document.getElementById('nameInput');
    let locationInput = document.getElementById('locationInput');

    let body = {
      name: nameInput.value,
      location: locationInput.value,
    }

    fetch(url, {
      method: method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then((data) => {
        console.log('Saved source:', data);
        setConfiguration(data);
        setShowSpinner(false);
        setTitle(configuration.name);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <form id="dataForm" onSubmit={saveConfiguration}>
      <Card title="Values" back="/sources" save={true} >
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <Spinner />
            ) : (
              <>
                <div className="row">
                  <div className="col-6">
                    {configuration !== null && configuration.name !== null ? (
                      <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={configuration.name} nameOverride={"Name"} required={"true"}/>
                    ) : (
                      <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}  nameOverride={"Name"} required={"true"}/>
                    )}
                  </div>
                  <div className="col-6">
                    {configuration !== null && configuration.location !== null ? (
                      <GenericInputComponent nameOverride={"Location"} name={"location"} data={configuration.location} type={"text"} required={"true"} id={"locationInput"}/>
                    ) : (
                      <GenericInputComponent nameOverride={"Location"} name={"location"} type={"text"} required={"true"} id={"locationInput"}/>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </Card>
    </form>
  );
}
