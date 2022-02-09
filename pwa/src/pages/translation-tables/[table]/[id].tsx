import { title } from "process";
import * as React from "react";
import Layout from "../../../components/common/layout";
import TranslationForm from "../../../components/translations/translationForm";

const IndexPage = (props) => {
  const id: string = props.params.id === "new" ? null : props.params.id;
  const tableName = props.params.table;


  return (
    <Layout title={"Translation"} subtext={id ? "Edit your translation" : "Create a new translation"}>
      <title>Gateway - Translation </title>
      <main>
        <div className="row">
          <div className="col-12">
            <div className="page-top-item">
              <TranslationForm id={id} tableName={tableName} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
