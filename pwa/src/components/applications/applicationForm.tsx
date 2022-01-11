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

export default function ApplicationForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [application, setApplication] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
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

    let body = {
      name: event.target.name.value,
      description: event.target.description.value,
      public: event.target.public.value,
      secret: event.target.secret.value,
      resource: event.target.resource.value,
    };

    if (domains.length !== 0) {
      body["domains"] = domains;
    } else {
      body["domains"] = [];
    }

    body = removeEmptyObjectValues(body);
    if (!checkValues([body.name])) {
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
                    className="utrecht-button utrec`ht-button-sm btn-sm btn-success"
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
                        <>
                          <div className="row">
                            <div className="col-6">
                              {application !== null && application.name !== null ? (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"} data={application.name}
                                                       nameOverride={"Name"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"name"} id={"nameInput"}
                                                       nameOverride={"Name"} />
                              )}
                            </div>
                            <div className="col-6">
                              {application !== null && application.description !== null ? (
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       data={application.description} nameOverride={"Description"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"description"} id={"descriptionInput"}
                                                       nameOverride={"Description"} />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {application !== null && application.public !== null ? (
                                <GenericInputComponent type={"text"} name={"public"} id={"publicInput"} data={application.public}
                                                       nameOverride={"Public"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"public"} id={"publicInput"}
                                                       nameOverride={"Public"} />
                              )}
                            </div>
                            <div className="col-6">
                              {application !== null && application.secret !== null ? (
                                <GenericInputComponent type={"text"} name={"secret"} id={"secretInput"}
                                                       data={application.secret} nameOverride={"Secret"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"secret"} id={"secretInput"}
                                                       nameOverride={"Secret"} />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              {application !== null && application.resource !== null ? (
                                <GenericInputComponent type={"text"} name={"resource"} id={"resourceInput"} data={application.resource}
                                                       nameOverride={"Resource"} />
                              ) : (
                                <GenericInputComponent type={"text"} name={"resource"} id={"resourceInput"}
                                                       nameOverride={"Resource"} />
                              )}
                            </div>
                          </div>

                          <Accordion
                            id="applicationAccordion"
                            items={[
                              {
                                title: "Domains",
                                id: "domainsAccordion",
                                render: function () {
                                  return (
                                    <>
                                      {application !== null && application.domains !== null ? (
                                        <ArrayInputComponent
                                          id={"domains"}
                                          label={"Domains"}
                                          data={application.domains}
                                        />
                                      ) : (
                                        <ArrayInputComponent
                                          id={"domains"}
                                          label={"Domains"}
                                          data={null}
                                        />
                                      )}
                                    </>
                                  );
                                },
                              }
                            ]}
                          />
                        </>
                      )}
                    </div>
                  </div>
                )
              }} />
      </form></>
  );
}
