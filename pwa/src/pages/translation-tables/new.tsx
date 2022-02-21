import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationTableForm from "../../components/translations/TranslationTableForm";

const IndexPage = () => {

  return (
    <Layout title={"Translation table"} subtext={"Create a new translation table"}>
      <title>Gateway - {"Translation table"}</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationTableForm tableName="new" />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
