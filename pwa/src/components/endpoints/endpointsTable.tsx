import * as React from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import FlashMessage from "react-flash-message";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function EndpointsTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const [context, setContext] = React.useState(null);
  const [endpoints, setEndpoints] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getEndpoints(context);
    }
  }, [context]);

  const getEndpoints = (context) => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/endpoints`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        if (
          data["hydra:member"] !== undefined &&
          data["hydra:member"].length > 0
        ) {
          setEndpoints(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: "danger", message: error.message });
      });
  };

  React.useEffect(() => {
    // na apiService refactor
    // handleSetApplications();
    handleSetDocumentation();
  }, [API]);

  const handleSetDocumentation = (): void => {
    API.Documentation.get()
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <>
      {alert !== null && (
        <FlashMessage duration={5000}>
          <Alert
            alertClass={alert.type}
            body={function () {
              return <>{alert.message}</>;
            }}
          />
        </FlashMessage>
      )}
      <Card
        title={"Endpoints"}
        cardHeader={function () {
          return (
            <>
              <button
                className="utrecht-link button-no-style"
                data-bs-toggle="modal"
                data-bs-target="#helpModal"
              >
                <Modal
                  title="Endpoints Documentation"
                  id="helpModal"
                  body={() => (
                    <div dangerouslySetInnerHTML={{ __html: documentation }} />
                  )}
                />
                <i className="fas fa-question mr-1" />
                <span className="mr-2">Help</span>
              </button>
              <a className="utrecht-link" onClick={getEndpoints}>
                <i className="fas fa-sync-alt mr-1" />
                <span className="mr-2">Refresh</span>
              </a>
              <Link to="/endpoints/new">
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
                ) : endpoints ? (
                  <Table
                    columns={[
                      {
                        headerName: "Name",
                        field: "name",
                      },
                      {
                        headerName: "Path",
                        field: "path",
                      },
                      {
                        field: "id",
                        headerName: " ",
                        renderCell: (item: { id: string }) => {
                          return (
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/endpoints/${item.id}`}
                            >
                              <button className="utrecht-button btn-sm btn-success">
                                <i className="fas fa-edit pr-1" />
                                Edit
                              </button>
                            </Link>
                          );
                        },
                      },
                    ]}
                    rows={endpoints}
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
                    rows={[{ name: "No results found", description: " " }]}
                  />
                )}
              </div>
            </div>
          );
        }}
      />
    </>
  );
}
