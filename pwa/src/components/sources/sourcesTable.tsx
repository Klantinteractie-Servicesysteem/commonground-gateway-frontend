import * as React from "react";
import Spinner from "../common/spinner";
import { isLoggedIn } from "../../services/auth";
import { Link } from "gatsby";
import { getCall } from "../utility/fetch";
import { Table, Card } from "@conductionnl/nl-design-system/lib";

export default function SourcesTable() {
  const [sources, setSources] = React.useState(null);
  const [context, setContext] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && context === null) {
      setContext({
        adminUrl: window.GATSBY_ADMIN_URL,
      });
    } else if (isLoggedIn()) {
      getSources();
    }
  }, [context]);

  const getSources = () => {
    setShowSpinner(true);

    getCall({
      url: `${context.adminUrl}/gateways`,
      handler: (data) => {
        setShowSpinner(false);
        setSources(data["hydra:member"]);
      },
    });
  };

  return (
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
    />
  );
}
