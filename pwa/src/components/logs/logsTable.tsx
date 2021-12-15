import * as React from "react";
import Spinner from "../common/spinner";
import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import {isLoggedIn} from "../../services/auth";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";

export default function LogsTable({ id }) {
  const [logs, setLogs] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(`${context.adminUrl}/request_logs/?entity.id=${id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(response.statusText);
            }
          })
          .then((data) => {
            setLogs(data["hydra:member"]);
            setShowSpinner(false);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, [context]);

  return (
    <Card title={"Logs"}
          cardHeader={function () {
            return (
              <>
                <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                {/*<a className="utrecht-link" onClick={getLogs}>*/}
                <a className="utrecht-link">
                  <i className="fas fa-sync-alt mr-1"/>
                  <span className="mr-2">Refresh</span>
                </a>
              </>
            )
          }}
          cardBody={function () {
            return (
              <div className="row">
                <div className="col-12">
                  {showSpinner === true ? (
                    <Spinner/>
                  ) : (
                    logs ? (
                      <Table columns={[{
                        headerName: "Action",
                        field: "action"
                      }, {
                        headerName: "Object Id",
                        field: "objectId"
                      },
                        {
                          headerName: "Version",
                          field: "version"
                        },
                        {
                          headerName: "Username",
                          field: "username"
                        },
                        {
                          headerName: "Session",
                          field: "session"
                        },
                        {
                          field: "id",
                          headerName: " ",
                          renderCell: () => {
                            return (
                              <div className="float-right mr-4">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#requestLogs">
                                  Request logs
                                </button>
                              </div>
                            );
                          },
                        },]} rows={logs}/>
                    ) : (
                      <Table columns={[{
                        headerName: "Action",
                        field: "action"
                      }, {
                        headerName: "Object Id",
                        field: "objectId"
                      },
                        {
                          headerName: "Version",
                          field: "version"
                        },
                        {
                          headerName: "Username",
                          field: "username"
                        },
                        {
                          headerName: "Session",
                          field: "session"
                        }]} rows={[]}/>
                    )
                  )}
                </div>
              </div>
            )
          }}
    />
  );
}
