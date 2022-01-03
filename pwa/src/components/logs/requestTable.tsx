import * as React from "react";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { isLoggedIn } from "../../services/auth";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";
import Spinner from "../common/spinner";
import { Card } from "@conductionnl/nl-design-system";

export default function RequestTable() {
  const [context, setContext] = React.useState(null);
  const [requests, setRequest] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

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
    fetch(`${context.adminUrl}/request_logs?order[dateCreated]=desc`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined) {
          setRequest(data["hydra:member"]);
        }
      }).catch((error) => {
        setShowSpinner(false);
        console.log('Error', error)
      });
  };

  return (
    <>
      <Card
        title="Request Logs"
        cardHeader={function () {
          return (
            <>
              <a className="utrecht-link" onClick={getRequests}>
                <i className="fas fa-sync-alt" />
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
                      rows={[]}
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
                        <h5>data</h5>
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
                </div>
              );
            }}
          />
        ))}
    </>
  );
}
