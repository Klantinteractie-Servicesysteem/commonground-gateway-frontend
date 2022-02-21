import * as React from "react";
import Layout from "../../components/common/layout";
import EndpointsTable from "../../components/endpoints/endpointsTable";

const IndexPage = () => {
  return (
    <Layout title={"Endpoints"} subtext={"An overview of your endpoints objects"}>
      <title>Gateway - Endpoints</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <EndpointsTable />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
