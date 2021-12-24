import * as React from "react";
import { Table, Modal, Spinner, Card, Alert } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import FlashMessage from 'react-flash-message';

export default function RequestTable({ id = null }) {
  const [context, setContext] = React.useState(null);
  const [requests, setRequest] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getRequests();
    }
  }, [context]);

  const getRequests = () => {
    setShowSpinner(true);
    let url = '/request_logs?order[dateCreated]=desc';
    if (id !== null) {
      url = `/request_logs?entity.id=${id}&order[dateCreated]=desc`
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
          setRequest(data["hydra:member"]);
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
        title="Request Logs"
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
              <a className="utrecht-link" onClick={getRequests}>
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
                  {requests !== null && requests.length > 0 ? (
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
                                  data-bs-target={`#requestLogs${item.id.replaceAll(
                                    "-",
                                    ""
                                  )}`}
                                >
                                  Request logs
                                </button>
                              </div>
                            );
                          },
                        },
                      ]}
                      rows={requests}
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

      {requests !== null &&
        requests.map((request) => (
          <Modal
            title={"Request Logs"}
            id={`requestLogs${request.id}`}
            body={function () {
              return (
                <div>
                  {request.responseBody.path !== undefined &&
                    request.responseBody.path !== null && (
                      <>
                        <p>
                          <b>Path: </b>
                          {request.responseBody.path}
                        </p>
                      </>
                    )}
                  {request.responseBody.type !== undefined &&
                    request.responseBody.type !== null && (
                      <>
                        <p>
                          <b>Type: </b>
                          {request.responseBody.type}
                        </p>
                      </>
                    )}
                  {request.responseBody.message !== undefined &&
                    request.responseBody.message !== null && (
                      <>
                        <b>Message</b>
                        <p>{request.responseBody.message}</p>
                      </>
                    )}
                  {request.responseBody.data !== undefined &&
                    request.responseBody.data !== null && (
                      <>
                        <h5>Data</h5>
                        {Object.entries(request.responseBody.data).map(
                          ([key, value]) => (
                            <>
                              <p>
                                <b>{typeof key === "string" && key}: </b>
                                {typeof value === "string" && value}
                              </p>
                            </>
                          )
                        )}
                      </>
                    )}
                  {request.requestBody !== undefined &&
                    request.requestBody !== null && (
                      <>
                        <h5>Request body raw</h5>
                        {JSON.stringify(request.requestBody)}
                      </>
                    )}
                  {request.responseBody !== undefined &&
                    request.responseBody !== null && (
                      <>
                        <br />
                        <br />
                        <h5>Response body raw</h5>
                        {JSON.stringify(request.responseBody)}
                      </>
                    )}
                </div>
              );
            }}
          />
        ))}
    </>
  );
}
