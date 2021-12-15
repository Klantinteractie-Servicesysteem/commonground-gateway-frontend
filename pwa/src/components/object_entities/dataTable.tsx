import * as React from "react";
import Spinner from "../common/spinner";
import { Table } from "@conductionnl/nl-design-system/lib/Table/src/table";
import { isLoggedIn } from "../../services/auth";
import { Card } from "@conductionnl/nl-design-system/lib/Card/src/card";
import { Link } from "gatsby";

export default function DataTable({ id }) {
  const [data, setData] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        apiUrl: window.GATSBY_API_URL,
      });
    } else if (isLoggedIn()) {
      getData();
    }
  }, [context]);

  const getData = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/object_entities/?entity.id=${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        setData(data['hydra:member']);
        setShowSpinner(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  return (
    <Card title={"Object entities"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getData}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/object_entities/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
                className="fas fa-plus mr-2" />Add
              </button>
            </Link>
          </>
        )
      }}
      cardBody={function () {
        return (
          <div className="row">
            <div className="col-12">
              {showSpinner === true ? (
                <Spinner />
              ) : (
                data ? (
                  <Table columns={[{
                    headerName: "Name",
                    field: "name"
                  }, {
                    headerName: "Owner",
                    field: "owner"
                  },
                  {
                    field: "edit",
                    headerName: "Edit ",
                    renderCell: () => {
                      return (
                        ""
                        // <Link to={`/data/${data.id}`}>
                        //   <button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"/>Edit</button>
                        // </Link>
                      );
                    },
                  },]} rows={data} />
                ) : (
                  <Table columns={[{
                    headerName: "Name",
                    field: "name"
                  }, {
                    headerName: "Owner",
                    field: "owner"
                  }]} rows={[]} />
                )
              )}
            </div>
          </div>
        )
      }}
    />
  );
}
