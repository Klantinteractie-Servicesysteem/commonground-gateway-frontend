import * as React from "react";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getEntities();
    }
  }, [context]);

  const getEntities = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/entities`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined) {
          setEntities(data["hydra:member"]);
        }
      })
      .catch((error) => {
        console.log('Error', error);
      });
  };

  return (
    <Card
      title={"Entities"}
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
            <a className="utrecht-link" onClick={getEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/entities/new">
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
              ) : (
                <div className="row">
                  <div className="col-12">
                    {showSpinner === true ? (
                      <Spinner />
                    ) : entities ? (
                      <Table
                        columns={[
                          {
                            headerName: "Name",
                            field: "name",
                          },
                          {
                            headerName: "Endpoint",
                            field: "endpoint",
                          },
                          {
                            headerName: "Route",
                            field: "route",
                          },
                          {
                            headerName: "Source",
                            field: "gateway",
                            valueFormatter: (item) => {
                              return item ? item.name : "";
                            },
                          },
                          {
                            field: "id",
                            headerName: "Edit ",
                            renderCell: (item) => {
                              return (
                                <Link to={`/entities/${item.id}`}>
                                  <button className="utrecht-button btn-sm btn-success">
                                    <i className="fas fa-edit pr-1" />
                                    Edit
                                  </button>
                                </Link>
                              );
                            },
                          },
                        ]}
                        rows={entities}
                      />
                    ) : (
                      <Table
                        columns={[
                          {
                            headerName: "Name",
                            field: "name",
                          },
                          {
                            headerName: "Endpoint",
                            field: "endpoint",
                          },
                          {
                            headerName: "Route",
                            field: "route",
                          },
                          {
                            headerName: "Source",
                            field: "gateway.name",
                          },
                        ]}
                        rows={[{name: 'No results found'}]}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
