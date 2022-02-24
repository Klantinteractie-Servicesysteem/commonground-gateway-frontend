import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/endpointForm";
import HandlersTable from "../../components/handlers/handlerTable";
import LogTable from "../../components/logs/logTable/logTable";

export const IndexPage = (props) => {
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId;
  const activeTab: string = props.location.state.activeTab;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {
              endpointId && (
                <Tabs
                  items={[
                    { name: "Overview", id: "overview", active: activeTab !== "handlers" },
                    {
                      name: "Handlers",
                      id: "handlers",
                      active: activeTab === "handlers",
                    },
                    {
                      name: "Logs",
                      id: "logs",
                    },
                  ]}
                />
              )
            }
          </div>
          <div className="tab-content">
            <div
              className={`tab-pane ${!activeTab && "active"}`}
              id="overview"
              role="tabpanel"
              aria-labelledby="overview-tab"
            >
              <br />
              <EndpointForm {...{ endpointId }} />
            </div>
            <div
              className={`tab-pane ${activeTab === "handlers" && "active"}`}
              id="handlers"
              role="tabpanel"
              aria-labelledby="handlers-tab"
            >
              <br />
              <HandlersTable {...{ endpointId }} />
            </div>
            <div className="tab-pane" id="logs" role="tabpanel" aria-labelledby="logs-tab">
              <br />
              <LogTable {...{ endpointId }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
