import * as React from "react";
import Layout from "../../../components/common/layout";
import TranslationTable from "../../../components/translations/translationTable";

const IndexPage = (props) => {
  const tableName: string = props.params.table


  return (
    <Layout title={"Translation table"} subtext={"An overview of your translation objects"}>
      <title>Gateway - {tableName !== "new" ? "Translations" : "Translation table"}</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationTable tableName={tableName} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
