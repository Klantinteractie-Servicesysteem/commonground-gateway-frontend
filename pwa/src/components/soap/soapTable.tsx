import * as React from "react";
import Spinner from "../common/spinner";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { isLoggedIn } from "../../services/auth";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { Link } from "gatsby";

export default function SoapTable() {
  const [entities, setEntities] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getSoap();
    }
  }, [context]);

  const getSoap = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/soaps`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setShowSpinner(false);
        console.log(data);
        setEntities(data["hydra:member"]);
      });
  };

  return (
    <Card
      title={"Soap"}
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
            <a className="utrecht-link" onClick={getSoap}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/soap/new">
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
                            field: "id",
                            headerName: "Edit",
                            renderCell: (item) => {
                              return (
                                <Link to={`/soap/${item.id}`}>
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
                        ]}
                        rows={[]}
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
