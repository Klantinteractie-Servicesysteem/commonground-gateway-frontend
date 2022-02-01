import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs, Modal } from "@conductionnl/nl-design-system/lib";
import LogTable from "../components/logs/logTable/logTable";
import { getUser, isLoggedIn } from "../services/auth";

const IndexPage = () => {

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      let button = document.getElementById('welcomeModalButton');
      if (button != null) {
        button.click();
      }
    }
  }, [])

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
        data-bs-target={`#welkomModal`}
        style={{ display: 'none' }}
        id="welcomeModalButton"
      >
        More info
      </button>
      <Modal title={'Welkom'} id='welkomModal' body={() => {
        return <>
          Welkom op de gateway ui!
        </>
      }} />
    </Layout >
  );
};

export default IndexPage;
