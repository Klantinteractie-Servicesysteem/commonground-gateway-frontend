import * as React from "react";
import { Link } from "gatsby";


export default function AttributeTable() {

  return (
    <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren." style={{width: "100%"}}>
      <caption>Hier kunnen we een caption neerzetten</caption>
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col" className="numeric">Type</th>
        <th scope="col" className="text"></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td><a className="utrecht-link utrecht-link--hover" href="#">Bekijken</a></td>
      </tr>
      </tbody>
    </table>
  );
}
