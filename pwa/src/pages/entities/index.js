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
            <Breadcrumbs items={[{ name: 'Home/', href: '/' }, { name: 'Entities' }]} />
            <h1 className="utrecht-heading-1 utrecht-heading-1--distanced">Entities</h1>
            <h4 className="utrecht-heading-4 utrecht-heading-4--distanced">
              U can view your entities here.</h4>

            <Link to="/entities/new">
              <button className="utrecht-button float-right" type="button">Create entity</button>
            </Link>

            <div className="utrecht-html">
              <EntitiesTable/>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage
