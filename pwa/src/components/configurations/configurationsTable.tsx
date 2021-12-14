import * as React from "react";
// import Card from "../common/card";
import Spinner from "../common/spinner";
// import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import Table from "../../components/common/table";
import {isLoggedIn} from "../../services/auth";
import {useState} from "react";

export default function ConfigurationsTable() {
  const [context, setContext] = React.useState(null);
  const [configurations, setConfigurations] = useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
        frontendUrl: window.GATSBY_FRONTEND_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(context.apiUrl + "/", {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
          .then(response => response.json())
          .then((data) => {
            if (data['hydra:member'] !== undefined && data['hydra:member'] !== null) {
              setConfigurations(data['hydra:member']);
              setShowSpinner(false);
            }
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  }, [context]);

  return (
    // <Card title="Entities" modal="#helpModal" refresh={getEntities} add="/entities/new">
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table properties={[{ th: "Name", property: "name" }, { th: "Description", property: "description" }]} items={applications} editLink="/applications" />
          )}
        </div>
      </div>
    // </Card>
  );
}
