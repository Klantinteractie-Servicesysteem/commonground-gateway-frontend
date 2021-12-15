import * as React from "react"
import Layout from "../../components/common/layout";
import ApplicationsTable from "../../components/applications/applicationsTable";

const IndexPage = () => {
  return (
    <Layout title={"Applications"} subtext={"An overview of your applications objects"}>
      <title>Gateway - Entities</title>
      <main>
        <div className="row">
          <div className="col-12">
            <ApplicationsTable />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
