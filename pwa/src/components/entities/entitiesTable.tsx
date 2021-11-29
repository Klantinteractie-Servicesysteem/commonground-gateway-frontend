import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import Card from "../common/card";
import Spinner from "../common/spinner";
import Table from "../common/table";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const context = useUrlContext();
  const [showSpinner, setShowSpinner] = useState(false);

  const getEntities = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/entities", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setShowSpinner(false);
          setEntities(null);
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setEntities(data["hydra:member"]);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowSpinner(false);
        setEntities(null);
      });
  };
  useEffect(() => {
    getEntities();
  }, []);

  return (
    <Card title="Entities" modal="#helpModal" refresh={getEntities} add="/entities/new">
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table properties={[{ th: "Name", property: "name" }, { th: "Endpoint", property: "endpoint" }, { th: "Route", property: "route" }, { th: "Source", property: "gateway.name" }]} items={entities} editLink="/entities" />
          )}
        </div>
      </div>
    </Card>
  );
}
