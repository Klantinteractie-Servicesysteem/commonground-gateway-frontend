import * as React from "react";
import Layout from "../../components/common/layout";
import SoapForm from "../../components/soap/soapForm";

const IndexPage = (props) => {
  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <SoapForm id={props.params.id} />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
