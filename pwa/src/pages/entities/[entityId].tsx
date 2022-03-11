import * as React from "react";
import AttributeTable from "../../components/attributes/attributeTable";
import ObjectEntitiesTable from "../../components/objectEntities/ObjectEntitiesTable";
import EntityForm from "../../components/entities/entityForm";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import LogTable from "../../components/logs/logTable/logTable";
import SubscribersTable from "../../components/subscribers/subscribersTable";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { Card, Modal } from "@conductionnl/nl-design-system";
import Spinner from "../../components/common/spinner";

const IndexPage = (props) => {
  const entityId: string = props.params.entityId === "new" ? null : props.params.entityId;
  const activeTab: string = props.location.state.activeTab;
  const API: APIService = React.useContext(APIContext);
  const [logs, setLogs] = React.useState([]);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [_, setAlert] = React.useContext(AlertContext);
  const [logsDocumentation, setLogsDocumentation] = React.useState<string>(null);

  React.useEffect(() => {
    handleSetLogs();
  }, [API]);

  const handleSetLogs = (): void => {
    setShowSpinner(true);

    API.Log.getAllFromEntity(entityId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Entity error: ${err}`);
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
            {entityId && (
              <Tabs
                items={[
                  {
                    name: "Overview",
                    id: "overview",
                    active: !activeTab,
                  },
                  {
                    name: "Attributes",
                    id: "attributes",
                    active: activeTab === "attributes",
                  },
                  {
                    name: "Objects",
                    id: "data",
                    active: activeTab === "objects",
                  },
                  {
                    name: "Subscribers",
                    id: "subscribers",
                    active: activeTab === "subscribers",
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
              <EntityForm {...{ entityId }} />
            </div>
            <div
              className={`tab-pane ${activeTab === "attributes" && "active"}`}
              id="attributes"
              role="tabpanel"
              aria-labelledby="attributes-tab"
            >
              <br />
              <AttributeTable {...{ entityId }} />
            </div>
            <div
              className={`tab-pane ${activeTab === "objects" && "active"}`}
              id="data"
              role="tabpanel"
              aria-labelledby="data-tab"
            >
              <br />
              <ObjectEntitiesTable {...{ entityId }} />
            </div>
            <div
              className={`tab-pane ${activeTab === "subscribers" && "active"}`}
              id="subscribers"
              role="tabpanel"
              aria-labelledby="subscribers-tab"
            >
              <br />
              <SubscribersTable {...{ entityId }} />
            </div>
            <div className="tab-pane" id="logs" role="tabpanel" aria-labelledby="logs-tab">
              <br />
              <Card
                title="Object type Logs"
                cardHeader={() => (
                  <>
                    <button
                      className="utrecht-link button-no-style"
                      data-bs-toggle="modal"
                      data-bs-target="#logsHelpModal"
                      onClick={handleSetLogsDocumentation}
                    >
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
                      <i className="fas fa-question mr-1" />
                      <span className="mr-2">Help</span>
                    </button>
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
