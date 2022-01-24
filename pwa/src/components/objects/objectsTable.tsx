import * as React from "react";
import {Table, Card, Spinner, Alert} from "@conductionnl/nl-design-system/lib";
import {isLoggedIn} from "../../services/auth";
import {Link} from "gatsby";
import FlashMessage from 'react-flash-message';

export default function ObjectsTable() {
  const [objects, setObjects] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getObjects();
    }
  }, [context]);

  const getObjects = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/Objecten`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setObjects(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({type: 'danger', message: error.message});
      });
  };

  return (<>
      {
        alert !== null &&
        <FlashMessage duration={5000}>
          <Alert alertClass={alert.type} body={function () {
            return (<>{alert.message}</>)
          }}/>
        </FlashMessage>
      }
      <Card
        title={"Objects"}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-toggle="modal"
                data-target="helpModal"
              >
                <i className="fas fa-question mr-1"/>
                <span className="mr-2">Help</span>
              </button>
              <a className="utrecht-link" onClick={getObjects}>
                <i className="fas fa-sync-alt mr-1"/>
                <span className="mr-2">Refresh</span>
              </a>
              <Link to="/entities/new">
                <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                  <i className="fas fa-plus mr-2"/>
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
                  <Spinner/>
                ) : objects ? (
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
                            <Link to={`/objects/${item.id}`}>
                              <button className="utrecht-button btn-sm btn-success">
                                <i className="fas fa-edit pr-1"/>
                                Edit
                              </button>
                            </Link>
                          );
                        },
                      },
                    ]}
                    rows={objects}
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
          );
        }}
      /></>
  );
}
