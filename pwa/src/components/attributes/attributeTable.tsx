import * as React from "react";
import { Table, Spinner, Card } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
// overlay
import InfoOverlay from "../common/infoOverlay/infoOverlay";

export default function AttributeTable({ id }) {
  const [attributes, setAttributes] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [API, setAPI] = React.useState<APIService>(null);

  React.useEffect(() => {
    if (!API) {
      setAPI(new APIService(sessionStorage.getItem("jwt")));
    } else {
      handleSetAttributes();
    }
  }, [API]);

  const handleSetAttributes = () => {
    setShowSpinner(true);
    API.Attribute.getAllFromEntity(id)
      .then((res) => {
        setAttributes(res.data);
      })
      .catch((err) => {
        throw new Error("GET attributes from entity error: " + err);
      })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  return (
    <Card
      title={"Attributes"}
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
            <a className="utrecht-link" onClick={handleSetAttributes}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to={`/attributes/new/${id}`}>
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
              ) : attributes ? (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Type",
                      field: "type",
                    },
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link to={`/attributes/${item.id}/${id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={attributes}
                />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Type",
                      field: "type",
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
