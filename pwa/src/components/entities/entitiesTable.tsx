import * as React from "react";
import { useEffect, useState } from "react";
// import Card from "../common/card";
import Spinner from "../common/spinner";
// import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import Table from "../../components/common/table";
import {isLoggedIn} from "../../services/auth";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(`${context.apiUrl}/entities`, {
          credentials: "include",
          headers: {"Content-Type": "application/json"},
        })
          .then(response => response.json())
          .then((data) => {
            setShowSpinner(false);
            console.log('data')
            console.log(data)
            setEntities(data["hydra:member"])
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
            // entities ? (
            //   <Table columns={[{
            //     headerName: "Name",
            //     field: "name"
            //   }, {
            //     headerName: "Endpoint",
            //     field: "endpoint"
            //   }, {
            //     headerName: "Route",
            //     field: "route"
            //   },
            //   // }, {
            //   //   headerName: "Source",
            //   //   field: "gateway.name"
            //   // }, {
            //     {
            //     field: "edit",
            //     headerName: "Edit ",
            //     renderCell: () => {
            //       return (
            //         "hiiii"
            //           // <button
            //           //   className="utrecht-button"
            //           //   type="button"
            //           // >
            //           //  Edit
            //           // </button>
            //       );
            //     },
            //   },]} rows={entities}/>
            // ) : (
            //   <Table columns={[{
            //     headerName: "Name",
            //     field: "name"
            //   }, {
            //     headerName: "Endpoint",
            //     field: "endpoint"
            //   }, {
            //     headerName: "Route",
            //     field: "route"
            //   }, {
            //     headerName: "Source",
            //     field: "gateway.name"
            //   }]} rows={[]}/>
            // )
            <Table properties={[{ th: "Name", property: "name" }, { th: "Endpoint", property: "endpoint" }, { th: "Route", property: "route" }, { th: "Source", property: "gateway.name" }]} items={entities} editLink="/entities" />
          )}
        </div>
      </div>
    // </Card>
  );
}
