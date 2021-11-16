import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import ActionMenu from "../../components/common/actionMenu";
import AttributeTable from "../../components/entities/attributeTable";
import LogsTable from "../../components/entities/logsTable";
import EntityForm from "../../components/entities/entityForm";


const IndexPage = () => {
  return (
    <Layout>
      <main>
        <div className="row">
          <div className="col-12">
            <Breadcrumbs items={[{ name: 'Home/', href: '/' }, { name: 'Entities/', href: '/entities' }, { name: 'Attributes' }]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Attributes</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              U can view your entity with attributes here.</h4>
            <div className="utrecht-html">
              <AttributeTable/>
            </div>
            <br/>
            <EntityForm/>
            <br/>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              U can view your logs from this entity here.</h4>
            <div className="utrecht-html">
              <LogsTable/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
