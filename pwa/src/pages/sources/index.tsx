import * as React from "react";
import Layout from "../../components/common/layout";
import SourcesTable from "../../components/sources/sourcesTable";

const IndexPage = () => {
  // @ts-ignore
  return (
    <Layout title={"Sources"} subtext={
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#">Home</a></li>
          <li className="breadcrumb-item active" aria-current="page">Library</li>
        </ol>
    }>

      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <SourcesTable />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
