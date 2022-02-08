import * as React from "react";
import {Table, Card, Spinner} from "@conductionnl/nl-design-system/lib";
import {Link} from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export default function EndpointsTable() {
  const [endpoints, setEndpoints] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const API: APIService = React.useContext(APIContext)

  React.useEffect(() => {
    handleSetEndpoints()
  }, [API])

  const handleSetEndpoints = () => {
    setShowSpinner(true)
    API.Endpoint.getAll()
      .then((res) => {
        setEndpoints(res.data)
      })
      .catch((err) => {
        throw new Error('GET Entities error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (
    <Card
      title={"Endpoints"}
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
            <a className="utrecht-link" onClick={handleSetEndpoints}>
              <i className="fas fa-sync-alt mr-1"/>
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/endpoints/new">
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
                              <i className="fas fa-edit pr-1"/>
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
                  rows={[
                    {
                      name: "No results found",
                      description: " ",
                    }
                  ]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  )
}
