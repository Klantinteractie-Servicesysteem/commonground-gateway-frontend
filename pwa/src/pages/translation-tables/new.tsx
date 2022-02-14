import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationForm from "../../components/translations/TranslationForm";

const IndexPage = (props) => {
  const tableName: string = props.params.table


  return (
    <Layout title={"Translation table"} subtext={"An overview of your translation objects"}>
      <title>Gateway - {"Translation table"}</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationForm id={tableName} tableName="new" />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
