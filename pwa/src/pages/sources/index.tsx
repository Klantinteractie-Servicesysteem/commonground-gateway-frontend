import * as React from "react";
import Layout from "../../components/common/layout";
import SourcesTable from "../../components/sources/sourcesTable";

const IndexPage = () => {
  return (
    <Layout title={"Sources"} subtext={"An overview of your Source objects"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <SourcesTable/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
