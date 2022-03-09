import * as React from "react";
import "./deleteModal.css";
import { Modal } from "@conductionnl/nl-design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeleteModalProps {
  handleDelete: any;
  handleId: any;
  optionalLength?: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ handleDelete, handleId, optionalLength }) => {
  return (
    <div className="DeleteModal">
      <Modal
        title="Warning!"
        id={`deleteModal${handleId}`}
        body={function () {
          return (
            <>
              {optionalLength === 1 ? (
                <p>
                  Are you sure you want to delete {handleId}?{" "}
                  <b>If you delete this translation you wil also delete the Translation Table!</b>
                </p>
              ) : (
                <p>Are you sure you want to delete {handleId}?</p>
              )}
              <br></br>
              <button
                className="utrecht-button btn-sm btn-danger mr-2"
                onClick={() => handleDelete(handleId)}
                data-bs-dismiss="modal"
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </button>
              <button className="utrecht-button cancel-btn-right btn-sm mr-2" data-bs-dismiss="modal">
                Cancel  
              </button>
            </>
          );
        }}
      />
    </div>
  );
};

export default DeleteModal;
