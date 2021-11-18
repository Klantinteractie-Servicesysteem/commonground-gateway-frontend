import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";
import CardHeader from "../cardHeader";

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
    <div className="utrecht-card card">
      <CardHeader
        items={[
          {
            title: "Entities",
            modal: "#helpModal",
            refresh: getEntities,
            add: "/entities/new",
          },
        ]}
      />
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <div className="text-center px-5">
                <div
                  className="spinner-border text-primary"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="utrecht-html">
                <table
                  lang="nl"
                  summary="Overview of object entities fetched from the gateway."
                  className="table"
                >
                  <TableHeaders
                    headerItems={[
                      {
                        name: "Name",
                      },
                      { name: "Endpoint" },
                      { name: "Route" },
                      { name: "Source" },
                      { name: "" },
                    ]}
                  />
                  <tbody>
                    {entities !== null && entities.length > 0 ? (
                      entities.map((row) => (
                        <TableCells
                          cellItems={[
                            { name: row.name },
                            { name: row.endpoint },
                            { name: row.route },
                            { name: row.gateway.name },
                            { name: "button", link: `/entities/${row.id}` },
                          ]}
                        />
                      ))
                    ) : (
                      <TableCells
                        cellItems={[
                          { name: "No results found" },
                          { name: "" },
                          { name: "" },
                          { name: "" },
                          { name: "" },
                        ]}
                      />
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
