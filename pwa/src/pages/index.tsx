import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import ResponseTable from "../components/logs/responseTable";
import RequestTable from "../components/logs/requestTable";
import { setUser, getUser, isLoggedIn } from "../services/auth";
import { navigate } from "gatsby-link";
import { Card } from "@conductionnl/nl-design-system";

const IndexPage = () => {
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
        adminUrl: window.GATSBY_ADMIN_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
      });
    }
  }, [context]);

  const login = (event) => {
    event.preventDefault();

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
        console.log("User:", data);
        if (typeof window !== "undefined") {
          let result = {
            username: data.username,
          };
          setUser(result);
          sessionStorage.setItem("jwt", data.jwtToken);
          sessionStorage.setItem("user", JSON.stringify(result));
          navigate("/");
        }
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
              <a href={`${context.adminUrl}/export/all`} target="_blank">
                <button className="utrecht-button" type="button">
                  Export Configuration
                </button>
              </a>
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
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <span className="utrecht-form-label mb-2">Username</span>
                <input
                  className="utrecht-textbox utrecht-textbox--html-input"
                  name="username"
                  id="usernameInput"
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <div className="form-group">
                <span className="utrecht-form-label">Password</span>
                <input
                  className="utrecht-textbox utrecht-textbox--html-input"
                  type="password"
                  name="password"
                  id="passwordInput"
                />
              </div>

              <a className="utrecht-link" onClick={login}>
                <button className="utrecht-button utrecht-button-sm btn-sm btn-primary">
                  <i className="fas fa-sign-in-alt mr-2" />
                  Login
                </button>
              </a>
            </div>
          </div>
        </form>
      )}
    </Layout>
  );
};

export default IndexPage;
