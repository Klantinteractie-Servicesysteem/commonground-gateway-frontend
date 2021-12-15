import * as React from "react"
import Layout from "../../components/common/layout";
import ConfigurationsTable from "../../components/configurations/configurationsTable";

const IndexPage = () => {
  return (
    <Layout title={"Configurations"} subtext={"An overview of your configurations"}>
      <main>
        <div className="row">
          <div className="col-12">
            <ConfigurationsTable />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
