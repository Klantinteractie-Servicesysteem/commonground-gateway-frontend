import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import EndpointForm from "../../components/endpoints/endpointForm";
import HandlersTable from "../../components/handlers/handlerTable";
import LogTable from "../../components/logs/logTable/logTable";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Card, Modal } from "@conductionnl/nl-design-system/lib";
import { AlertContext } from "../../context/alertContext";
import Spinner from "../../components/common/spinner";

export const IndexPage = (props) => {
  const endpointId: string = props.params.endpointId === "new" ? null : props.params.endpointId;
  const [logsDocumentation, setLogsDocumentation] = React.useState<string>(null);
  const activeTab: string = props.location.state.activeTab;
  const API: APIService = React.useContext(APIContext);
  const [logs, setLogs] = React.useState([]);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [_, setAlert] = React.useContext(AlertContext);

  React.useEffect(() => {
    handleSetLogs();
  }, [API]);

  const handleSetLogs = (): void => {
    setShowSpinner(true);

    API.Log.getAllFromEndpoint(endpointId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Endpoint Logs error: ${err}`);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  const handleSetLogsDocumentation = (): void => {
    API.Documentation.get("logs")
      .then((res) => {
        setLogsDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error(`GET Logs documentation error: ${err}`);
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
                    active: activeTab !== "handlers",
                  },
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

              <Card
                title="Endpoint Logs"
                cardHeader={() => (
                  <>
                    <button
                      className="utrecht-link button-no-style"
                      data-bs-toggle="modal"
                      data-bs-target="#logsHelpModal"
                      onClick={()=>{!logsDocumentation && handleSetLogsDocumentation()}}
                    >
                      <i className="fas fa-question mr-1" />
                      <span className="mr-2">Help</span>
                    </button>
                    <Modal
                      title="Logs Documentation"
                      id="logsHelpModal"
                      body={() =>
                        logsDocumentation ? (
                          <div dangerouslySetInnerHTML={{ __html: logsDocumentation }} />
                        ) : (
                          <Spinner />
                        )
                      }
                    />
                    <a className="utrecht-link" onClick={handleSetLogs}>
                      <i className="fas fa-sync-alt mr-1" />
                      <span className="mr-2">Refresh</span>
                    </a>
                  </>
                )}
                cardBody={() => (showSpinner ? <Spinner /> : <LogTable logs={logs} />)}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
