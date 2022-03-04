import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/endpointForm";
import HandlersTable from "../../components/handlers/handlerTable";
import LogTable from "../../components/logs/logTable/logTable";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export const IndexPage = (props) => {
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId;
  const activeTab: string = props.location.state.activeTab;
  const API: APIService = React.useContext(APIContext);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    handleSetLogs();
  }, [API]);

  const handleSetLogs = (): void => {
    API.Log.getAllFromEndpoint(endpointId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Endpoint Logs error: ${err}`);
      });
  };

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            {endpointId && (
              <Tabs
                items={[
                  {
                    name: "Overview",
                    id: "overview",
                    active: activeTab !== "handlers"
                  },
                  {
                    name: "Handlers",
                    id: "handlers",
                    active: activeTab === "handlers"
                  },
                  {
                    name: "Logs",
                    id: "logs"
                  }
                ]}
              />
            )}
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
              <LogTable {...{ logs }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
