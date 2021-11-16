import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import ActionMenu from "../../components/common/actionMenu";
import AttributeTable from "../../components/attributes/attributeTable";
import LogsTable from "../../components/entities/logsTable";
import EntityForm from "../../components/entities/entityForm";
import AttributeForm from "../../components/attributes/attribuutForm";


const IndexPage = () => {
  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <AttributeForm/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
