import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationsTable from "../../components/translations/translationsTable";

const IndexPage = () => {
  return (
    <Layout title={"Translations"} subtext={"An overview of your translation objects"}>
      <title>Gateway - Translations</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationsTable />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
