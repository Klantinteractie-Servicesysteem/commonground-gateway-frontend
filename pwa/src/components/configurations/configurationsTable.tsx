import * as React from "react";
import Spinner from "../common/spinner";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { isLoggedIn } from "../../services/auth";
import { useState } from "react";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { Link } from "gatsby";

export default function ConfigurationsTable() {
  const [context, setContext] = React.useState(null);
  const [configurations, setConfigurations] = useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getConfigs();
    }
  }, [context]);

  const getConfigs = () => {
    setShowSpinner(true);
    fetch(context.apiUrl + "/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"] !== null
        ) {
          setConfigurations(data["hydra:member"]);
          setShowSpinner(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Card
      title={"Configurations"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-toggle="modal"
              data-target="helpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getConfigs}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/configurations/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Add
              </button>
            </Link>
          </>
        );
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : configurations ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Description",
                      field: "description",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link to={`/configurations/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={configurations}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Description",
                      field: "description",
                    },
                  ]}
                  rows={[]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
