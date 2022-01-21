import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs, GenericInputComponent, Spinner, Alert } from "@conductionnl/nl-design-system/lib";
import ResponseTable from "../components/logs/responseTable";
import RequestTable from "../components/logs/requestTable";
import LogTable from "../components/logs/logTable";
import { setUser, getUser, isLoggedIn } from "../services/auth";
import { navigate } from "gatsby-link";
import {
  download,
} from "../components/utility/DocumentDownload";
import FlashMessage from 'react-flash-message';

const IndexPage = () => {
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    console.log(process.env.GATSBY_API_URL);
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: process.env.GATSBY_API_URL,
        adminUrl:process.env.GATSBY_ADMIN_URL,
        frontendUrl: process.env.GATSBY_FRONTEND_URL,
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
        if (data.type === 'error') {
          setAlert(null);
          setAlert({ type: 'danger', message: data.message });
        }
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
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
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
      setAlert(null);
      setAlert({ type: 'danger', message: error.message });
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
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
        </FlashMessage>
      }
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
                  name: "Incoming calls",
                  id: "incomingcalls",
                },
                {
                  name: "Outgoing calls",
                  id: "outgoingcalls",
                },
                {
                  name: "Logs (new)",
                  id: "logs",
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
              className="tab-pane"
              id="incomingcalls"
              role="tabpanel"
              aria-labelledby="incomingcalls-tab"
            >
              <br />
              <RequestTable />
            </div>
            <div
              className="tab-pane "
              id="outgoingcalls"
              role="tabpanel"
              aria-labelledby="outgoingcalls-tab"
            >
              <br />
              <ResponseTable />
            </div>
            <div
              className="tab-pane "
              id="logs"
              role="tabpanel"
              aria-labelledby="logs-tab"
            >
              <br />
              <LogTable />
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
