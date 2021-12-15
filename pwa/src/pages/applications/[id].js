import * as React from "react";
import Layout from "../../components/common/layout";
import ApplicationForm from "../../components/applications/applicationForm";

const IndexPage = (props) => {
  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <ApplicationForm id={props.params.id}/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
