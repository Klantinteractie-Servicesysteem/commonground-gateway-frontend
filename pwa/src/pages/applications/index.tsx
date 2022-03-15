import * as React from "react";
import ApplicationsTable from "../../components/applications/applicationsTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <ApplicationsTable />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
