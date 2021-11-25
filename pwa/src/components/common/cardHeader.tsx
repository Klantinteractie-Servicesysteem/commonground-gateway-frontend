import * as React from "react";
import { Link } from "gatsby";

/**
 * This components renders a card header.
 *
 * @param {string} title Title of this card.
 * @param {string|null} modal Modal the help button will open.
 * @param {string|null} refresh Function the refresh button will execute.
 * @param {string|null} add Link you will go to when you want to add a item.
 * @param {string|null} back Link you will go to when you want to return to the previous page.
 * @param {string|null} save Function the save button will execute.
 * @param {string|null} onlySaveIf This variable must not be null (if given) if you want to be able to save.
 * @returns TSX of the generated CardHeader.
 */
export default function CardHeader({
  title = "Title",
  modal = null,
  refresh = null,
  add = null,
  back = null,
  save = null,
  onlySaveIf = undefined,
}) {
  return (
    <div className="utrecht-card-header card-header">
      <div className="utrecht-card-head-row card-head-row row">
        <div className="col-6">
          <h4 className="utrecht-heading-4 utrecht-heading-4--distanced utrecht-card-title">{title}</h4>
        </div>
        <div className="col-6 text-right">
          {modal !== null && (
            <button className="utrecht-link button-no-style" data-toggle="modal" data-target={modal}>
              <i className="fas fa-question mr-1"></i>
              <span className="mr-2">Help</span>
            </button>
          )}
          {back !== null && (
            <Link className="utrecht-link" to={back}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-danger mr-2">
                <i className="fas fa-long-arrow-alt-left mr-2"></i>Back
              </button>
            </Link>
          )}
          {refresh !== null && (
            <a className="utrecht-link" onClick={refresh}>
              <i className="fas fa-sync-alt mr-1"></i>
              <span className="mr-2">Refresh</span>
            </a>
          )}
          {add !== null && (
            <Link to={add}>
              <button className="utrecht-button utrecht-button-sm btn-sm btn-success">
                <i className="fas fa-plus mr-2"></i>Add
              </button>
            </Link>
          )}
          {save !== null && onlySaveIf == undefined && (
            <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
              <i className="fas fa-save mr-2"></i>Save
            </button>
          )}
          {save !== null && onlySaveIf !== undefined && onlySaveIf !== null && onlySaveIf.length > 0 && (
            <button className="utrecht-button utrecht-button-sm btn-sm btn-success" type="submit">
              <i className="fas fa-save mr-2"></i>Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
