import * as React from "react";
import Spinner from "../common/spinner";
// import {Table} from "@conductionnl/nl-design-system/lib/Table/src/table";
import Table from "../../components/common/table";
import {isLoggedIn} from "../../services/auth";
import {Card} from "@conductionnl/nl-design-system/lib/Card/src/card";
import {Link} from "gatsby";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else {
      if (isLoggedIn()) {
        setShowSpinner(true);
        fetch(`${context.adminUrl}/entities`, {
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
    <Card title={"Entities"}
          cardHeader={function () {
            return (
              <>
                <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
                  <i className="fas fa-question mr-1"/>
                  <span className="mr-2">Help</span>
                </button>
                {/*<a className="utrecht-link" onClick={getEntities}>*/}
                <a className="utrecht-link">
                  <i className="fas fa-sync-alt mr-1"/>
                  <span className="mr-2">Refresh</span>
                </a>
                <Link to="/entities/new">
                  <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
                    className="fas fa-plus mr-2"/>Add
                  </button>
                </Link>
              </>
            )
          }}
          cardBody={function () {
            return (
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
            )
          }}
    />
  );
}
