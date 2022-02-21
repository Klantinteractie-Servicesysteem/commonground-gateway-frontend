import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/endpointForm";
import HandlersTable from "../../components/handlers/handlerTable";
import LogTable from "../../components/logs/logTable/logTable";

const IndexPage = (props) => {
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {props.params.id !== "new" ? (
              <Tabs
                items={[
                  { name: "Overview", id: "overview", active: true },
                  {
                    name: "Handlers",
                    id: "handlers"
                  },
                  {
                    name: "Logs",
                    id: "logs"
                  }
                ]}
              />
            ) : (
              <Tabs
                items={[{ name: "Overview", id: "overview", active: true },
                  {
                    name: "Logs",
                    id: "logs"
                  }]}
              />
            )}
          </div>
          <div className="tab-content">
            <div
              className="tab-pane active"
              id="overview"
              role="tabpanel"
              aria-labelledby="overview-tab"
            >
              <br />
              <EndpointForm {...{ endpointId }} />
            </div>
            <div
              className="tab-pane"
              id="handlers"
              role="tabpanel"
              aria-labelledby="handlers-tab"
            >
              <br />
              <HandlersTable {...{ endpointId }} />
            </div>
            <div
              className="tab-pane"
              id="logs"
              role="tabpanel"
              aria-labelledby="logs-tab"
            >
              <br />
              <LogTable />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
