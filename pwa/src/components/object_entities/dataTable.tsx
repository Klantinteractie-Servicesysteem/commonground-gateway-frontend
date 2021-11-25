import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import Card from "../common/card";
import Spinner from "../common/spinner";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";
import Table from "../common/table";

export default function DataTable({ id }) {
  const [data, setData] = React.useState(null);
  const context = useUrlContext();

  const [showSpinner, setShowSpinner] = useState(false);

  const getData = () => {
    setShowSpinner(true);
    fetch(`${context.apiUrl}/object_entities/?entity.id=${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        console.log(data);
        setData(data["hydra:member"]);
        setShowSpinner(false);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card title="Object entities" modal="#helpModal" refresh={getData} add="/object_entities/new">
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table
              properties={[
                { th: "Name", property: "name" },
                { th: "Owner", property: "owner" },
              ]}
              items={data}
              editLink="/object_entities"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
