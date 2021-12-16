import * as React from "react";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { isLoggedIn } from "../../services/auth";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";
import Spinner from "../common/spinner";
import { Card } from "@conductionnl/nl-design-system";

export default function ResponseTable() {
  const [context, setContext] = React.useState(null);
  const [responses, setResponse] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

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
    fetch(`${context.adminUrl}/response_logs?order[dateCreated]=desc`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(data["hydra:member"]);
        setShowSpinner(false);
      });
  };

  return (
    <>
      <Card
        title="Response Logs"
        cardHeader={function () {
          return (
            <>
              <a className="utrecht-link" onClick={getResponses}>
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
                                  Response logs
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
                      rows={[]}
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
            title={"Request Logs"}
            id={`requestLogs${response.id}`}
            body={function () {
              return (
                <div>
                  {response.responseBody.path !== undefined &&
                    response.responseBody.path !== null && (
                      <>
                        <p>
                          <b>Path: </b>
                          {response.responseBody.path}
                        </p>
                      </>
                    )}
                  {response.responseBody.type !== undefined &&
                    response.responseBody.type !== null && (
                      <>
                        <p>
                          <b>Type: </b>
                          {response.responseBody.type}
                        </p>
                      </>
                    )}
                  {response.responseBody.message !== undefined &&
                    response.responseBody.message !== null && (
                      <>
                        <b>Message</b>
                        <p>{response.responseBody.message}</p>
                      </>
                    )}
                  {response.responseBody.data !== undefined &&
                    response.responseBody.data !== null && (
                      <>
                        <h5>data</h5>
                        {Object.entries(response.responseBody.data).map(
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
