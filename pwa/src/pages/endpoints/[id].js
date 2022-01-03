import * as React from "react";
import Layout from "../../components/common/layout";
import EndpointForm from "../../components/endpoints/endpointForm";

const IndexPage = (props) => {
  return (
    <Layout title="Endpoint" subtext="Edit your endpoint here">
      <main>
        <div className="row">
          <div className="col-12">
            <EndpointForm id={props.params.id}/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
