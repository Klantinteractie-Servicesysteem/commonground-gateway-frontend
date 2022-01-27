import * as React from "react";
import {Table, Card, Spinner} from "@conductionnl/nl-design-system/lib";
import {Link} from "gatsby";
import APIService from "../../apiService/apiService";

export default function EntitiesTable() {
  const [entities, setEntities] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const [API, setAPI] = React.useState<APIService>(null)

  React.useEffect(() => {
    if (!API) {
      setAPI(new APIService(sessionStorage.getItem('jwt')))
    } else {
      handleSetEntities()
    }
  }, [API])

  const handleSetEntities = () => {
    setShowSpinner(true)
    API.Entity.getAll()
      .then((res) => {
        setEntities(res.data)
      })
      .catch((err) => {
        throw new Error ('GET Applications error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (
    <Card
      title={"Entities"}
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
            <a className="utrecht-link" onClick={handleSetEntities}>
              <i className="fas fa-sync-alt mr-1"/>
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/entities/new">
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
              ) : entities ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                    },
                    {
                      headerName: "Route",
                      field: "route",
                    },
                    {
                      headerName: "Source",
                      field: "gateway",
                      valueFormatter: (item) => {
                        return item ? item.name : "";
                      },
                    },
                    {
                      field: "id",
                      headerName: "Edit ",
                      renderCell: (item) => {
                        return (
                          <Link to={`/entities/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1"/>
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
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                    },
                    {
                      headerName: "Route",
                      field: "route",
                    },
                    {
                      headerName: "Source",
                      field: "gateway.name",
                    },
                  ]}
                  rows={[{name: 'No results found'}]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
