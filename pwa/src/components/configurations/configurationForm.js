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

export default function ConfigurationForm({id}) {
  const [context, setContext] = React.useState(null);
  const [configuration, setConfiguration] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn) {
      if (id !== 'new') {
        getConfiguration();
      }

    }
  }, [context]);

  const getConfiguration = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/configurations/${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("get Configurations")
        console.log(data)
        setShowSpinner(false);
        setConfiguration(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  const saveConfiguration = (event) => {
    event.preventDefault();
    setShowSpinner(true);


    let body = {
      name: event.target.name.value,
      location: event.target.location.value,
    };

    // This removes empty values from the body
    body = removeEmptyObjectValues(body);

    if (!checkValues([body.name, body.type,])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/configurations`
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
        setConfiguration(data)
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
      <form id="dataForm" onSubmit={saveConfiguration}>
        <Card
          title="Values"
          back="/entities"
          save={true}
          cardHeader={function () {
            return (
              <>
                <Link className="utrecht-link" to={"/configurations"}>
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
    </>
  );
}
