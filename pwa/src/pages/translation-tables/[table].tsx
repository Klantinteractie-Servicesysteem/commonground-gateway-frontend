import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationTable from "../../components/translations/translationTable";
import TranslationForm from "../../components/translations/translationForm";

const IndexPage = (props) => {
  const tableName: string = props.params.id === "new" ? null : props.params.table


  return (
    <Layout title={"Translation table"} subtext={tableName !== "new" ? "An overview of your translation objects" : "Create a new translation table"}>
      <title>Gateway - {tableName !== "new" ? "Translations" : "Translation table"}</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              {tableName !== "new" ?
                <TranslationTable tableName={tableName} /> :
                <TranslationForm tableName={tableName} />
              }
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
