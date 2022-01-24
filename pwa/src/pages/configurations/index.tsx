import * as React from "react"
import Layout from "../../components/common/layout";
import Configurations from "../../components/configurations/configurations";

const IndexPage = () => {
  return (
    <Layout title={"Configurations"} subtext={"An overview of your configurations"}>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <Configurations/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
