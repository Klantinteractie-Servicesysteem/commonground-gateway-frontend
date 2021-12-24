import * as React from "react";
import { Table, Card, Spinner, Modal, Alert, Tabs, Accordion } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import FlashMessage from 'react-flash-message';

export default function ResponseTable({ id = null }) {
  const [context, setContext] = React.useState(null);
  const [responses, setResponse] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getResponses();
    }
  }, [context]);

  const getResponses = () => {
    setShowSpinner(true);
    let url = '/response_logs?order[dateCreated]=desc';
    if (id !== null) {
      url = `/response_logs?entity.id=${id}&order[dateCreated]=desc`;
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
          setResponse(data["hydra:member"]);
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
        title="Outgoing calls"
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
              <a className="utrecht-link" onClick={getResponses}>
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
                  {responses !== null && responses > 0 ? (
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
                                  data-bs-target={`#responseLogs${item.id.replaceAll(
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
                      rows={responses}
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

      {responses !== null &&
        responses.map((response) => (
          <Modal
            title={"Outgoing call"}
            id={`responseLogs${response.id}`}
            body={function () {
              return (<>
                <Tabs
                  items={[
                    { name: "Request", id: "outgoingRequest", active: true },
                    {
                      name: "Response", id: "outgoingResponse",
                    },
                  ]}
                />
                <div className="tab-content">
                  <div
                    className="tab-pane active"
                    id="outgoingRequest"
                    role="tabpanel"
                    aria-labelledby="outgoingRequest-tab"
                  >
                    <Accordion id="outgoingRequestAccordion"
                      items={[{
                        title: "Headers",
                        id: "outgoingRequestHeaders",
                        render: function () {
                          return (<>
                            {JSON.stringify(response.headers)}
                          </>)
                        }
                      },
                      {
                        title: "Query paramaters",
                        id: "outgoingRequestQueryparamters",
                        render: function () {
                          return (<>
                            {JSON.stringify(response.queryParams)}
                          </>)
                        }
                      },
                      {
                        title: "Session",
                        id: "outgoingRequestSession",
                        render: function () {
                          return (<>
                            Session
                          </>)
                        }
                      },
                      {
                        title: "Body",
                        id: "outgoingRequestBody",
                        render: function () {
                          return (<>
                            {JSON.stringify(response.requestBody)}
                          </>)
                        }
                      }]}
                    />
                  </div>
                  <div
                    className="tab-pane"
                    id="outgoingResponse"
                    role="tabpanel"
                    aria-labelledby="outgoingResponse-tab"
                  >
                    <Accordion id="outgoingResponseAccordion"
                      items={[{
                        title: "Headers",
                        id: "outgoingResponseHeaders",
                        render: function () {
                          return (<>
                            {JSON.stringify(response.headers)}
                          </>)
                        }
                      },
                      {
                        title: "Query paramaters",
                        id: "outgoingResponseQueryparamters",
                        render: function () {
                          return (<>
                            {JSON.stringify(response.queryParams)}
                          </>)
                        }
                      },
                      {
                        title: "Session",
                        id: "outgoingResponseSession",
                        render: function () {
                          return (<>
                            Session 2
                          </>)
                        }
                      },
                      {
                        title: "Body",
                        id: "outgoingResponseBody",
                        render: function () {
                          return (<>
                            {JSON.stringify(response.responseBody)}
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
