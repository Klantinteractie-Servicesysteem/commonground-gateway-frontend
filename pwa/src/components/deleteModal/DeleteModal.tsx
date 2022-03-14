import * as React from "react";
import "./deleteModal.css";
import { Modal } from "@conductionnl/nl-design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

interface DeleteModalProps {
  resourceDelete: (resourceId) => void;
  resourceId: string;
  optionalMessage?: JSX.Element;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ resourceDelete, resourceId, optionalMessage }) => {
  return (
    <div className="DeleteModal">
      <Modal
        title="Warning!"
        id={`deleteModal${resourceId}`}
        body={() => (
          <>
            <div className="DeleteModal-messageContainer">
              <span>Are you sure you want to delete this resource?</span>
              <span>{optionalMessage}</span>
            </div>
            <div className="DeleteModal-buttonContainer">
              <button className="utrecht-button btn-light btn-sm mr-2" data-bs-dismiss="modal">
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
              <button
                className="utrecht-button btn-sm btn-danger mr-2"
                onClick={() => resourceDelete(resourceId)}
                data-bs-dismiss="modal"
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default DeleteModal;
