import * as React from "react";
import { useEffect, useState } from "react";
import { useUrlContext } from "../../context/urlContext";
import TableHeaders from "../common/tableHeaders";
import TableCells from "../common/tableCells";
import Spinner from "../common/spinner";
import CardHeader from "../cardHeader";
import { Link } from "gatsby";
import DeleteModal from "../modals/deleteModal";

export default function SourcesTable() {
  const context = useUrlContext();
  const [sources, setSources] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  const getSources = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/gateways", {
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

  return (
    <div className="utrecht-card card">
      <CardHeader
        items={[
          {
            title: "Sources",
            modal: "#helpModal",
            refresh: getSources,
            add: "/sources/new",
          },
        ]}
      />
      <div className="utrecht-card-body card-body">
        <div className="row">
          <div className="col-12">
            {showSpinner === true ? (
              <Spinner />
            ) : (
              <div className="utrecht-html">
                <table
                  lang="nl"
                  summary="Overview of sources fetched from the gateway."
                  className="table"
                >
                  <TableHeaders
                    headerItems={[
                      {
                        name: "Name",
                      },
                      { name: "Location" },
                      { name: "" },
                    ]}
                  />
                  <tbody>
                    {sources !== null && sources.length > 0 ? (
                      sources.map((row) => (
                        <TableCells
                          cellItems={[
                            { name: row.name },
                            { name: row.location },
                            {
                              renderItem: () => {
                                return (
                                  <>
                                    <div className="d-flex">
                                      <Link
                                        className="ml-auto"
                                        to={`/sources/${row.id}`}
                                      >
                                        <button className="utrecht-button btn-sm btn-success">
                                          <i className="fas fa-edit pr-1"></i>
                                          Edit
                                        </button>
                                      </Link>
                                      <button
                                        className="utrecht-button btn-sm btn-danger ml-2"
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#item-${row.id.replaceAll(
                                          "-",
                                          ""
                                        )}`}
                                      >
                                        <i className="fas fa-trash" />
                                      </button>
                                    </div>
                                  </>
                                );
                              },
                            },
                          ]}
                        />
                      ))
                    ) : (
                      <TableCells
                        cellItems={[
                          { name: "No results found" },
                          { name: "" },
                          { name: "" },
                        ]}
                      />
                    )}
                  </tbody>
                </table>
                {sources !== null &&
                  sources.map((item) => (
                    <>
                      <DeleteModal data={item} useFunction={getSources} />
                    </>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
