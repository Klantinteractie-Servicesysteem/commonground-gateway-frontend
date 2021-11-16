import * as React from "react"
import Layout from "../../components/common/layout";
import Breadcrumbs from "../../components/common/breadcrumbs";
import ActionMenu from "../../components/common/actionMenu";
import EntitiesTable from "../../components/entities/entitiesTable";
import {Link} from "gatsby";

const IndexPage = () => {
  return (
    <Layout title={"Entities"} subtext={"An overview of your Entity objects"}>
      <main>
        <div className="row">
          <div className="col-12">
              <EntitiesTable/>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
