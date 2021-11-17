import * as React from "react";
import { useUrlContext } from "../../context/urlContext";

export default function LogsTable({ id }) {
  const [logs, setLogs] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const context = useUrlContext();

  const getLogs = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/request_logs/" + id, {
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
  };

  React.useEffect(() => {
    getLogs();
  });

  return (
    <div className="utrecht-card card">
      <div className="utrecht-card-header card-header">
        <div className="utrecht-card-head-row card-head-row row">
          <div className="col-6">
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">
              Logs{" "}
            </h4>
          </div>
          <div className="col-6 text-right">
            <button
              class="utrecht-link button-no-style"
              data-toggle="modal"
              data-target={"#helpModal"}
            >
              <i className="fas fa-question mr-1"></i>
              <span className="mr-2">Help</span>
            </button>
            <button class="utrecht-link button-no-style" onClick={getLogs}>
              <i className="fas fa-sync-alt mr-1"></i>
              <span className="mr-2">Refresh</span>
            </button>
          </div>
        </div>
      </div>
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <div className="text-center px-5">
                <div
                  class="spinner-border text-primary"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="utrecht-html">
                <table
                  lang="nl"
                  summary="Overview of object entities fetched from the gateway."
                  className="table"
                >
                  {/*<caption></caption>*/}
                  <thead>
                    <tr>
                      <th scope="col">Action</th>
                      {/*<th scope="col">ObjectId</th>*/}
                      {/*<th scope="col">ObjectClass</th>*/}
                      <th scope="col">Version</th>
                      <th scope="col">Data</th>
                      <th scope="col">Username</th>
                      <th scope="col">Session</th>
                      {/*<th scope="col">Date created</th>*/}
                      {/*<th scope="col">Date modified</th>*/}
                    </tr>
                  </thead>
                  {logs !== null && logs.length > 0 ? (
                    <tbody>
                      {logs.map((row) => (
                        <tr>
                          <td>{row.action}</td>
                          {/*<td>{row.objectId}</td>*/}
                          {/*<td>{row.objectClass}</td>*/}
                          <td>{row.version}</td>
                          <td>{row.data}</td>
                          <td>{row.username}</td>
                          <td>{row.session}</td>
                          {/*<td>{row.dateCreated}</td>*/}
                          {/*<td>{row.dateModified}</td>*/}
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td>No results found</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
