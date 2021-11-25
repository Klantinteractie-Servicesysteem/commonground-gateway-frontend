import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { useEffect, useState } from "react";
import { Link } from "gatsby";
import Card from "../common/card";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";
import Table from "../common/table";
import DeleteModal from "../modals/deleteModal";
import Spinner from "../common/spinner";

export default function AttributeTable({ id }) {
  const [attributes, setAttributes] = React.useState(null);
  const context = useUrlContext();
  const [showSpinner, setShowSpinner] = useState(false);

  const getAttributes = () => {
    setShowSpinner(true);
    fetch(`${context.apiUrl}/attributes?entity.id=${id}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          setShowSpinner(false);
          setAttributes(null);
          throw new Error(response.statusText);
        }
      })
      .then(data => {
        setAttributes(data["hydra:member"]);
        setShowSpinner(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setShowSpinner(false);
        setAttributes(null);
      });
  };
  useEffect(() => {
    getAttributes();
  }, []);

  return (
    <Card title="Attributes" modal="#helpModal" refresh={getAttributes} add={"/attributes/new/" + id}>
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            <Table
              properties={[
                { th: "Name", property: "name" },
                { th: "Type", property: "type" },
              ]}
              items={attributes}
              editLink="/attributes"
              parentLink={id}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
