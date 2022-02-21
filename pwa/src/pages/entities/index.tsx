import * as React from "react";
import EntitiesTable from "../../components/entities/entitiesTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <EntitiesTable />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
