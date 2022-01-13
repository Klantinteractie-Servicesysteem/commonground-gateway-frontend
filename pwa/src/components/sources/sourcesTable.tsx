import * as React from "react";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import { getCall } from "../utility/fetch";
import { Table, Card, Alert, Spinner } from "@conductionnl/nl-design-system/lib";
import FlashMessage from 'react-flash-message';

export default function SourcesTable() {
  const [sources, setSources] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: process.env.GATSBY_ADMIN_URL
      });
    } else if (isLoggedIn()) {
      getSources();
    }
  }, [context]);

  const getSources = () => {
    setShowSpinner(true);
    fetch(`${context.adminUrl}/gateways`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["hydra:member"] !== undefined && data["hydra:member"].length > 0) {
          setSources(data["hydra:member"]);
        }
        setShowSpinner(false);
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
    <Card title={"Sources"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={getSources}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <a
              // href={`${context.adminUrl}/export/gateways`}
              target="_blank"
              className=""
            >
              <button className="utrecht-link button-no-style">
                <span className="mr-2">Export Sources</span>
              </button>
            </a>
            <Link to="/sources/new">
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
                sources ? (
                  <Table columns={[{
                    headerName: "Name",
                    field: "name"
                  }, {
                    headerName: "Location",
                    field: "location"
                  },
                  {
                    field: "id",
                    headerName: " ",
                    renderCell: (item: { id: string }) => {
                      return (
                        <Link to={`/sources/${item.id}`}>
                          <button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1" />Edit</button>
                        </Link>
                      );
                    },
                  },]} rows={sources} />
                ) : (
                  <Table columns={[{
                    headerName: "Name",
                    field: "name"
                  }, {
                    headerName: "Location",
                    field: "location"
                  }]} rows={[]} />
                )
              )}
            </div>
          </div>
        )
      }}
    /></>
  );
}
