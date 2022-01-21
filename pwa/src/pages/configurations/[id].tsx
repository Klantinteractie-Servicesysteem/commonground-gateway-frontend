import * as React from "react"
import Layout from "../../components/common/layout";
import ConfigurationForm from "../../components/configurations/configurationForm";

const IndexPage = (props) => {
  return (
    <Layout title='Configuration' subtext="Edit your configuration here">
      <main>
        <div className="row">
          <div className="col-12">
            <ConfigurationForm id={props.params.id}/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
