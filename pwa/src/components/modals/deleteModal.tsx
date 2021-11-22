import * as React from "react";
import { useUrlContext } from "../../context/urlContext";
import { closeModal } from "../utility/elementCreation";

export default function DeleteModal({ data, useFunction }) {
  const context = useUrlContext();

  const handleDelete = () => {
    closeModal(data.id.replaceAll("-", ""));
    fetch(`${context.baseUrl}${data["@id"]}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      if (useFunction) {
        useFunction();
      }
    });
  };
  return (
    <div
      className="modal fade"
      tabIndex={-1}
      id={`item-${data.id.replaceAll("-", "")}`}
      aria-labelledby={`item-${data.id.replaceAll("-", "")}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete {data.name}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete the object with the following
              name: {data.name}
            </p>
          </div>
          <div
            className="modal-footer"
            id={`modalFooter${data.id.replaceAll("-", "")}`}
          >
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
