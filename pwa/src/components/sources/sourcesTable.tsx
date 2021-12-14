import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";
import Table from "../common/table";
import Spinner from "../common/spinner";
import Card from "../common/card";
import { Link } from "gatsby";
import DeleteModal from "../modals/deleteModal";

export default function SourcesTable() {
  const context = useUrlContext();
  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.adminUrl + "/gateways", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"] !== null
        ) {
          setSources(data["hydra:member"]);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getSources();
  }, []);

  return (<>
    <Card title="Sources" modal="#helpModal" refresh={getSources} add="/sources/new">
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <Spinner />
          ) : (
              <Table properties={[{ th: "Name", property: "name" }, { th: "Location", property: "location" }]} items={sources} editLink="/sources" />
            )}
          </div>
        </div>

    </Card>
  </>
  );
}
