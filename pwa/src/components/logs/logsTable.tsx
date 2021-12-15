import * as React from "react";
import Spinner from "../common/spinner";
import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import {isLoggedIn} from "../../services/auth";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";
import Modal from "@conductionnl/nl-design-system/lib/Modal/src/modal";

export default function LogsTable({id}) {
  const [logs, setLogs] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [context, setContext] = React.useState(null);

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
    fetch(`${context.adminUrl}/request_logs/?entity.id=${id}`, {
      credentials: "include",
      headers: {"Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')},
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data["hydra:member"])
        setLogs(data["hydra:member"]);
      });
  }

  return (
    <>
      <Card title={"Logs"}
            cardHeader={function () {
              return (
                <>
                  <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
                    <i className="fas fa-question mr-1"/>
                    <span className="mr-2">Help</span>
                  </button>
                  <a className="utrecht-link" onClick={getLogs}>
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
                      logs !== null ? (
                        <Table columns={[{
                          headerName: "Status",
                          field: "status"
                        }, {
                          headerName: "Status Code",
                          field: "statusCode"
                        }, {
                          headerName: "Method",
                          field: "method"
                        },
                          {
                            field: "id",
                            headerName: " ",
                            renderCell: (item) => {
                              return (
                                <div className="float-right mr-4">
                                  <button type="button" className="btn btn-primary" data-bs-toggle="modal"
                                          data-bs-target={`#requestLogs${item.id}`}>
                                    Request logs
                                  </button>
                                </div>
                              );
                            },
                          },]} rows={logs}/>
                      ) : (
                        <Table columns={[{
                          headerName: "Status",
                          field: "status"
                        }, {
                          headerName: "Status Code",
                          field: "statusCode"
                        }, {
                          headerName: "Method",
                          field: "method"
                        }]} rows={[]}/>
                      )
                    )}
                  </div>
                </div>
              )
            }}
      />

      {logs !== null &&
      logs.map((log) => (
        <Modal title={"Request Logs"}
               id={`requestLogs${log.id}`}
               body={function () {
                 return (
                   <div>
                     {
                       log.responseBody.path !== null && (
                         <>
                           <p><b>Path: </b>{log.responseBody.path}</p>
                         </>
                       )
                     }
                     {
                       log.responseBody.type !== null && (
                         <>
                           <p><b>Type: </b>{log.responseBody.type}</p>
                         </>
                       )
                     }
                     {
                       log.responseBody.message !== null && (
                         <>
                           <b>Message</b>
                           <p>{log.responseBody.message}</p>
                         </>
                       )
                     }
                   </div>
                 )
               }}/>
      ))}
    </>
  );
}
