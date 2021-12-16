import * as React from "react";
import Layout from "../../components/common/layout";
import SoapForm from "../../components/soap/soapForm";

const IndexPage = (props) => {
  return (
    <Layout title={"Soap"} subtext={"Edit or create a soap object"}>
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
