import * as React from "react";
// import Card from "../common/card";
// import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import Spinner from "../common/spinner";
import { isLoggedIn } from "../../services/auth";
import Table from "../common/table";

export default function AttributeTable({ id }) {
  const [attributes, setAttributes] = React.useState(null);
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
        fetch(`${context.adminUrl}/attributes?entity.id=${id}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              setShowSpinner(false);
              setAttributes(null);
              throw new Error(response.statusText);
            }
          })
          .then((data) => {
            setAttributes(data["hydra:member"]);
            setShowSpinner(false);
          })
          .catch((error) => {
            console.error("Error:", error);
            setShowSpinner(false);
            setAttributes(null);
          });
      }
    }
  }, [context]);

  return (
    // <Card title="Attributes" modal="#helpModal" refresh={getAttributes} add={"/attributes/new/" + id}>
      <div className="row">
        <div className="col-12">
          {showSpinner === true ? (
            <Spinner />
          ) : (
            // <Table columns={[{
            //   headerName: "Name",
            //   field: "name"
            // }, {
            //   headerName: "Type",
            //   field: "type"
            // }]} rows={attributes}/>

            <Table properties={[{ th: "Name", property: "name" }, { th: "Type", property: "type" }]} items={attributes} editLink="/attributes" parentLink={id}/>
          )}
        </div>
      </div>
    // </Card>
  );
}
