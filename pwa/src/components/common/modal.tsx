import * as React from "react";
import "bootstrap/dist/css/bootstrap.css";

/**
 * This Modal.
 *
 * @param {string} id set the name in the cell key.
 * @param {string} title set the name in the cell.
 * @param {boolean} hideButton control right or wrong for id and title.
 * @param {string} buttonText Save the text we need.
 * @param {string} content Save the text we need.
 * @param {boolean} save control right or wrong  for save the data.
 */


export default function Modal({ id = 'firstModal', title = "ModalTitle", hideButton = false, buttonText = 'Open modal', content = "Give your content to the react component", save = false }) {
  return (
    <>
      {
        hideButton === false &&
        < button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#" + id}>
          Launch demo modal
        </button>
      }
      <div className="modal fade" id={id} table-Index="-1" role="dialog" aria-labelledby={id + "Label"} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={id + "Label"}>Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {content}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              {
                save === true &&
                <button type="button" className="btn btn-primary">Save changes</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
