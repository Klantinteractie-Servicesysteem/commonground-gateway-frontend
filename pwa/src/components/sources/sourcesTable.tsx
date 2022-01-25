import * as React from "react";
import { Link } from "gatsby";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";

export default function SourcesTable() {
  const [gateways, setGateways] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [API, setAPI] = React.useState<APIService>(null)

  React.useEffect(() => {
    console.log({...{gateways}})
  }, [gateways])

  React.useEffect(() => {
    if (!API) {
      setAPI(new APIService(sessionStorage.getItem('jwt')))
    } else {
      handleSetGateways()
    }
  }, [API])

  const handleSetGateways = () => {
    setShowSpinner(true)
    API.Gateway.getAll()
      .then((res) => {
        setGateways(res.data)
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
            <a className="utrecht-link" onClick={handleSetGateways}>
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
                gateways ? (
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
                  },]} rows={gateways} />
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
