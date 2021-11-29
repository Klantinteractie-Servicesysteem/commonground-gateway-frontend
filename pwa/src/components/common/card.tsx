import * as React from "react";
import CardHeader from "./cardHeader";

/**
 * This components renders a bootstrap card.
 *
 * @param {object} children Content that is rendered as body of the card.
 * @param {string} title Title of this card.
 * @param {string|null} modal Modal the help button will open inside CardHeader.
 * @param {string|null} refresh Function the refresh button will execute inside CardHeader.
 * @param {string|null} add Link you will go to when you want to add a item inside CardHeader.
 * @param {string|null} back Link you will go to when you want to return to the previous page inside CardHeader.
 * @param {string|null} save Function the save button will execute inside CardHeader.
 * @param {string|null} onlySaveIf This variable must not be null (if given) if you want to be able to save inside CardHeader.
 * @returns TSX of the generated Card.
 */
export default function Card({ children, title = 'Title', modal = null, refresh = null, add = null, back = null, save = null, onlySaveIf = undefined}) {

  return (
    <div className="utrecht-card card">
      <CardHeader title={title} modal={modal} refresh={refresh} add={add} back={back} save={save} onlySaveIf={onlySaveIf} />
      <div className="utrecht-card-body card-body">
        {children}
      </div>
    </div>
  );
}
