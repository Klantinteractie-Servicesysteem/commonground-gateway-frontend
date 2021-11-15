import * as React from "react";
// import {useGet} from "restful-react";

export default function EntitiesTable() {

  // var {data: logs} = useGet({
  //   path: "/change_logs"
  // });
  // if (logs != null) {
  //   console.log(logs);
  // }
  //
  // /* lets catch hydra */
  // if (logs != null && logs["results"] !== undefined) {
  //   logs = logs["results"];
  //
  //   for (let i = 0; i < logs.length; i++) {
  //     logs[i].id = logs[i].identificatie;
  //   }
  // }

  return (
    <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren." style={{width: "100%"}}>
      <caption>Hier kunnen we een caption neerzetten</caption>
      <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col" className="numeric">Endpoint</th>
        <th scope="col" className="numeric">Route</th>
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
