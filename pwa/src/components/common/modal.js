import React from "react"
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
        < button type="button" class="btn btn-primary" data-toggle="modal" data-target={"#" + id}>
          Launch demo modal
        </button>
      }
      <div class="modal fade" id={id} tabindex="-1" role="dialog" aria-labelledby={id + "Label"} aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id={id + "Label"}>Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {content}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              {
                save === true &&
                <button type="button" class="btn btn-primary">Save changes</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
