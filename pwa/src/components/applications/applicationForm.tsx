import * as React from "react";
import {
  GenericInputComponent,
  Spinner,
  Card,
  Alert,
  Accordion
} from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import {
  checkValues,
  removeEmptyObjectValues, retrieveFormArrayAsOArray,
} from "../utility/inputHandler";
import {ArrayInputComponent} from "../common/arrayInput";
import FlashMessage from 'react-flash-message';

interface IApplication {
  name: string,
  description: string,
  public: string,
  secret: string,
  resource: string,
  domains: Array<string>,
}

export default function ApplicationForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [alert, setAlert] = React.useState<Record<string, string>>(null);
  const [application, setApplication] = React.useState<IApplication>(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (id !== "new") {
          getApplication();
        }
      }
    }
  }, [context]);

  const getApplication = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/applications/${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        setApplication(data);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  const saveApplication = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let domains = retrieveFormArrayAsOArray(event.target, "domains");

    let body: {} = {
      name: event.target.name.value,
      description: event.target.description ? event.target.description.value : null,
      public: event.target.public.value ? event.target.public.value : null,
      secret: event.target.secret.value ? event.target.secret.value : null,
      resource: event.target.resource.value ? event.target.resource.value : null,
    };

    if (domains.length !== 0) {
      body["domains"] = domains;
    } else {
      body["domains"] = [];
    }

    body = removeEmptyObjectValues(body);

    if (!checkValues([body["name"], body["domains"]])) {
      setAlert(null);
      setAlert({type: 'danger', message: 'Required fields are empty'});
      setShowSpinner(false);
      return;
    }

    let url = `${context.adminUrl}/applications`;
    let method = "POST";
    if (id !== "new") {
      url = `${url}/${id}`;
      method = "PUT";
    }

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
        setShowSpinner(false);
        setApplication(data);
        method === 'POST' && navigate(`/applications`)
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error(error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (<div>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
        </FlashMessage>
      }
      <form id="applicationForm" onSubmit={saveApplication}>
        <Card title="Values"
              cardHeader={function () {
                return (<>
                  <Link className="utrecht-link" to={"/applications"}>
                    <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                      <i className="fas fa-long-arrow-alt-left mr-2" />Back
                    </button>
                  </Link>
                  <button
                    className="utrecht-button utrecht-button-sm btn-sm btn-success"
                    type="submit"
                  >
                    <i className="fas fa-save mr-2" />Save
                  </button>
                </>)
              }}
              cardBody={function () {
                return (
                  <div className="row">
                    <div className="col-12">
                      {showSpinner === true ? (
                        <Spinner />
                      ) : (
                        <div>
                          <div className="row">
                            <div className="col-6">
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={application && application.name && application.name}
                                                       nameOverride={"Name"} required />
                            </div>
                            <div className="col-6">
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       data={application && application.description && application.description} nameOverride={"Description"} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                                <GenericInputComponent type={"text"} name={"public"} id={"publicInput"} data={application && application.public && application.public}
                                                       nameOverride={"Public"} />
                            </div>
                            <div className="col-6">
                                <GenericInputComponent type={"text"} name={"secret"} id={"secretInput"}
                                                       data={application && application.secret && application.secret} nameOverride={"Secret"} />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                                <GenericInputComponent type={"text"} name={"resource"} id={"resourceInput"} data={application && application.resource && application.resource}
                                                       nameOverride={"Resource"} />
                            </div>
                          </div>

                          <Accordion
                            id="applicationAccordion"
                            items={[
                              {
                                title: "Domains *",
                                id: "domainsAccordion",
                                render: function () {
                                  return (
                                        <ArrayInputComponent
                                          id={"domains"}
                                          label={"Domains"}
                                          data={application && application.domains ? application.domains : null}
                                        />
                                  );
                                },
                              }
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              }}
        />
      </form>
  </div>
  );
}
