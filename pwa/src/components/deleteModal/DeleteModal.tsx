import * as React from "react";
import "./deleteModal.css";
import { Modal } from "@conductionnl/nl-design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeleteModalProps {
  resourceDelete: () => void;
  resourceId: any;
  optionalLength?: number;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ resourceDelete, resourceId, optionalLength }) => {
  return (
    <div className="DeleteModal">
      <Modal
        title="Warning!"
        id={`deleteModal${resourceId}`}
        body={function () {
          return (
            <>
              <p>
                Are you sure you want to delete {resourceId}? <br></br>
                {optionalLength === 1 && (
                  <b>If you delete this translation you wil also delete the Translation Table!</b>
                )}
              </p>
              <br></br>
              <button className="utrecht-button  btn-sm mr-2" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                className="utrecht-button delete-btn-right btn-sm btn-danger mr-2"
                onClick={() => resourceDelete(resourceId)}
                data-bs-dismiss="modal"
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
            </>
          );
        }}
      />
    </div>
  );
};

export default DeleteModal;
