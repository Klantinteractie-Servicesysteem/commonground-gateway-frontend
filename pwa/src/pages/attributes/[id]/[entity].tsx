import * as React from "react";
import Layout from "../../../components/common/layout";
import AttributeForm from "../../../components/attributes/attribuutForm";

const IndexPage = ({ id, entity }) => {
  return (
    <Layout title={"Properties"} subtext={"Create or edit your properties"}>
      <main>
        <div className="row">
          <div className="col-12">
            <AttributeForm id={id} entity={entity} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage;
