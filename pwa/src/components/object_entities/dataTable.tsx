import * as React from "react";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

interface Entity_objectsTableProps {
  id: string,
}

export const DataTable:React.FC<Entity_objectsTableProps> = ({ id }) => {
  const [entity_objects, setEntity_objects] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);

  React.useEffect(() => { id && handleSetEntity_objects() }, [API, id])

  const handleSetEntity_objects = () => {
    setShowSpinner(true)
    API.Entity_objects.getAllFromEntity(id)
      .then((res) => {
        setEntity_objects(res.data)
      })
      .catch((err) => {
        throw new Error ('GET objects from entity error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (<>
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
            <a className="utrecht-link" onClick={handleSetEntity_objects}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/object_entities/new/${id}`}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2" />
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
                <Spinner />
              ) : entity_objects ? (
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
                          <Link to={`/object_entities/${item.id}/${id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={entity_objects}
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
