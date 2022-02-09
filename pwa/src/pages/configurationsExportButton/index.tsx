import * as React from "react"
import Layout from "../../components/common/layout";
import ConfigurationsExportButton from "../../components/configurationsExportButton/ConfigurationsExportButton";

const IndexPage = () => {
  return (
    <Layout title={"ConfigurationsExportButton"} subtext={"An overview of your endpoints objects"}>
      <title>Gateway - ConfigurationsExportButton</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="utrecht-page">
              <ConfigurationsExportButton />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
