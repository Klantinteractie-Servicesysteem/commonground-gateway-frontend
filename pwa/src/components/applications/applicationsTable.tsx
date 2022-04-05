import * as React from "react";
import { Card, Table, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import { useQueryClient } from "react-query";
import { useApplication } from "../../hooks/application";

export default function ApplicationsTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const getApplications = _useApplication.getAll();
  const deleteApplication = _useApplication.remove();

  React.useEffect(() => {
    setHeader("Applications");
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  const handleSetDocumentation = (): void => {
    API.Documentation.get("applications")
      .then((res) => {
        setDocumentation(res.data.content);
      })
      .catch((err) => {
        setAlert({ message: err, type: "danger" });
        throw new Error("GET Documentation error: " + err);
      });
  };

  return (
    <Card
      title={"Applications"}
      cardHeader={function () {
        return (
          <>
            <button
              className="utrecht-link button-no-style"
              data-bs-toggle="modal"
              data-bs-target="#applicationHelpModal"
            >
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Application Documentation"
              id="applicationHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <button
              className="button-no-style utrecht-link"
              disabled={getApplications.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("applications");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getApplications.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
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
              {getApplications.isLoading ? (
                <Spinner />
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
                    {
                      field: "id",
                      headerName: " ",
                      renderCell: (item: { id: string }) => {
                        return (
                          <div className="utrecht-link d-flex justify-content-end">
                            <button
                              className="utrecht-button btn-sm btn-danger mr-2"
                              data-bs-toggle="modal"
                              data-bs-target={`#deleteModal${item.id.replace(new RegExp("-", "g"), "")}`}
                            >
                              <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                            <DeleteModal
                              resourceDelete={() => deleteApplication.mutateAsync({ id: item.id })}
                              resourceId={item.id}
                            />
                            <Link to={`/applications/${item.id}`}>
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={getApplications.data ?? []}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
