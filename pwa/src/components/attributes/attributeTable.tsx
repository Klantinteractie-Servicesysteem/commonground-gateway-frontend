import * as React from "react";
import { Table, Spinner, Card, Alert } from "@conductionnl/nl-design-system/lib";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import FlashMessage from 'react-flash-message';

export default function AttributeTable({ id }) {
  const [attributes, setAttributes] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL,
      });
    } else {
      if (isLoggedIn()) {
        getAttributes();
      }
    }
  }, [context]);

  const getAttributes = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/attributes?entity.id=${id}`, {
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
        if (data['hydra:member'] !== undefined && data['hydra:member'].length > 0) {
          setAttributes(data["hydra:member"]);
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
      title={"Attributes"}
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
            <a className="utrecht-link" onClick={getAttributes}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/attributes/new/${id}`}>
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
              ) : attributes ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Type",
                      field: "type",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link to={`/attributes/${item.id}/${id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={attributes}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Type",
                      field: "type",
                    },
                  ]}
                  rows={[]}
                />
              )}
            </div>
          </div>
        );
      }}
    /></>
  );
}
