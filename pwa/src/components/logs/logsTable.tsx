import * as React from "react";
import Spinner from "../common/spinner";
import Table from "../common/table";
import {isLoggedIn} from "../../services/auth";

export default function LogsTable({ id }) {
  const [logs, setLogs] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(null);
  const [context, setContext] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
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
      }
    }
  }, [context]);

  return (
    // <Card title="Logs" modal="#helpModal" refresh={getLogs}>
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table properties={[{ th: "Action", property: "action" }, { th: "ObjectId", property: "objectId" }, { th: "Version", property: "version" }, { th: "Username", property: "username" }, { th: "Session", property: "session" }]} items={logs} editLink={"/entities"}/>
          )}
        </div>
      </div>
    // </Card>
  );
}
