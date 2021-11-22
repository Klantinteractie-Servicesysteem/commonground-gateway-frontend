import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import CardHeader from "../common/cardHeader";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";

export default function LogsTable({ id }) {
  const [logs, setLogs] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const context = useUrlContext();

  const getLogs = () => {
    setShowSpinner(true);
    fetch(`${context.apiUrl}/request_logs/?entity.id=${id}`, {
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
  }, []);

  return (
    <div className="utrecht-card card">
      <CardHeader items={[{title: 'Logs', modal: '#helpModal', refresh: {getLogs}, link: null}]}/>
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {
              showSpinner === true ?
                <div className="text-center px-5">
                  <div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}} role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div> :
                <div className="utrecht-html">
                  <table lang="nl" summary="Overview of object entities fetched from the gateway." className="table">
                    <TableHeaders headerItems={[{
                      name: 'Action'
                    }, {name: 'ObjectId'}, {name: 'Version'}, {name: 'Data'}, {name: 'Username'}, {name: 'Session'}, {name: ''}]}/>
                    <tbody>
                    {
                      logs !== null && logs.length > 0 ?
                          logs.map((row) => (
                            <TableCells
                              cellItems={[{name: row.action}, {name: row.objectId}, {name: row.version}, {name: row.username}, {name: row.session}, {name: 'button', link: `/entities/${row.id}`}]}/>
                          ))
                        :
                        <TableCells cellItems={[{name: 'No results found'}, {name: ''}, {name: ''}, {name: ''}, {name: ''}, {name: ''}]}/>
                    }
                    </tbody>
                  </table>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
