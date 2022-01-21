import * as React from "react";
import { Table, Modal, Spinner, Card, Alert, Tabs, Accordion } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import FlashMessage from 'react-flash-message';

export default function LogTable({ id = null }) {
  const [context, setContext] = React.useState(null);
  const [logs, setLogs] = React.useState([
    {
      id: '12-34',
      type: 'in',
      callId: 'dc7ce044-e674-46b0-b8e2-089c66ab1b68',
      routeName: '/api/weer',
      requestMethod: 'POST',
      responseStatus: 'HTTP_CREATED',
      responseStatusCode: 201,
      responseTime: 8,
      requestPathInfo: '/api/weer',
      requestLanguages: "content type?",
      responseContent: "{'test': 'abc'}",
      requestContent: "{'test': 'abc'}"
    }]);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);


  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getLogs();
    }
  }, [context]);

  const getLogs = () => {
    setShowSpinner(true);
    let url = '/logs?order[dateCreated]=desc';
    if (id !== null) {
      url = `/logs?entity.id=${id}&order[dateCreated]=desc`
    }
    fetch(context.adminUrl + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        console.log(data);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setLogs(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (
    <>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
        </FlashMessage>
      }
      <Card
        title="Call logs"
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-toggle="modal"
                data-target="helpModal"
              >
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <a className="utrecht-link" onClick={getLogs}>
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
                          headerName: "Type",
                          field: "type",
                          renderCell: (item) => {
                            return (
                              <span>{item.type === 'in' ? 'Incoming' : 'Outcoming'}</span>
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
                          headerName: "Status",
                          field: "responseStatusCode",
                          renderCell: (item) => {
                            return (
                              <b style={{ color: item.responseStatusCode > 199 && item.responseStatusCode < 300 ? 'limegreen' : 'red' }}>{item.responseStatusCode} <i style={{ color: 'limegreen' }} className="fas fa-circle"></i></b>
                            );
                          },
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
                                  More info
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
                      rows={[{ status: 'No results found' }]}
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
              return (<>
                <Tabs
                  items={[
                    { name: "General", id: "logGeneral", active: true },
                    { name: "Request", id: "logRequest" },
                    { name: "Response", id: "logResponse", },
                  ]}
                />
                <div className="tab-content">
                  <div
                    className="tab-pane active"
                    id="logGeneral"
                    role="tabpanel"
                    aria-labelledby="logGeneral-tab"
                  >
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-3">Type: {log.type === 'in' ? 'Incoming' : 'Outcoming'}</h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-1">Call id: {log.callId && log.callId}</h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-1">Reponse time: {log.responseTime && log.responseTime} seconds</h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-1">Route: {log.routeName && log.routeName}</h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-1">Status: {log.requestStatus && log.requestStatus} <b style={{ color: log.responseStatusCode > 199 && log.responseStatusCode < 300 ? 'limegreen' : 'red' }}>{log.responseStatusCode} <i style={{ color: 'limegreen' }} className="fas fa-circle"></i></b></h5>
                    <Accordion id="logGeneralAccordion"
                      items={[
                        {
                          title: "Session",
                          id: "logRequestSession",
                          render: function () {
                            return (<>
                              {log.session && <h5 className="utrecht-heading-5 utrecht-heading-5--distanced">Session: {log.session && log.session}</h5>}
                              {log.sessionValues ? JSON.stringify(log.sessionValues) : <p className="utrecht-paragraph">No session values found</p>}
                            </>)
                          }
                        }]} />
                  </div>
                  <div
                    className="tab-pane"
                    id="logRequest"
                    role="tabpanel"
                    aria-labelledby="logRequest-tab"
                  >
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-3">Method: {log.requestMethod && log.requestMethod}</h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-1">Path info: {log.requestPathInfo && log.requestPathInfo}</h5>
                    <h5 className="utrecht-heading-5 utrecht-heading-5--distanced mt-1">Languages: {log.requestLanguages && log.requestLanguages}</h5>
                    <Accordion id="logRequestAccordion"
                      items={[
                        {
                          title: "Headers",
                          id: "logRequestHeaders",
                          render: function () {
                            return (<>
                              {log.requestHeaders ? JSON.stringify(log.requestHeaders) : <p className="utrecht-paragraph">No headers found</p>}
                            </>)
                          }
                        },
                        {
                          title: "Query paramaters",
                          id: "logRequestQueryparamters",
                          render: function () {
                            return (<>
                              {log.requestQuery ? JSON.stringify(log.requestQuery) : <p className="utrecht-paragraph">No parameters found</p>}
                            </>)
                          }
                        },
                        {
                          title: "Content",
                          id: "logRequestContent",
                          render: function () {
                            return (<>
                              {log.requestContent
                                ?
                                <pre style={{ 'backgroundColor': 'black', 'overflowWrap': 'break-word' }}>
                                  <code id="requestContent" style={{ color: 'orange' }} className="language-json">
                                    {log.requestContent}
                                  </code>
                                </pre>
                                :
                                <p className="utrecht-paragraph">No content found</p>}
                            </>)
                          }
                        }]}
                    />
                  </div>
                  <div
                    className="tab-pane"
                    id="logResponse"
                    role="tabpanel"
                    aria-labelledby="logResponse-tab"
                  >

                    <Accordion id="logResponseAccordion"
                      items={[
                        {
                          title: "Headers",
                          id: "logResponseHeaders",
                          render: function () {
                            return (<>
                              {log.responseHeaders ? JSON.stringify(log.responseHeaders) : <p className="utrecht-paragraph">No headers found</p>}
                            </>)
                          }
                        },
                        {
                          title: "Content",
                          id: "logResponseContent",
                          render: function () {
                            return (<>
                              {log.responseContent ? 
                                <pre style={{ 'backgroundColor': 'black', 'overflowWrap': 'break-word' }}>
                                  <code id="responseContent" style={{ color: 'orange' }} className="language-json">
                                    {log.responseContent}
                                  </code>
                                </pre> : <p className="utrecht-paragraph">No content found</p>}
                            </>)
                          }
                        }]}
                    />
                  </div>
                </div></>
              );
            }}
          />
        ))}
    </>
  );
}
