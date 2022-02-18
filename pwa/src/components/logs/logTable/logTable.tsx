import * as React from "react";
import "./logTable.css";
import {
  Table,
  Modal,
  Spinner,
  Card,
  Tabs,
  Accordion,
} from "@conductionnl/nl-design-system/lib";
import log from "../../../dummy_data/logs";
import CodeBlock from "../../common/codeBlock/codeBlock";
import { navigate, Link } from "gatsby";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

interface LogTableProps {
  entityId?: string;
  endpointId?: string;
}

export const LogTable: React.FC<LogTableProps> = ({ entityId,endpointId }) => {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [logs, setLogs] = React.useState([log]);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    handleSetLogs();
  }, [API, entityId,endpointId]);

  const handleSetLogs = () => {
    setShowSpinner(true);
  };

  React.useEffect(() => {
    handleSetDocumentation();
  }, [API]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });

    if (entityId) {
      API.Log.getAllFromEntity(entityId)
        .then((res) => {
          setLogs(res.data);
        })
        .catch((err) => {
          throw new Error("GET logs for entity error: " + err);
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
    if (!endpointId && !entityId) {
      API.Log.getAll()
        .then((res) => {
          res?.data.length > 0 ? setLogs(res.data) : setLogs([log]);
        })
        .catch((err) => {
          throw new Error("GET logs error: " + err);
        })
        .finally(() => {
          setShowSpinner(false);
        });
    }
  };

  return (
    <div className="logTable">
      <Card
        title="Call logs"
        cardHeader={function () {
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
                          },
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
                          },
                        },
                        {
                          headerName: "Method",
                          field: "requestMethod",
                        },
                        {
                          headerName: "Response time (seconds)",
                          field: "responseTime",
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
                          },
                        },
                      ]}
                      rows={logs}
                    />
                  ) : (
                    <Table
                      columns={[
                        {
                          headerName: "Status",
                          field: "status",
                        },
                        {
                          headerName: "Status Code",
                          field: "statusCode",
                        },
                        {
                          headerName: "Method",
                          field: "method",
                        },
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
        logs.map((log, idx) => (
          <Modal
            key={idx}
            title={"Call log"}
            id={`logs${log.id}`}
            body={function () {
              return (
                <>
                  <Tabs
                    items={[
                      { name: "General", id: "logGeneral", active: true },
                      { name: "Request", id: "logRequest" },
                      { name: "Response", id: "logResponse" },
                    ]}
                  />
                  <div className="tab-content">
                    <div
                      className="tab-pane active"
                      id="logGeneral"
                      role="tabpanel"
                      aria-labelledby="logGeneral-tab"
                    >
                      <table className="mt-3 logTable-table">
                        <tr>
                          <th>Status</th>
                          <td>
                            <StatusCode
                              code={log?.responseStatusCode}
                              message={log?.responseStatus}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Type</th>
                          <td>
                            {log?.type === "in" ? "Incoming" : "Outcoming"}
                          </td>
                        </tr>
                        <tr>
                          <th>Call ID</th>
                          <td>{log?.callId}</td>
                        </tr>
                        <tr>
                          <th>Response time</th>
                          <td>{log?.responseTime.toString() + " seconds"}</td>
                        </tr>
                        <tr>
                          <th>Route</th>
                          <td>{log?.routeName}</td>
                        </tr>
                        <tr>
                          <th>Endpoint</th>
                          <td>
                            <Link
                              to={"/endpoints/" + log?.id}
                              type="button"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => {
                                navigate("/endpoints/" + log?.id);
                              }}
                            >
                              {log?.endpoint?.name}
                            </Link>
                          </td>
                        </tr>
                      </table>

                      <Accordion
                        id="logGeneralAccordion"
                        items={[
                          {
                            title: "Session",
                            id: "logRequestSession",
                            render: function () {
                              return (
                                <>
                                  {log.session && (
                                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced">
                                      Session: {log.session && log.session}
                                    </h5>
                                  )}
                                  {log.sessionValues ? (
                                    JSON.stringify(log.sessionValues)
                                  ) : (
                                    <p className="utrecht-paragraph">
                                      No session values found
                                    </p>
                                  )}
                                </>
                              );
                            },
                          },
                        ]}
                      />
                    </div>
                    <div
                      className="tab-pane"
                      id="logRequest"
                      role="tabpanel"
                      aria-labelledby="logRequest-tab"
                    >
                      <table className="mt-3 logTable-table">
                        <tr>
                          <th>Method</th>
                          <td>{log?.requestMethod}</td>
                        </tr>
                        <tr>
                          <th>Path info</th>
                          <td>{log?.requestPathInfo}</td>
                        </tr>
                        <tr>
                          <th>Languages</th>
                          <td>{log?.requestLanguages}</td>
                        </tr>
                      </table>
                      <Accordion
                        id="logRequestAccordion"
                        items={[
                          {
                            title: "Headers",
                            id: "logRequestHeaders",
                            render: function () {
                              return (
                                <>
                                  {log.requestHeaders ? (
                                    JSON.stringify(log.requestHeaders)
                                  ) : (
                                    <p className="utrecht-paragraph">
                                      No headers found
                                    </p>
                                  )}
                                </>
                              );
                            },
                          },
                          {
                            title: "Query paramaters",
                            id: "logRequestQueryparamters",
                            render: function () {
                              return (
                                <>
                                  {log.requestQuery ? (
                                    JSON.stringify(log.requestQuery)
                                  ) : (
                                    <p className="utrecht-paragraph">
                                      No parameters found
                                    </p>
                                  )}
                                </>
                              );
                            },
                          },
                          {
                            title: "Content",
                            id: "logRequestContent",
                            render: function () {
                              return (
                                <>
                                  {log.requestContent ? (
                                    <CodeBlock
                                      code={log.requestContent}
                                      language="json"
                                    />
                                  ) : (
                                    <p className="utrecht-paragraph">
                                      No content found
                                    </p>
                                  )}
                                </>
                              );
                            },
                            backgroundColor: "black",
                          },
                        ]}
                      />
                    </div>
                    <div
                      className="tab-pane"
                      id="logResponse"
                      role="tabpanel"
                      aria-labelledby="logResponse-tab"
                    >
                      <Accordion
                        id="logResponseAccordion"
                        items={[
                          {
                            title: "Headers",
                            id: "logResponseHeaders",
                            render: function () {
                              return (
                                <>
                                  {log.responseHeaders ? (
                                    JSON.stringify(log.responseHeaders)
                                  ) : (
                                    <p className="utrecht-paragraph">
                                      No headers found
                                    </p>
                                  )}
                                </>
                              );
                            },
                          },
                          {
                            title: "Content",
                            id: "logResponseContent",
                            render: function () {
                              return (
                                <>
                                  {log.responseContent ? (
                                    <CodeBlock
                                      code={log.responseContent}
                                      language="json"
                                    />
                                  ) : (
                                    <p className="utrecht-paragraph">
                                      No content found
                                    </p>
                                  )}
                                </>
                              );
                            },
                            backgroundColor: "black",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </>
              );
            }}
          />
        ))}
    </div>
  );
};

interface StatusCodeProps {
  code: number;
  message: string | null;
}

const StatusCode: React.FC<StatusCodeProps> = ({ code, message = null }) => {
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
