import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs, Modal } from "@conductionnl/nl-design-system/lib";
import LogTable from "../components/logs/logTable/logTable";
import { getUser, isLoggedIn } from "../services/auth";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { Link, navigate } from 'gatsby';

const IndexPage = () => {
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // ApplicationsCount gives error undefined API ?
      let appCount = 0;
      clickButton(appCount);
    }
  }, [API])

  const clickButton = (appCount) => {
    // button is null on refresh but not on internal refresh after code update ..
    let button = document.getElementById('welcomeModalButton');
    if (button == null) {
      button = document.getElementById('welcomeModalButton');
    }
    if (button != null && appCount == 0) {
      button.click();
    }
  }

  const ApplicationsCount = () => {
    API.Source.getAll()
      .then((res) => { return res.data.count() })
      .catch((err) => { throw new Error('GET applications error: ' + err) })
  };

  const navToApplications = () => {
    navigate('/applications/new');
  };

  const welcomeModalBody = () => {
    return <>
      <p>Welcome to the gateway user-interface.</p>
      <p>It seems you haven't created a application yet, would you like to
        <a className="utrecht--link" data-bs-dismiss="modal" aria-label="Close" onClick={navToApplications}> create an application </a>
        first or you can close this modal if you want to find things out yourself. </p>
    </>
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
      {isLoggedIn() && (
        <>
          <div className="page-top-item">
            <Tabs
              items={[
                {
                  name: "Logs",
                  id: "logs",
                  active: true,
                },
              ]}
            />
          </div>

          <div className="tab-content">
            <div
              className="tab-pane active"
              id="logs"
              role="tabpanel"
              aria-labelledby="logs-tab"
            >
              <br />
              <LogTable />
            </div>
          </div>
        </>
      )}
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#welcomeModal`}
        style={{ display: 'none' }}
        id="welcomeModalButton"
      >
        More info
      </button>
      <Modal title={'Hello!'} id='welcomeModal' body={welcomeModalBody} />
    </Layout >
  );
};

export default IndexPage;
