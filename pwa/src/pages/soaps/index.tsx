import * as React from "react";
import Layout from "../../components/common/layout";
import SoapsTable from "../../components/soaps/soapsTable";

const IndexPage = () => {
  return (
    <Layout title={"Soaps"} subtext={"An overview of your soaps objects"}>
      <title>Gateway - Soaps</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <SoapsTable />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
