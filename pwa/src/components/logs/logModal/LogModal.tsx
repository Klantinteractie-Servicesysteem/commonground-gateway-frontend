import * as React from "react";
import "./logModal.css";
import { Accordion, Modal, Tabs } from "@conductionnl/nl-design-system";
import { Link, navigate } from "gatsby";
import { CodeBlock, getCodeLanguage } from "../../common/codeBlock/codeBlock";
import msToSeconds from "../../../services/msToSeconds";
import LabelWithBackground from "../../LabelWithBackground/LabelWithBackground";
import LogTable from "../logTable/logTable";
import APIService from "../../../apiService/apiService";
import APIContext from "../../../apiService/apiContext";
import Spinner from "../../common/spinner";

interface LogModalProps {
  log: any;
}

const LogModal: React.FC<LogModalProps> = ({ log }) => {
  const API: APIService = React.useContext(APIContext);
  const [outgoingCallIdLog, setOutgoingCallIdLog] = React.useState(null);

  const handleSetOutgoingLogs = (): void => {
    API.Log.getAllOutgoingFromCallId(log.callId)
      .then((res) => {
        setOutgoingCallIdLog(res.data);
      })
      .catch((err) => {
        throw new Error(`GET all outgoing Logs from call id error: ${err}`);
      });
  };

  const [requestCodeLanguage, setRequestCodeLanguage] = React.useState(null);
  const [responseCodeLanguage, setResponseCodeLanguage] = React.useState(null);

  React.useEffect(() => {
    log.requestHeaders?.accept
      ? setRequestCodeLanguage(getCodeLanguage(log.requestHeaders?.accept[0]))
      : setRequestCodeLanguage("json");
    log.requestHeaders["content-type"] !== undefined
      ? setResponseCodeLanguage(getCodeLanguage(log.requestHeaders["content-type"][0]))
      : setRequestCodeLanguage("json");
  }, [log]);

  return (
    <div className="LogModal">
      <Modal
        key={log.id}
        title={"Call log"}
        id={`logs${log.id}`}
        body={function () {
          const statusClass = log.responseStatusCode
            ? log.responseStatusCode > 199 && log.responseStatusCode < 300
              ? "success"
              : "danger"
            : "danger";
          return (
            <>
              <Tabs
                tabs={[
                  { name: "General", id: `logGeneral${log.id}`, active: true },
                  { name: "Request", id: `logRequest${log.id}` },
                  { name: "Response", id: `logResponse${log.id}` },
                  { name: "Outgoing", id: `outgoing${log.id}`, onClick: handleSetOutgoingLogs },
                ]}
              />
              <div className="tab-content">
                <div
                  className="tab-pane active"
                  id={`logGeneral${log.id}`}
                  role="tabpanel"
                  aria-labelledby="logGeneral-tab"
                >
                  <table className="mt-3 logTable-table">
                    <tbody>
                      <tr>
                        <th>Status</th>
                        <td>
                          <LabelWithBackground label={log.responseStatusCode} type={statusClass} />
                        </td>
                      </tr>
                      <tr>
                        <th>Type</th>
                        <td>{log.type === "in" ? "Incoming" : "Outcoming"}</td>
                      </tr>
                      <tr>
                        <th>Call ID</th>
                        <td>
                          <Link
                            to={`/calls/${log.callId}`}
                            aria-label="Close"
                            type="button"
                            data-bs-dismiss="modal"
                            onClick={() => navigate(`/calls/${log.callId}`)}
                          >
                            {log.callId}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th>Session ID</th>
                        <td>
                          <Link
                            to={`/sessions/${log.session}`}
                            aria-label="Close"
                            type="button"
                            data-bs-dismiss="modal"
                            onClick={() => navigate(`/sessions/${log.session}`)}
                          >
                            {log.session}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th>Response time</th>
                        <td>{log && `${log.responseTime}ms (${msToSeconds(log.responseTime)}s)`}</td>
                      </tr>
                      <tr>
                        <th>{log.type === "out" ? "Source" : "Route"}</th>
                        <td>
                          {log.type === "out" ? (
                            <Link to={`/sources/${log.source.id}`}>{log.source.name}</Link>
                          ) : (
                            log.routeName
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Endpoint</th>
                        <td>
                          <Link
                            to={"/endpoints/" + log.id}
                            type="button"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                              navigate("/endpoints/" + log.id);
                            }}
                          >
                            {log.endpoint?.name}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th>Application</th>
                        <td>
                          {log.application ? (
                            <Link
                              to={"/applications/" + log?.id}
                              type="button"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => {
                                navigate("/applications/" + log?.id);
                              }}
                            >
                              {log?.application?.name}
                            </Link>
                          ) : (
                            "No application found"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>Date created</th>
                        <td>{new Date(log.createdAt).toLocaleString("nl-NL")}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Accordion
                    id="logGeneralAccordion"
                    items={[
                      {
                        title: "Session",
                        id: "logRequestSession",
                        backgroundColor: "black",
                        render: function () {
                          return (
                            <>
                              {log.sessionValues ? (
                                <CodeBlock code={JSON.stringify(log.sessionValues)} language="json" />
                              ) : (
                                <p className="utrecht-paragraph">No session values found</p>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </div>
                <div className="tab-pane" id={`logRequest${log.id}`} role="tabpanel" aria-labelledby="logRequest-tab">
                  <table className="mt-3 logTable-table">
                    <tbody>
                      <tr>
                        <th>Method</th>
                        <td>{log.requestMethod}</td>
                      </tr>
                      <tr>
                        <th>Path info</th>
                        <td>{log.requestPathInfo}</td>
                      </tr>
                      <tr>
                        <th>Languages</th>
                        <td>{log.requestLanguages}</td>
                      </tr>
                    </tbody>
                  </table>
                  <Accordion
                    id="logRequestAccordion"
                    items={[
                      {
                        title: "Headers",
                        id: "logRequestHeaders",
                        render: function () {
                          const logs = [];
                          for (const [key, value] of Object.entries(log.requestHeaders)) {
                            logs.push({ ...{ key, value } });
                          }
                          return (
                            <>
                              {log.requestHeaders ? (
                                <table className="mt-3 logTable-table">
                                  <tbody>
                                    {logs.map((log, idx) => {
                                      return (
                                        <tr key={log.key + idx}>
                                          <th>{log.key}</th>
                                          <td>{log.value}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="utrecht-paragraph">No headers found</p>
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "Query paramaters",
                        id: "logRequestQueryparamters",
                        render: function () {
                          const logs = [];
                          for (const [key, value] of Object.entries(log.requestQuery)) {
                            logs.push({ ...{ key, value } });
                          }
                          return (
                            <>
                              {log.requestQuery > 0 ? (
                                <table className="mt-3 logTable-table">
                                  <tbody>
                                    {logs.map((log, idx) => {
                                      return (
                                        <tr key={log.key + idx}>
                                          <th>{log.key}</th>
                                          <td>{log.value}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="utrecht-paragraph">No parameters found</p>
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "Content",
                        id: "logRequestContent",
                        backgroundColor: "#272822",
                        render: function () {
                          return (
                            <>
                              {log.requestContent ? (
                                <CodeBlock
                                  code={JSON.stringify(JSON.parse(log.requestContent), null, 4)}
                                  language={requestCodeLanguage}
                                />
                              ) : (
                                <p className="utrecht-paragraph text-white">No content found</p>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </div>
                <div className="tab-pane" id={`logResponse${log.id}`} role="tabpanel" aria-labelledby="logResponse-tab">
                  <Accordion
                    id="logResponseAccordion"
                    items={[
                      {
                        title: "Headers",
                        id: "logResponseHeaders",
                        render: function () {
                          const logs = [];
                          for (const [key, value] of Object.entries(log.responseHeaders)) {
                            logs.push({ ...{ key, value } });
                          }

                          return (
                            <>
                              {log.responseHeaders ? (
                                <table className="mt-3 logTable-table">
                                  <tbody>
                                    {logs.map((log, idx) => {
                                      return (
                                        <tr key={log.key + idx}>
                                          <th>{log.key}</th>
                                          <td>{log.value}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="utrecht-paragraph">No headers found</p>
                              )}
                            </>
                          );
                        },
                      },
                      {
                        title: "Content",
                        id: "logResponseContent",
                        backgroundColor: "#272822",
                        render: function () {
                          return (
                            <>
                              {log.responseContent ? (
                                <CodeBlock
                                  code={JSON.stringify(JSON.parse(log.responseContent), null, 4)}
                                  language={responseCodeLanguage}
                                />
                              ) : (
                                <p className="utrecht-paragraph text-white">No content found</p>
                              )}
                            </>
                          );
                        },
                      },
                    ]}
                  />
                </div>
                <div className="tab-pane" id={`outgoing${log.id}`} role="tabpanel" aria-labelledby="outgoing-tab">
                  <div className="mt-3">
                    {outgoingCallIdLog ? <LogTable logs={outgoingCallIdLog} modal={false} /> : <Spinner />}
                  </div>
                </div>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default LogModal;
