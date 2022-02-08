import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib";
import LogTable from "../components/logs/logTable/logTable";
import { isLoggedIn } from "../services/auth";

const IndexPage = () => {
  return (
      isLoggedIn() && (
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
      )
  );
};

export default IndexPage;
