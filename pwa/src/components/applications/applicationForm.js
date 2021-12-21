import * as React from "react";
import Spinner from "../common/spinner";
import { GenericInputComponent } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { navigate } from "gatsby-link";
import {
  checkValues,
  removeEmptyObjectValues,
} from "../utility/inputHandler";

export default function ApplicationForm({ id }) {
  const [context, setContext] = React.useState(null);
  const [application, setApplication] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [title, setTitle] = React.useState("Application");

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
      });
    } else {
      if (isLoggedIn()) {
        if (id !== "new") {
          fetch(context.adminUrl + "/applications/" + id, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setApplication(data);
            });
        }
      }
    }
  }, [context]);

  const saveApplication = (event) => {
    event.preventDefault();
    setShowSpinner(true);

    let url = context.adminUrl + "/applications";
    let method = "POST";
    if (id !== "new") {
      url = url + "/" + id;
      method = "PUT";
    }

    let nameInput = document.getElementById("nameInput");
    let descriptionInput = document.getElementById("descriptionInput");
    let publicInput = document.getElementById("publicInput");
    let secretInput = document.getElementById("secretInput");
    let resourceInput = document.getElementById("resourceInput");

    let body = {
      name: nameInput.value,
      description: descriptionInput.value,
      public: publicInput.value,
      secret: secretInput.value,
      resource: resourceInput.value,
    };

    body = removeEmptyObjectValues(body);
    if (!checkValues([body.name])) {
      return;
    }


    console.log(body); return;
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
        navigate('/applications');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <form id="dataForm" onSubmit={saveApplication}>
      <Card
        title="Values"
        back="/applications"
        save={true}
        cardHeader={function () {
          return (
            <>
              <Link className="utrecht-link" to={"/applications"}>
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
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"name"}
                            id={"nameInput"}
                            data={application && application.name && application.name}
                            nameOverride={"Name"}
                            required={true}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            nameOverride={"Description"}
                            name={"description"}
                            data={application && application.description && application.description}
                            type={"text"}
                            id={"descriptionInput"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"public"}
                            id={"publicInput"}
                            data={application && application.public && application.public}
                            nameOverride={"Public (uuid)"}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            nameOverride={"Secret (uuid)"}
                            name={"secret"}
                            data={application && application.secret && application.secret}
                            type={"password"}
                            id={"secretInput"}
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <GenericInputComponent
                            type={"text"}
                            name={"resource"}
                            id={"resourceInput"}
                            data={application && application.resource !== null ? application.resource : null}
                            nameOverride={"Resource (uri resource object)"}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        }}
      />
    </form >
  );
}
