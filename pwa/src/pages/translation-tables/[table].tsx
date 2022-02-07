import * as React from "react";
import Layout from "../../components/common/layout";
import TranslationTable from "../../components/translations/translationTable";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id


  return (
    <Layout title={"Translations"} subtext={"An overview of your translation objects"}>
      <title>Gateway - Translations</title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationTable id={id} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
