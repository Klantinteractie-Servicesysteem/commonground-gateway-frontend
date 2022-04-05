import * as React from "react";
import { Table, Card, Spinner } from "@conductionnl/nl-design-system/lib";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import LabelWithBackground from "../LabelWithBackground/LabelWithBackground";
import DeleteModal from "../deleteModal/DeleteModal";
import { useQueryClient } from "react-query";
import { useSubscriber } from "../../hooks/subscriber";

export default function SubscribersTable({ entityId }) {
  const queryClient = useQueryClient();
  const _useSubscriber = useSubscriber(queryClient);
  const getSubscribers = _useSubscriber.getAllFromEntity(entityId);
  const deleteSubscriber = _useSubscriber.remove();

  return (
    <Card
      title={"Subscribers"}
      cardHeader={function () {
        return (
          <>
            <button
              className="button-no-style utrecht-link"
              disabled={getSubscribers.isFetching}
              onClick={() => {
                queryClient.invalidateQueries("handlers");
              }}
            >
              <i className="fas fa-sync-alt mr-1" />
              <span className="mr-2">{getSubscribers.isFetching ? "Fetching data..." : "Refresh"}</span>
            </button>
            <Link to={`/entities/${entityId}/subscribers/new`}>
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
              {getSubscribers.isLoading ? (
                <Spinner />
              ) : (
                <Table
                  columns={[
                    {
                      headerName: "Name",
                      field: "name",
                    },
                    {
                      headerName: "Method",
                      field: "method",
                      renderCell: (item: { method: string }) => (
                        <LabelWithBackground label={item.method} type="primary" />
                      ),
                    },
                    {
                      headerName: "Endpoint",
                      field: "endpoint",
                      valueFormatter: (item) => {
                        return item ? item.name : "";
                      },
                    },
                    {
                      field: "id",
                      headerName: "",
                      renderCell: (item) => {
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
                              resourceDelete={() => deleteSubscriber.mutateAsync({ id: item.id })}
                              resourceId={item.id}
                            />
                            <Link
                              className="utrecht-link d-flex justify-content-end"
                              to={`/entities/${entityId}/subscribers/${item.id}`}
                            >
                              <button className="utrecht-button btn-sm btn-success">
                                <FontAwesomeIcon icon={faEdit} /> Edit
                              </button>
                            </Link>
                          </div>
                        );
                      },
                    },
                  ]}
                  rows={getSubscribers.data ?? []}
                />
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
