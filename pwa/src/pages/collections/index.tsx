import * as React from "react";
import CollectionTable from "../../components/collections/collectionTable";

const IndexPage = () => {
  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="page-top-item">
            <CollectionTable />
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
