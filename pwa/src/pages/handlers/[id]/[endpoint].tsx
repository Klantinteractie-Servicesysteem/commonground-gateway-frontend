import * as React from "react";
import Layout from "../../../components/common/layout";
import HandlerForm from "../../../components/handlers/handlerForm";

const IndexPage = ({ id, endpoint, pageContext }) => {
  return (
    <Layout title={"Handler properties"} subtext={"Create or edit your properties"} pageContext={pageContext} >
      <main>
        <div className="row">
          <div className="col-12">
            <HandlerForm id={id} endpointId={endpoint} />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default IndexPage;
