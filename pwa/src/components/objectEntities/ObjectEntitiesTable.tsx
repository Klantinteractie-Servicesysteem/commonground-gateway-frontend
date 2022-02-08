import * as React from "react";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import {AlertContext} from "../../context/alertContext";
import {HeaderContext} from "../../context/headerContext";

interface ObjectEntitiesTableProps {
  entityId: string,
}

const ObjectEntitiesTable:React.FC<ObjectEntitiesTableProps> = ({ entityId }) => {
  const [objectEntities, setObjectEntities] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState<boolean>(false);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext)
  const [header, setHeader] = React.useContext(HeaderContext);

  React.useEffect(() => {
    setHeader({title: 'Object Entities', subText: 'An overview of your object entities objects'})
    entityId && handleSetObjectEntities()
  }, [API, entityId])

  const handleSetObjectEntities = () => {
    setShowSpinner(true)
    API.ObjectEntity.getAllFromEntity(entityId)
      .then((res) => {
        setObjectEntities(res.data)
      })
      .catch((err) => {
        setAlert({message: err, type: 'danger'})
        throw new Error ('GET object entities error: ' + err)
      })
      .finally(() => {
        setShowSpinner(false)
      })
  }

  return (
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
            <a className="utrecht-link" onClick={handleSetObjectEntities}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/object_entities/new/${entityId}`}>
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
              ) : objectEntities ? (
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
                          <Link className="utrecht-link d-flex justify-content-end" to={`/object_entities/${item.id}/${entityId}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={objectEntities}
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
    />
  );
}

export default ObjectEntitiesTable
