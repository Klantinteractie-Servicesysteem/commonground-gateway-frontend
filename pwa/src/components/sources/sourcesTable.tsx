import * as React from "react";
import { Link } from "gatsby";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function SourcesTable() {
  const [sources, setSources] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext)

  React.useEffect(() => { handleSetSources() }, [API])

  const handleSetSources = () => {
    setShowSpinner(true)
    API.Source.getAll()
      .then((res) => {
        setSources(res.data)
      })
      .catch((err) => {
        throw new Error ('GET Applications error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (
    <Card title={"Sources"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-toggle="modal" data-target="helpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <a className="utrecht-link" onClick={handleSetSources}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/sources/new">
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success"><i
                className="fas fa-plus mr-2" />Create
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
