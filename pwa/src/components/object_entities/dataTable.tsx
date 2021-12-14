import * as React from "react";
import Spinner from "../common/spinner";
import Table from "../common/table";
import {isLoggedIn} from "../../services/auth";

export default function DataTable({ id }) {
  const [data, setData] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(`${context.adminUrl}/object_entities/?entity.id=${id}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(response.statusText);
            }
          })
          .then((data) => {
            console.log(data)
            setData(data['hydra:member']);
            setShowSpinner(false);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  }, [context]);

  return (
    // <Card title="Object entities" modal="#helpModal" refresh={getData} add="/object_entities/new">
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table properties={[{ th: "Name", property: "name" }, { th: "Owner", property: "owner" }]} items={data} editLink="/object_entities" />
          )}
        </div>
      </div>
    // </Card>
  );
}
