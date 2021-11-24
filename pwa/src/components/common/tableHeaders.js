import * as React from "react";


/**
 * This TableHeaders .
 *
 * @param {object|null} headerItems set the name in the header.
 */

export default function TableHeaders({headerItems}) {

  const tableHeaders = headerItems.map((item) =>
    <th scope="col">{item.name}</th>
  )

  return (
    <thead>
    <tr>
      {
        tableHeaders
      }
    </tr>
    </thead>
  );
}
