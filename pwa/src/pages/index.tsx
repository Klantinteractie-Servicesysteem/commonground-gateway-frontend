import * as React from "react";
import Layout from "../components/common/layout";
import { Tabs } from "@conductionnl/nl-design-system/lib";
import LogTable from "../components/logs/logTable/logTable";
import { getUser, isLoggedIn } from "../services/auth";

const IndexPage = () => {

  return (
    <Layout
      title={"Dashboard"}
      subtext={
        isLoggedIn()
          ? `Welcome ${getUser().username}, to the gateway admin dashboard`
          : `Welcome to the gateway admin dashboard`
      }>
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
              aria-labelledby="logs-tab">
              <br />
              <LogTable />
            </div>
          </div>
        </>
      )}
    </Layout >
  );
};

export default IndexPage;
