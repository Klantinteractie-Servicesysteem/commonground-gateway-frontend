import * as React from "react"
import Layout from "../../components/common/layout";
import ApplicationsTable from "../../components/applications/applicationsTable";

const IndexPage = ({pageContext}) => {
  return (
    <Layout title={"Applications"} subtext={"An overview of your applications objects"} pageContext={pageContext}>
      <title>Gateway - Entities</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <ApplicationsTable/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
