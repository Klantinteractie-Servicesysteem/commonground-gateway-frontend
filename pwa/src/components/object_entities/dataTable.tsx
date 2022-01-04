import * as React from "react";
import { Table, Card, Alert, Spinner } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import FlashMessage from 'react-flash-message';

export default function DataTable({ id }) {
  const [data, setData] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);


  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getData();
    }
  }, [context]);

  const getData = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/object_entities/?entity.id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setAlert(null);
          setAlert({ type: 'danger', message: response.statusText });
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setShowSpinner(false);
        // console.log('Object entities:', data);
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setData(data["hydra:member"]);
        }
      })
      .catch((error) => {
        setShowSpinner(false);
        console.log("Error:", error);
        setAlert(null);
        setAlert({ type: 'danger', message: error.message });
      });
  };

  return (<>
    {
      alert !== null &&
      <FlashMessage duration={5000}>
        <Alert alertClass={alert.type} body={function () { return (<>{alert.message}</>) }} />
      </FlashMessage>
    }
    <Card
      title={"Object entities"}
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
            <a className="utrecht-link" onClick={getData}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/object_entities/new">
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
              ) : data ? (
                <Table
                  columns={[
                    {
                      headerName: "Uri",
                      field: "uri",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link to={`/object_entities/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={data}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Uri",
                      field: "uri",
                    },
                    {
                      headerName: "Owner",
                      field: "owner",
                    },
                  ]}
                  rows={[{uri: 'No results found'}]}
                />
              )}
            </div>
          </div>
        );
      }}
    /></>
  );
}
