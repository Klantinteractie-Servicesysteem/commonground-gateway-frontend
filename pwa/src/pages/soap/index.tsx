import * as React from "react";
import Layout from "../../components/common/layout";
import SoapTable from "../../components/soap/soapTable";

const IndexPage = () => {
  return (
    <Layout title={"Soap"} subtext={"An overview of your soap objects"}>
      <title>Gateway - Entities</title>
      <main>
        <div className="row">
          <div className="col-12">
            <SoapTable />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
