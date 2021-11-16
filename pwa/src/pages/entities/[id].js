import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import ActionMenu from "../../components/common/actionMenu";
import AttributeTable from "../../components/attributes/attributeTable";
import LogsTable from "../../components/entities/logsTable";
import DataTable from "../../components/entities/dataTable";
import EntityForm from "../../components/entities/entityForm";
import Tabs from "../../components/common/tabs";


const IndexPage = (props) => {
  return (
    <Layout title={"Entity"} subtext={"Add or modify your entity"}>
      <main>
        <div className="row">
          <div className="col-12">

            <div className="page-top-item">
              <Tabs items={[{name: 'Main', id: 'main', active: true}, {name: 'Attributes', id: 'attributes'}, {name: 'Data', id: 'data'}, {name: 'Logs', id: 'logs'}]}/>
            </div>

            <div className="tab-content">
              <div className="tab-pane active" id="main" role="tabpanel" aria-labelledby="main-tab"><br/>
                <EntityForm id={props.params.id}/>
              </div>
              <div className="tab-pane" id="attributes" role="tabpanel" aria-labelledby="attributes-tab"><br/>
                <AttributeTable/>
              </div>
              <div className="tab-pane" id="data" role="tabpanel" aria-labelledby="data-tab"><br/>
                <DataTable/>
              </div>
              <div className="tab-pane" id="logs" role="tabpanel" aria-labelledby="data-tab"><br/>
                <LogsTable/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
