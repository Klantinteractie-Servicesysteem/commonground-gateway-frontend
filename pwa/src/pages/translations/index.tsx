import * as React from "react";
import TableNamesTable from "../../components/translations/tableNamesTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <TableNamesTable/>
          </div>
        </div>
      </div>
    </main>
  )
}

export default IndexPage;
