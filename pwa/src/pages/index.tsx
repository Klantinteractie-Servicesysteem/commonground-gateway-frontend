import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs, GenericInputComponent, Spinner } from "@conductionnl/nl-design-system/lib";
import ResponseTable from "../components/logs/responseTable";
import RequestTable from "../components/logs/requestTable";
import { setUser, getUser, isLoggedIn } from "../services/auth";
import { navigate } from "gatsby-link";
import {
  documentDownload,
  download,
} from "../components/utility/DocumentDownload";

const IndexPage = () => {
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
        adminUrl: window.GATSBY_ADMIN_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
      });
    }
  }, [context]);

  const login = (event: any) => {
    event.preventDefault();
    setShowSpinner(true);

    let usernameInput = document.getElementById(
      "usernameInput"
    ) as HTMLInputElement;
    let passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;

    let body = {
      username: usernameInput.value ? usernameInput.value : null,
      password: passwordInput.value ? passwordInput.value : null,
    };

    fetch(`${context.apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        host: context.frontendUrl,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        let result = {
          username: data.username,
        };
        setUser(result);
        sessionStorage.setItem("jwt", data.jwtToken);
        sessionStorage.setItem("user", JSON.stringify(result));
        navigate('/')
      }).catch((error) => {
        setShowSpinner(false);
        console.log(error);
      });
  };

  const handleExport = () => {
    fetch(`${context.adminUrl}/export/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    }).then((response) => {
      response.text().then(function (text) {
        download("export.yaml", text, "text/yaml");
      });
    }).catch((error) => {
      console.log('Error:', error)

    });
  };

  return (
    <Layout
      title={"Dashboard"}
      subtext={
        isLoggedIn()
          ? `Welcome ${getUser().username}, to the gateway admin dashboard`
          : `Welcome to the gateway admin dashboard`
      }
    >
      {isLoggedIn() && context !== null ? (
        <>
          <div className="page-top-item">
            <Tabs
              items={[
                {
                  name: "Overview",
                  id: "overview",
                  active: true,
                },
                {
                  name: "Response logs",
                  id: "response",
                },
                {
                  name: "Request logs",
                  id: "request",
                },
              ]}
            />
          </div>

          <div className="tab-content">
            <div
              className="tab-pane active"
              id="overview"
              role="tabpanel"
              aria-labelledby="main-tab"
            >
              <br />
              <button
                className="utrecht-button"
                type="button"
                onClick={handleExport}
              >
                Export Configuration
              </button>
            </div>
            <div
              className="tab-pane "
              id="response"
              role="tabpanel"
              aria-labelledby="main-tab"
            >
              <br />
              <ResponseTable />
            </div>
            <div
              className="tab-pane"
              id="request"
              role="tabpanel"
              aria-labelledby="attributes-tab"
            >
              <br />
              <RequestTable />
            </div>
          </div>
        </>
      ) : (
        <form id="dataForm" onSubmit={login}>
          {
            showSpinner === true ?
              <Spinner /> :
              <>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <GenericInputComponent
                        type={"text"}
                        name={"username"}
                        id={"usernameInput"}
                        nameOverride={"Username"}
                        required={true} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <GenericInputComponent
                        type={"password"}
                        name={"password"}
                        id={"passwordInput"}
                        nameOverride={"Password"}
                        required={true}
                        togglePassword={true}
                        eyeLeft="92%"
                        eyeTop="-27px" />
                      <button type="submit" className="utrecht-link utrecht-button utrecht-button-sm btn-sm btn-primary">
                        <i className="fas fa-sign-in-alt mr-2" />
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </>
          }
        </form >
      )}
    </Layout >
  );
};

export default IndexPage;
