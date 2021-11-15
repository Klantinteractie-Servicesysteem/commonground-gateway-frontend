import * as React from "react";

export default function LogsTable() {

  return (
    <div className="accordion" id="accordionPanelsStayOpenExample">
      <div className="accordion-item">
        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
          <button className="accordion-button" type="button" data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseOne">
            Logs entity
          </button>
        </h2>
        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse"
             aria-labelledby="panelsStayOpen-headingOne">
          <div className="accordion-body">
            <table lang="nl" summary="Overzicht van de stemmen voor en tegen het betaald parkeren."
                   style={{width: "100%"}}>
              <caption>U can view your logs from this entity here.</caption>
              <thead>
              <tr>
                <th scope="col">Action</th>
                {/*<th scope="col" className="numeric">ObjectId</th>*/}
                {/*<th scope="col" className="numeric">ObjectClass</th>*/}
                <th scope="col" className="text">Version</th>
                <th scope="col" className="text">Data</th>
                {/*<th scope="col" className="text">Username</th>*/}
                {/*<th scope="col" className="text">Session</th>*/}
                <th scope="col" className="text">Date created</th>
                <th scope="col" className="text">Date modified</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
