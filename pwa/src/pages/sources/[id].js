import * as React from "react"
import Layout from "../../components/common/layout";
import SourceForm from "../../components/sources/sourceForm";

const IndexPage = (props) => {
  const [title] = React.useState("Source");

  return (
     <Layout title={title} subtext={"Edit or add your source here"}>
      <main>
        <div className="row">
          <div className="col-12">
            <SourceForm id={props.params.id}/>
          </div>
        </div>
      </main>
    </Layout>

  )
}

export default IndexPage
