import * as React from "react";
import { Card, Table, Spinner } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";

export default function ApplicationsTable() {
  const [context, setContext] = React.useState(null);
  const [applications, setApplications] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL
      });
    } else if (isLoggedIn()) {
      getApplications(context);
    }
  }, [context]);

  const getApplications = (context) => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/applications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setApplications(data["hydra:member"]);
        setShowSpinner(false);
      })
      .catch((error) => {
        setShowSpinner(false);
        console.error("Error:", error);
      });
  };

  return (
    <Card
      title={"Applications"}
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
            <a className="utrecht-link" onClick={getApplications}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/applications/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
                Create
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
              ) : applications ? (
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
                          <Link to={`/applications/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={applications}
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
                  rows={[{name: "No results found", description: " "}]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
