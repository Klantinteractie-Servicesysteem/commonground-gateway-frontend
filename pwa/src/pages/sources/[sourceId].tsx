import * as React from "react";
import { Tabs } from "@conductionnl/nl-design-system/lib/Tabs/src/tabs";
import SourceForm from "../../components/sources/sourceForm";
import LogTable from "../../components/logs/logTable/logTable";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { Card, Modal } from "@conductionnl/nl-design-system";
import Spinner from "../../components/common/spinner";
import { AlertContext } from "../../context/alertContext";

const IndexPage = (props) => {
  const sourceId: string = props.params.sourceId === "new" ? null : props.params.sourceId;
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

    API.Log.getAllFromSource(sourceId)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        throw new Error(`GET Source Logs error: ${err}`);
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
            {sourceId && (
              <Tabs
                tabs={[
                  {
                    name: "Overview",
                    id: "overview",
                    active: true,
                  },
                  {
                    name: "Logs",
                    id: "logs",
                  },
                ]}
              />
            )}
            <div className="tab-content">
              <div className="tab-pane active" id="overview" role="tabpanel" aria-labelledby="overview-tab">
                <br />
                <SourceForm {...{ sourceId }} />
              </div>
              <div className="tab-pane" id="logs" role="tabpanel" aria-labelledby="logs-tab">
                <br />
                <Card
                  title="Source Logs"
                  cardHeader={() => (
                    <>
                      <button
                        className="utrecht-link button-no-style"
                        data-bs-toggle="modal"
                        data-bs-target="#logsHelpModal"
                        onClick={handleSetLogsDocumentation}
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
      </div>
    </main>
  );
};

export default IndexPage;
