import * as React from "react";
import Layout from "../../components/common/layout";
import SoapForm from "../../components/soaps/soapForm";

const IndexPage = (props) => {
  return (
    <Layout title={"Soaps"} subtext={"Edit or create a soaps object"}>
      <title>Gateway - Soaps</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <SoapForm id={props.params.id} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
