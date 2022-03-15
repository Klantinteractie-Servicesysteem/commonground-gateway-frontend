import * as React from "react";
import SourcesTable from "../../components/sources/sourcesTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <SourcesTable />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
