import * as React from "react";
import "./logTable.css";
import {
  Table,
  Modal,
  Spinner,
  Card
} from "@conductionnl/nl-design-system/lib";
import log from "../../../dummy_data/logs";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import LogModal from "../logModal/LogModal";

interface LogTableProps {
  entityId?: string;
  endpointId?: string;
  sourceId?: string;
}

export const LogTable: React.FC<LogTableProps> = ({ entityId, sourceId, endpointId }) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [logs, setLogs] = React.useState(log);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetLogs()
    handleSetDocumentation()
  }, [API, entityId, endpointId, sourceId]);

  const handleSetLogs = () => {
    setShowSpinner(true);

     if (entityId) {
      API.Log.getAllFromEntity(entityId)
        .then((res) => {
          res.data.length && setLogs(res.data);
        })
        .catch((err) => {
          throw new Error("GET logs from entity error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }

    if (sourceId) {
      API.Log.getAllFromSource(sourceId)
        .then((res) => {
          res.data.length && setLogs(res.data);
        })
        .catch((err) => {
          throw new Error("GET logs from source error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }

    if (endpointId) {
      API.Log.getAllFromEndpoint(endpointId)
        .then((res) => {
          setLogs(res.data);
        })
        .catch((err) => {
          throw new Error("GET logs for endpoint error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }

    if (!entityId && !sourceId && !endpointId) {
      API.Log.getAll()
        .then((res) => {
          res.data.length && setLogs(res.data);
        })
        .catch((err) => {
          throw new Error("GET logs error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }
  };

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <div className="logTable">
      <Card
        title="Call logs"
        cardHeader={function() {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#LogEntityHelpModal"
              >
                <Modal
                  title="Logs Documentation"
                  id="LogEntityHelpModal"
                  body={() => (
                    <div dangerouslySetInnerHTML={{ __html: documentation }} />
                  )}
                />
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <a className="utrecht-link" onClick={handleSetLogs}>
                <i className="fas fa-sync-alt mr-1" />
                <span className="mr-2">Refresh</span>
              </a>
            </>
          );
        }}
        cardBody={() => {
          return (
            <>
              {showSpinner && <Spinner />}
              {showSpinner == false && (
                <>
                  {logs !== null && logs.length > 0 ? (
                    <Table
                      columns={[
                        {
                          headerName: "Status",
                          field: "responseStatusCode",
                          renderCell: (item) => {
                            return (
                              <StatusCode
                                code={item?.responseStatusCode}
                                message={item?.responseStatus}
                              />
                            );
                          }
                        },
                        {
                          headerName: "Type",
                          field: "type",
                          renderCell: (item) => {
                            return (
                              <span>
                                {item.type === "in" ? "Incoming" : "Outcoming"}
                              </span>
                            );
                          }
                        },
                        {
                          headerName: "Method",
                          field: "requestMethod"
                        },
                        {
                          headerName: "Response time (seconds)",
                          field: "responseTime"
                        },
                        {
                          field: "id",
                          headerName: " ",
                          renderCell: (item) => {
                            return (
                              <div className="float-right mr-4">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target={`#logs${item.id.replaceAll(
                                    "-",
                                    ""
                                  )}`}
                                >
                                  View log
                                </button>
                              </div>
                            );
                          }
                        }
                      ]}
                      rows={logs}
                    />
                  ) : (
                    <Table
                      columns={[
                        {
                          headerName: "Status",
                          field: "status"
                        },
                        {
                          headerName: "Status Code",
                          field: "statusCode"
                        },
                        {
                          headerName: "Method",
                          field: "method"
                        }
                      ]}
                      rows={[{ status: "No results found" }]}
                    />
                  )}
                </>
              )}
            </>
          );
        }}
      />
      {logs !== null &&
      logs?.map((log) => <LogModal log={log} />
      )}
    </div>
  );
};

interface StatusCodeProps {
  code: number;
  message: string | null;
}

export const StatusCode: React.FC<StatusCodeProps> = ({ code, message = null }) => {
  let statusColor: string;
  code > 199 && code < 300 ? (statusColor = "green") : (statusColor = "red");

  return (
    <span>
      <FontAwesomeIcon
        className={`logTable-statusCode--${statusColor} mr-2`}
        icon={faCircle}
      />
      {`${code} (${message})`}
    </span>
  );
};

export default LogTable;
