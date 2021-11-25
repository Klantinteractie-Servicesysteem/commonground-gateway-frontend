import * as React from "react";
import { Link } from "gatsby";

export default function Table({
  properties = [{ th: "Name", property: "name" }],
  items = null,
  editLink = null,
  parentLink = null,
}) {
  /**
   * This components renders a table.
   *
   * @param {array} properties This array hold objects with a th which is a thead item and a property which is used to render data in rows with the given items.
   * @param {array} items This array hold data that is used to render rows.
   * @param {string} editLink Link to page where you can edit a item.
   * @returns TSX of the generated Table.
   */

  return (
    <div className="utrecht-html">
      <table lang="nl" summary="Table." className="table">
        {/*<caption></caption>*/}
        <thead>
          <tr>
            {properties.map(row => (
              <th scope="col">{row.th}</th>
            ))}
            {editLink !== null && <th></th>}
          </tr>
        </thead>
        {items !== null && items.length > 0 ? (
          <tbody>
            {items.map(item => (
              <tr>
                {properties.map(row => (
                  <td>{item[row.property]}</td>
                ))}
                {editLink !== null && (
                  <td className="text-right">
                    <Link to={parentLink !== null ? `${editLink}/${item.id}/${parentLink}` : `${editLink}/${item.id}`}>
                      <button className="utrecht-button btn-sm btn-success">
                        <i className="fas fa-edit pr-1"></i>Edit
                      </button>
                    </Link>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>No results found</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
