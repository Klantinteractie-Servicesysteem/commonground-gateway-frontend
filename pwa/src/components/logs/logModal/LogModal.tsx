import * as React from "react";
import { Accordion, Modal, Tabs } from "@conductionnl/nl-design-system";
import { Link, navigate } from "gatsby";
import CodeBlock from "../../common/codeBlock/codeBlock";
import { StatusCode } from "../logTable/logTable";
import msToSeconds from "../../../services/msToSeconds";

interface LogModalProps {
  log: any;
}

const LogModal: React.FC<LogModalProps> = ({ log }) => {
  const [requestCodeLanguage, setRequestCodeLanguage] = React.useState(null);
  const [responseCodeLanguage, setResponseCodeLanguage] = React.useState(null);

  React.useEffect(() => {
    log?.requestHeaders?.accept && setRequestCodeLanguage(getCodeLanguage(log?.requestHeaders?.accept[0]));
    log?.requestHeaders['content-type'] && setResponseCodeLanguage(getCodeLanguage(log?.requestHeaders['content-type'][0]));
  }, [log]);

  const getCodeLanguage = (header: string) => {
    if (header === 'application/form.io') {
      return 'json'
    } 
    
    return header.replace('application/', '')
  };


  return (<>

    <Modal
      key={log.id}
      title={"Call log"}
      id={`logs${log.id}`}
      body={function() {
        return (
          <>
            <Tabs
              items={[
                { name: "General", id: "logGeneral", active: true },
                { name: "Request", id: "logRequest" },
                { name: "Response", id: "logResponse" }
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
                    <td>{log && `${log.responseTime}ms (${msToSeconds(log.responseTime)}s)`}</td>
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
                      render: function() {
                        return (
                          <>
                            {log.session && (
                              <h5 className="utrecht-heading-5 utrecht-heading-5--distanced">
                                Session: {log.session && log.session}
                              </h5>
                            )}
                            {log.sessionValues ? (
                              <CodeBlock
                              code={JSON.stringify(log.sessionValues, null, 4)}
                                language="json"
                              />
                            ) : (
                              <p className="utrecht-paragraph">
                                No session values found
                              </p>
                            )}
                          </>
                        );
                      },
                      backgroundColor: "#272822"
                    }
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
                      render: function() {
                        return (
                          <>
                          {log.requestHeaders ? (
                            <CodeBlock
                            code={JSON.stringify(log.requestHeaders, null, 4)}
                              language="json"
                            />
                          ) : (
                              <p className="utrecht-paragraph">
                                No headers found
                              </p>
                            )}
                          </>
                        );
                      },
                      backgroundColor: "#272822"
                    },
                    {
                      title: "Query parameters",
                      id: "logRequestQueryparamters",
                      render: function() {
                        return (
                          <>
                            {log.requestQuery ? (
                            <CodeBlock
                            code={JSON.stringify(log.requestQuery, null, 4)}
                              language="json"
                            />
                            ) : (
                              <p className="utrecht-paragraph">
                                No parameters found
                              </p>
                            )}
                          </>
                        );
                      },
                      backgroundColor: "#272822"
                    },
                    {
                      title: "Content",
                      id: "logRequestContent",
                      render: function() {
                        return (
                          <>
                            {log.requestContent && requestCodeLanguage ? (
                              <CodeBlock
                              code={responseCodeLanguage === 'json' ? JSON.stringify(JSON.parse(log.requestContent), null, 4) : log.requestContent}
                                language={requestCodeLanguage}
                              />
                            ) : (
                              <p className="utrecht-paragraph">
                                No content found
                              </p>
                            )}
                          </>
                        );
                            },
                            backgroundColor: "#272822"
                    }
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
                      render: function() {
                        return (
                          <>
                            {log.responseHeaders ? (
                              <CodeBlock
                              code={JSON.stringify(log.responseHeaders, null, 4)}
                                language="json"
                              />
                            ) : (
                              <p className="utrecht-paragraph">
                                No headers found
                              </p>
                            )}
                          </>
                        );
                      },
                      backgroundColor: "#272822"
                    },
                    {
                      title: "Content",
                      id: "logResponseContent",
                      render: function() {
                        return (
                          <>
                            {log.responseContent && responseCodeLanguage ? (
                              <CodeBlock
                              code={responseCodeLanguage === 'json' ? JSON.stringify(JSON.parse(log.responseContent), null, 4) : log.responseContent}
                                language={responseCodeLanguage}
                              />
                            ) : (
                              <p className="utrecht-paragraph">
                                No content found
                              </p>
                            )}
                          </>
                        );
                      },
                      backgroundColor: "#272822"
                    }
                  ]}
                />
              </div>
            </div>
          </>
        );
      }}
    />
  </>);
};

export default LogModal;
