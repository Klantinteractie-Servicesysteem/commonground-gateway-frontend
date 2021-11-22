import * as React from "react";
import {Link} from "../../../.cache/gatsby-browser-entry";

export default function TableCells({cellItems}) {
  console.log(cellItems)
  const tableCells = cellItems.map((item) =>
    <td>{item.name !== 'button' ? item.name : <Link to={item.link}><button className="utrecht-button btn-sm btn-success"><i className="fas fa-edit pr-1"></i>Edit</button></Link>}</td>
  )

  return (
    <tr>
      {
        tableCells
      }
    </tr>
  );
}
