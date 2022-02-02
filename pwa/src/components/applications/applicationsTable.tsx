import * as React from "react";
import {
  Card,
  Table,
  Spinner,
  Modal,
} from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";

import { InfoOverlay } from "../../components/common/infoOverlay/infoOverlay";

export default function ApplicationsTable() {
  const [applications, setApplications] = React.useState(null);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [API, setAPI] = React.useState<APIService>(null);
  const [overlay, setOverlay] = React.useState(false);

  React.useEffect(() => {
    if (!API) {
      setAPI(new APIService(sessionStorage.getItem("jwt")));
    } else {
      handleSetApplications();
    }
  }, [API]);

  const handleSetApplications = () => {
    setShowSpinner(true);
    API.Application.getAll()
      .then((res) => {
        setApplications(res.data);
      })
      // .catch((err) => {
      //   throw new Error("GET Applications error: " + err);
      // })
      .finally(() => {
        setShowSpinner(false);
      });
  };

  return (
    <Card
      title={"Applications"}
      cardHeader={function () {
        return (
          <>
            <button
              type="button"
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target={`#helpModal`}
              id="welcomeModalButton"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>

            <InfoOverlay
              title={"Help Overlay"}
              id="helpModal"
              body={() => {
                return (
                  <>
                    <ul>
                      <li>Link to docs</li>
                    </ul>
                  </>
                );
              }}
            />

            <a className="utrecht-link" onClick={handleSetApplications}>
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">Refresh</span>
            </a>
            <Link to="/applications/new">
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
              ) : applications ? (
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
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <Link to={`/applications/${item.id}`}>
                            <button className="utrecht-button btn-sm btn-success">
                              <i className="fas fa-edit pr-1" />
                              Edit
                            </button>
                          </Link>
                        );
                      },
                    },
                  ]}
                  rows={applications}
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
                  rows={[{ name: "No results found", description: " " }]}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
