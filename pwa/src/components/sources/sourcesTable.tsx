import * as React from "react";
import { Link } from "gatsby";
import { Table, Card, Spinner, Modal } from "@conductionnl/nl-design-system/lib";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";
import { AlertContext } from "../../context/alertContext";
import { HeaderContext } from "../../context/headerContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import DeleteModal from "../deleteModal/DeleteModal";
import { useQueryClient } from "react-query";
import { useSource } from "../../hooks/source";

export default function SourcesTable() {
  const [documentation, setDocumentation] = React.useState<string>(null);
  const API: APIService = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setHeader] = React.useContext(HeaderContext);

  const queryClient = useQueryClient();

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();
  const deleteSource = _useSource.remove();

  React.useEffect(() => {
    setHeader("Sources");
  }, [setHeader]);

  React.useEffect(() => {
    handleSetDocumentation();
  });

  const handleSetDocumentation = (): void => {
    API.Documentation.get("sources")
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
      title={"Sources"}
      cardHeader={function () {
        return (
          <>
            <button className="utrecht-link button-no-style" data-bs-toggle="modal" data-bs-target="#sourceHelpModal">
              <i className="fas fa-question mr-1" />
              <span className="mr-2">Help</span>
            </button>
            <Modal
              title="Source Documentation"
              id="sourceHelpModal"
              body={() => <div dangerouslySetInnerHTML={{ __html: documentation }} />}
            />
            <button
              className="button-no-style utrecht-link"
              disabled={getSources.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("endpoints");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getSources.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            <Link to="/sources/new">
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
              {getSources.isLoading ? (
                <Spinner />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Location",
                      field: "location",
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
                              resourceDelete={() => deleteSource.mutateAsync({ id: item.id })}
                              resourceId={item.id}
                            />
                            <Link className="utrecht-link d-flex justify-content-end" to={`/sources/${item.id}`}>
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={getSources.data ?? []}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
